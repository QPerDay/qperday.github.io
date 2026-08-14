#!/usr/bin/env node
// Generate llms.txt (and llms-full.txt) into dist/, following the llmstxt.org
// convention: a plain-Markdown index of a site that an LLM can read to find
// relevant pages, plus an optional full-content file.
//
//   node scripts/generate-llms.mjs
//
// Run after `vite build` and the prerender pass (dist/ exists) but with the
// compiled content (src/generated/content.json) and the synced metadata
// (src/data/*.json) both present — i.e. as the final step of `pnpm build`.
//
// Everything is derived from the same metadata the site itself consumes, so
// the index never drifts out of sync with the pages that are actually
// deployed.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(siteRoot, 'dist')
const dataDir = path.join(siteRoot, 'src', 'data')
const contentDir = path.join(siteRoot, 'src', 'content')
const generatedContentFile = path.join(siteRoot, 'src', 'generated', 'content.json')

// Hosted at the domain root (https://qperday.github.io/).  Overridable so the
// file can be generated against a preview domain.
const BASE_URL = (process.env.SITE_URL ?? 'https://qperday.github.io').replace(/\/+$/, '')

const LOCALE = 'en' // site default; prose is en-US, Chinese only inside names

// Slugs that are development artifacts, not publishable content.
const EXCLUDED_BLOG_SLUGS = new Set(['test'])

// Mirrors src/lib/slug.ts exactly (lowercase + whitespace -> hyphen).
function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function listProblems() {
  const problems = []
  for (const file of readdirSync(dataDir).filter((f) => /^problem-.*\.json$/.test(f))) {
    problems.push(loadJson(path.join(dataDir, file)))
  }
  // Date IDs sort lexicographically == chronologically.
  return problems.sort((a, b) => a.id.localeCompare(b.id))
}

function listBlogEntries() {
  const content = loadJson(generatedContentFile)
  const bySlug = content[LOCALE] ?? {}
  return Object.values(bySlug)
    .filter((e) => !EXCLUDED_BLOG_SLUGS.has(e.slug))
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.slug.localeCompare(b.slug))
}

// Strip the leading `---`-fenced YAML frontmatter from a markdown file,
// returning just the body.  Mirrors src/lib/frontmatter.ts.
function stripFrontmatter(raw) {
  const m = /^---\s*\n[\s\S]*?\n---\s*\n?/.exec(raw)
  return m ? raw.slice(m[0].length) : raw
}

function url(p) {
  return `${BASE_URL}${p}`
}

// --- Problem metadata formatting ------------------------------------------

function describeProblem(p) {
  const bits = []
  if (p.date) bits.push(p.date)
  if (p.topic) bits.push(p.topic)
  if (p.difficulty != null) bits.push(`difficulty ${p.difficulty}/5`)
  if (p.setter?.length) bits.push(`by ${p.setter.join(', ')}`)
  if (p.status === 'err') bits.push('[err]')
  if (p.open) bits.push('answer withheld')
  return bits.join(' · ')
}

// --- llms.txt --------------------------------------------------------------

function buildIndex(problems, topics, tags, setters, entries) {
  const lines = []
  lines.push('# QPD — Question Per Day')
  lines.push('')
  lines.push(
    '> A curated collection of physics problems, published one per day by the QPD ' +
      'problem-setting group (SSBS \'28). Each problem carries a statement, a setter, a ' +
      'topic, atomic tags, and a difficulty rating, and — unless marked open — a worked ' +
      'answer. Problem content is CC BY 4.0; the site and tooling are MIT. This index is ' +
      'generated at build time.',
  )
  lines.push('')
  lines.push(`> Full content (blog articles and a complete problem index) is in [llms-full.txt](${url('/llms-full.txt')}).`)
  lines.push('')

  lines.push('## Index')
  lines.push('')
  lines.push(`- [Home](${url('/')}): landing page with today's problem.`)
  lines.push(`- [Problems](${url('/problem')}): browse, search, and filter the full problem set.`)
  lines.push(`- [Topics](${url('/topics')}): problems grouped by topic.`)
  lines.push(`- [Tags](${url('/tags')}): problems grouped by atomic concept tags.`)
  lines.push(`- [Setters](${url('/setters')}): authors and their problems.`)
  lines.push(`- [Blog](${url('/blog')}): in-depth articles and study guides.`)
  lines.push('')

  lines.push('## Problems')
  lines.push('')
  for (const p of problems) {
    const desc = describeProblem(p)
    lines.push(`- [${p.name}](${url(`/problem/${p.id}`)})${desc ? `: ${desc}` : ''}`)
  }
  lines.push('')

  lines.push('## Topics')
  lines.push('')
  for (const t of topics) {
    const desc = t.description ? `: ${t.description}` : ''
    lines.push(`- [${t.name}](${url(`/topics/${slugify(t.name)}`)})${desc}`)
  }
  lines.push('')

  lines.push('## Tags')
  lines.push('')
  for (const tag of tags) {
    lines.push(`- [${tag}](${url(`/tags/${slugify(tag)}`)})`)
  }
  lines.push('')

  lines.push('## Setters')
  lines.push('')
  for (const s of setters) {
    lines.push(`- [${s.name}](${url(`/setters/${slugify(s.name)}`)})`)
  }
  lines.push('')

  lines.push('## Blog')
  lines.push('')
  for (const e of entries) {
    const desc = e.description ? `: ${e.description}` : ''
    lines.push(`- [${e.title}](${url(`/blog/${e.slug}`)})${desc}`)
  }
  lines.push('')

  return lines.join('\n')
}

