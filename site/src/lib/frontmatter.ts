import { parse as parseYaml } from 'yaml'

// Content entry metadata, shared between the content compiler (build time —
// scripts/compile-content.mjs + scripts/compile-entry.ts) and the runtime
// content store (src/lib/content.ts, which consumes src/generated/content.json).
// This module deliberately has no markdown/markdown-it/Shiki/KaTeX dependency,
// so importing it never pulls the compiler graph into the client.

export type Locale = string
export type Slug = string

// A heading in compiled content, with its stable anchor id (used by the TOC).
export interface HeadingItem {
  id: string
  text: string
  level: number
}

export interface ContentEntry {
  slug: string
  locale: string
  title: string
  description: string
  date: string
  author: string[] | 'all'
  /** Pre-rendered HTML body — markdown → HTML happens at compile time only. */
  html: string
  /** IDs referenced via `:problem-card{id=…}` components, in document order. */
  problemIds: string[]
  /** Blog slugs referenced via `:blog-entry-card{slug=…}` components. */
  entrySlugs: string[]
  /** Headings (h2+) with stable anchor ids, for the table of contents. */
  headings: HeadingItem[]
}

export interface Frontmatter {
  title?: unknown
  description?: unknown
  date?: unknown
  author?: unknown
}

// A leading `---`-fenced YAML block.  A file without one has empty frontmatter
// and its whole content is the body.
const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?/

export function parseFrontmatter(raw: string): Frontmatter {
  try {
    const parsed = parseYaml(raw)
    return (parsed && typeof parsed === 'object' ? parsed : {}) as Frontmatter
  } catch {
    return {}
  }
}

// Split a raw markdown file into its frontmatter and body.
export function splitFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  const m = FRONTMATTER_RE.exec(raw)
  if (!m) return { frontmatter: {}, body: raw }
  return { frontmatter: parseFrontmatter(m[1]!), body: raw.slice(m[0].length) }
}

export function coerceAuthor(value: unknown): string[] | 'all' {
  if (value === 'all') return 'all'
  if (Array.isArray(value)) return value.map((v) => String(v))
  if (typeof value === 'string') return [value]
  return []
}

// Derive the non-body fields of a ContentEntry from a raw file.  Used by both
// phases of the content compiler so metadata stays byte-identical between the
// bootstrap pass and the final compiled output.
export function entryMetadata(
  locale: Locale,
  slug: Slug,
  raw: string,
): Omit<ContentEntry, 'html' | 'problemIds' | 'entrySlugs' | 'headings'> {
  const { frontmatter } = splitFrontmatter(raw)
  return {
    slug,
    locale,
    title: typeof frontmatter.title === 'string' ? frontmatter.title : slug,
    description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
    date: typeof frontmatter.date === 'string' ? frontmatter.date : '',
    author: coerceAuthor(frontmatter.author),
  }
}
