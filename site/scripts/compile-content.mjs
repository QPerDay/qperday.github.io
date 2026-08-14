#!/usr/bin/env node
// Precompiles every `src/content/{locale}/{slug}.md` to HTML and writes
// `src/generated/content.json` — the single file the runtime content store
// (src/lib/content.ts) consumes.  The client never runs markdown-it, Shiki,
// KaTeX or the MDC content components.
//
// Two phases:
//
//  1. Bootstrap — write content.json with real frontmatter metadata but empty
//     `html`, so the module graph can load during phase 2 (content.ts, which
//     imports content.json, is itself imported by BlogEntryCard).  The shared
//     frontmatter helpers are loaded through a Vite dev server so TS and the
//     `yaml` dependency resolve.
//
//  2. Compile — bundle scripts/compile-entry.ts with `vite build --ssr` (a
//     production build, so `:pic` asset imports resolve to their final hashed
//     URLs and dev-only instrumentation is absent) and run it in Node.  Each
//     entry is rendered to HTML via @vue/server-renderer inside a throwaway
//     app with pinia + router + i18n installed.
//
// Run from the site/ directory:  node scripts/compile-content.mjs
import { createServer, build } from 'vite'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generatedDir = path.join(siteRoot, 'src/generated')
const outFile = path.join(generatedDir, 'content.json')
// Inside node_modules so it's gitignored and pnpm-managed; recreated on every run.
const compilerOutDir = path.join(siteRoot, 'node_modules', '.tmp', 'qpd-content-compiler')

const LOCALES = ['en', 'zh']

function listFiles() {
  const files = []
  for (const locale of LOCALES) {
    const dir = path.join(siteRoot, 'src/content', locale)
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      files.push({ locale, slug: name.replace(/\.md$/, ''), path: path.join(dir, name) })
    }
  }
  return files.sort((a, b) => a.locale.localeCompare(b.locale) || a.slug.localeCompare(b.slug))
}

// Phase 1: metadata-only content.json (html: ''), so `content.ts` loads during
// the phase-2 SSR build.  Uses the same helpers the final pass uses, so the
// metadata in both passes is identical.
async function bootstrap() {
  const server = await createServer({
    root: siteRoot,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  })
  try {
    const fm = await server.ssrLoadModule('/src/lib/frontmatter.ts')
    const data = {}
    for (const { locale, slug, path: file } of listFiles()) {
      const meta = fm.entryMetadata(locale, slug, readFileSync(file, 'utf8'))
      ;(data[locale] ??= {})[slug] = {
        ...meta,
        html: '',
        problemIds: [],
        entrySlugs: [],
        headings: [],
      }
    }
    mkdirSync(generatedDir, { recursive: true })
    writeFileSync(outFile, JSON.stringify(data, null, 2) + '\n')
  } finally {
    await server.close()
  }
}

// Phase 2: SSR-build the compiler entry, then run it in Node.
async function compile() {
  await build({
    root: siteRoot,
    configFile: path.join(siteRoot, 'vite.config.ts'),
    logLevel: 'info',
    build: {
      ssr: path.join(siteRoot, 'scripts/compile-entry.ts'),
      outDir: compilerOutDir,
      emptyOutDir: true,
      minify: false,
      sourcemap: false,
      // The compiler output is run once and thrown away; no need to copy public/.
      copyPublicDir: false,
    },
  })
  const entryUrl = pathToFileURL(path.join(compilerOutDir, 'compile-entry.js')).href
  const { compileContent } = await import(entryUrl)
  await compileContent({ siteRoot, outFile })
}

await bootstrap()
await compile()
