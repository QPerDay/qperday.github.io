#!/usr/bin/env node
// Prerender pass: turns the Vite SPA build (dist/index.html + hashed assets)
// into a real static site — one dist/<route>/index.html per route, rendered
// through the SSR entry (dist-server/entry-server.js) with @vue/server-renderer,
// plus a real 404.html.  Run after the client build and the SSR build:
//
//   node scripts/prerender.mjs
//
// Route enumeration is filesystem + JSON (no import.meta.glob in Node):
//   - static routes: /, /blog, /problem, /topics, /tags, /setters
//   - /problem/{id}        from ../web/toc.json
//   - /topics/{slug}       distinct topics across src/data/problem-*.json
//   - /tags/{slug}         distinct tags across src/data/problem-*.json
//   - /setters/{slug}      distinct setters across src/data/problem-*.json
//   - /blog/{slug}         union of src/content/{en,zh}/*.md
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// The TeX export lives in the repo root (../web relative to site/).
const repoWebDir = path.resolve(siteRoot, '..', 'web')
const distDir = path.join(siteRoot, 'dist')

// Mirrors src/lib/slug.ts exactly (lowercase + whitespace -> hyphen).
function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

// --- Route enumeration -----------------------------------------------------

const problemIds = loadJson(path.join(repoWebDir, 'toc.json'))

// Distinct topics, setters, and tags across all problem metadata.  Mirrors
// src/stores/catalog.ts: the catalog is derived from problem metadata, not
// from topics.json/setters.json, which only supply descriptions/contacts.
// Deriving from metadata guarantees every enumerated /topics/:slug and
// /setters/:slug page actually resolves (setters.json lists only the setters
// with contact info, which is a subset).
const dataDir = path.join(siteRoot, 'src', 'data')
const topics = new Set()
const setters = new Set()
const tags = new Set()
for (const file of readdirSync(dataDir).filter((f) => /^problem-.*\.json$/.test(f))) {
  const p = loadJson(path.join(dataDir, file))
  if (p.topic) topics.add(p.topic)
  for (const s of p.setter ?? []) if (s) setters.add(s)
  for (const tag of p.tags ?? []) tags.add(tag)
}

// Blog slugs: union of both locale content dirs.
const blogSlugs = new Set()
for (const locale of ['en', 'zh']) {
  const dir = path.join(siteRoot, 'src', 'content', locale)
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    blogSlugs.add(file.replace(/\.md$/, ''))
  }
}

const routes = [
  '/',
  '/blog',
  '/problem',
  '/topics',
  '/tags',
  '/setters',
  ...problemIds.map((id) => `/problem/${id}`),
  ...[...topics].map((name) => `/topics/${slugify(name)}`),
  ...[...tags].map((tag) => `/tags/${slugify(tag)}`),
  ...[...setters].map((name) => `/setters/${slugify(name)}`),
  ...[...blogSlugs].map((slug) => `/blog/${slug}`),
]

// Deduplicate (slug collisions across names), preserving order.
const uniqueRoutes = []
{
  const seen = new Set()
  for (const route of routes) {
    if (seen.has(route)) {
      console.warn(`[prerender] duplicate route skipped: ${route}`)
      continue
    }
    seen.add(route)
    uniqueRoutes.push(route)
  }
}

// --- Render ------------------------------------------------------------------

const entryUrl = pathToFileURL(path.join(siteRoot, 'dist-server', 'entry-server.js')).href
const { render } = await import(entryUrl)

// Guard: the SSR bundle bakes the content.json that existed when it was
// built.  An interrupted `compile-content` run can leave a bootstrap-shaped
// file (metadata only, empty html) behind — baking it produces empty blog
// pages that then fail hydration.  Fail loudly before rendering anything.
const contentJson = JSON.parse(
  readFileSync(path.join(siteRoot, 'src/generated/content.json'), 'utf8'),
)
const anyEmptyHtml = Object.values(contentJson).some((bySlug) =>
  Object.values(bySlug).some((e) => !e.html),
)
if (anyEmptyHtml) {
  console.error(
    '[prerender] src/generated/content.json contains entries with empty html — ' +
      'an interrupted `compile-content` run left it in bootstrap state. ' +
      'Re-run the full build (`pnpm build`), which regenerates it.',
  )
  process.exit(1)
}

// The client build's dist/index.html is the page template (hashed asset URLs,
// placeholder comment, replaceable <title>).
const template = readFileSync(path.join(distDir, 'index.html'), 'utf8')

// The template must be the raw client-build output.  If dist/index.html is
// already a prerendered page it has no placeholder, and re-rendering over it
// would silently copy the homepage to every route — fail loudly instead.
if (!template.includes('<!--app-html-->')) {
  console.error(
    '[prerender] dist/index.html has no <!--app-html--> placeholder. ' +
      'Run the client `vite build` before the prerender (prerendered output is not a valid template).',
  )
  process.exit(1)
}

function buildPage(appHtml, title) {
  // Function replacers so `$` sequences in the HTML (KaTeX) aren't treated as
  // replacement patterns.
  return template
    .replace('<!--app-html-->', () => appHtml)
    .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
}

function writePage(route, page, outFileOverride) {
  const outFile =
    outFileOverride ??
    (route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html'))
  mkdirSync(path.dirname(outFile), { recursive: true })
  writeFileSync(outFile, page)
  console.log(`[prerender] ${route} -> ${path.relative(siteRoot, outFile)} (${page.length} bytes)`)
}

try {
  for (const route of uniqueRoutes) {
    const { html, title } = await render(route)
    writePage(route, buildPage(html, title))
  }

  // Real 404 page: render the catch-all route and save it as dist/404.html,
  // the file GitHub Pages serves for unmatched paths (also doubling as the
  // SPA fallback — it hydrates into the same app, so vue-router still
  // resolves unknown URLs client-side).
  const { html, title } = await render('/__prerender_missing__')
  writePage('/__prerender_missing__', buildPage(html, title), path.join(distDir, '404.html'))
} catch (error) {
  console.error('[prerender] FAILED:', error)
  process.exit(1)
}

console.log(`[prerender] done: ${uniqueRoutes.length} routes + 404.html`)