// --- llms-full.txt ---------------------------------------------------------

function buildFull(problems, topics, tags, setters, entries) {
  const lines = []
  lines.push('# QPD — Question Per Day (full)')
  lines.push('')
  lines.push(
    '> Full-content companion to llms.txt: the complete problem index (with statement ' +
      'and answer PDF links) plus the full text of every blog article. Problem ' +
      'statements and solutions are distributed as PDFs; their metadata is summarized here.',
  )
  lines.push('')
  lines.push('## Problem index')
  lines.push('')
  for (const p of problems) {
    lines.push(`### ${p.name}`)
    lines.push('')
    lines.push(`- Date: ${p.date || '—'}`)
    if (p.topic) lines.push(`- Topic: ${p.topic}`)
    if (p.difficulty != null) lines.push(`- Difficulty: ${p.difficulty}/5`)
    if (p.setter?.length) lines.push(`- Setter: ${p.setter.join(', ')}`)
    if (p.score) lines.push(`- Score: ${p.score}`)
    if (p.tags?.length) lines.push(`- Tags: ${p.tags.join(', ')}`)
    if (p.resources?.length) lines.push(`- Resources: ${p.resources.join(', ')}`)
    if (p.status === 'err') lines.push('- Status: err (known-broken)')
    if (p.open) lines.push('- Status: open (answer withheld)')
    lines.push(`- Page: ${url(`/problem/${p.id}`)}`)
    lines.push(`- Statement (PDF): ${url(`/data/${p.id}/statement.pdf`)}`)
    if (!p.open) lines.push(`- Answer (PDF): ${url(`/data/${p.id}/answer.pdf`)}`)
    lines.push('')
  }

  lines.push('## Blog')
  lines.push('')
  for (const e of entries) {
    lines.push(`## ${e.title}`)
    lines.push('')
    const file = path.join(contentDir, LOCALE, `${e.slug}.md`)
    let body = ''
    try {
      body = stripFrontmatter(readFileSync(file, 'utf8')).trim()
    } catch {
      body = `(source not found for ${e.slug})`
    }
    lines.push(body)
    lines.push('')
    lines.push(`[Permalink](${url(`/blog/${e.slug}`)})`)
    lines.push('')
  }

  return lines.join('\n')
}

// --- Main ------------------------------------------------------------------

function main() {
  const problems = listProblems()

  // The catalog (src/stores/catalog.ts) derives topics, setters, and tags from
  // problem metadata — not from topics.json/setters.json, which only supply
  // topic descriptions and setter contacts.  Mirror that so this index lists
  // exactly the pages the site renders.
  const topicSet = new Set()
  const setterSet = new Set()
  const tagSet = new Set()
  for (const p of problems) {
    if (p.topic) topicSet.add(p.topic)
    for (const s of p.setter ?? []) if (s) setterSet.add(s)
    for (const tag of p.tags ?? []) tagSet.add(tag)
  }

  const topicDescriptions = Object.fromEntries(
    loadJson(path.join(dataDir, 'topics.json')).map((t) => [t.name, t.description]),
  )
  const topics = [...topicSet]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, description: topicDescriptions[name] ?? '' }))
  const setters = [...setterSet].sort((a, b) => a.localeCompare(b)).map((name) => ({ name }))
  const tags = [...tagSet].sort()
  const entries = listBlogEntries()

  mkdirSync(distDir, { recursive: true })

  const index = buildIndex(problems, topics, tags, setters, entries)
  const full = buildFull(problems, topics, tags, setters, entries)

  writeFileSync(path.join(distDir, 'llms.txt'), index)
  writeFileSync(path.join(distDir, 'llms-full.txt'), full)

  console.log(
    `[llms] ${problems.length} problems, ${topics.length} topics, ${tags.length} tags, ` +
      `${setters.length} setters, ${entries.length} blog entries -> dist/llms.txt + dist/llms-full.txt`,
  )
}

main()
