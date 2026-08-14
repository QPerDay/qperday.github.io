import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { parse as parseYaml } from 'yaml'
import { collectProblemIds } from '@/lib/mdc'

// Content entry system.  Content lives under `src/content/{locale}/*.md`, each
// file carrying frontmatter (title, date, author) followed by an MDC body.
// This module globs the tree at build time and exposes a single API, so views
// never reach into the `content/` folder themselves.

type Locale = string
type Slug = string

export interface ContentEntry {
  slug: string
  locale: string
  title: string
  description: string
  date: string
  author: string[] | 'all'
  body: string
}

interface Frontmatter {
  title?: unknown
  description?: unknown
  date?: unknown
  author?: unknown
}

const modules = import.meta.glob('../content/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

// locale -> slug -> entry
const entries: Record<Locale, Record<Slug, ContentEntry>> = {}

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?/

function parseFrontmatter(raw: string): Frontmatter {
  try {
    const parsed = parseYaml(raw)
    return (parsed && typeof parsed === 'object' ? parsed : {}) as Frontmatter
  } catch {
    return {}
  }
}

function coerceAuthor(value: unknown): string[] | 'all' {
  if (value === 'all') return 'all'
  if (Array.isArray(value)) return value.map((v) => String(v))
  if (typeof value === 'string') return [value]
  return []
}

for (const [path, raw] of Object.entries(modules)) {
  const match = path.match(/([^/]+)\/([^/]+)\.md$/)
  const locale = match?.[1]
  const slug = match?.[2]
  if (!locale || !slug) continue

  const fmMatch = FRONTMATTER_RE.exec(raw)
  const fm = fmMatch ? parseFrontmatter(fmMatch[1]!) : {}
  const body = fmMatch ? raw.slice(fmMatch[0].length) : raw

  const entry: ContentEntry = {
    slug,
    locale,
    title: typeof fm.title === 'string' ? fm.title : slug,
    description: typeof fm.description === 'string' ? fm.description : '',
    date: typeof fm.date === 'string' ? fm.date : '',
    author: coerceAuthor(fm.author),
    body,
  }

  ;(entries[locale] ??= {})[slug] = entry
}

// Resolve a slug for a locale, falling back: exact locale -> language prefix
// (e.g. "zh-CN" -> "zh") -> English.
export function getEntry(slug: Slug, locale: Locale): ContentEntry | undefined {
  const prefix = locale.split('-')[0]!
  return entries[locale]?.[slug] ?? entries[prefix]?.[slug] ?? entries.en?.[slug]
}

// All slugs (union across locales), for validation/navigation.
export function listSlugs(): string[] {
  const set = new Set<string>()
  for (const byLocale of Object.values(entries)) {
    for (const slug of Object.keys(byLocale)) set.add(slug)
  }
  return [...set]
}

// Reactive entry lookup following the active i18n locale.
export function useEntry(slug: Slug) {
  const { locale } = useI18n()
  return computed(() => getEntry(slug, locale.value))
}

// All entries resolved for a locale (falling back per-slug), newest first.
export function listEntries(locale: Locale): ContentEntry[] {
  return listSlugs()
    .map((slug) => getEntry(slug, locale))
    .filter((e): e is ContentEntry => e !== undefined)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export function useEntries() {
  const { locale } = useI18n()
  return computed(() => listEntries(locale.value))
}

// Blog entries (in the active locale) that reference a given problem via a
// `:problem-card{id=…}` component.  Reactive to locale changes.
export function useEntriesReferencingProblem(id: string) {
  const { locale } = useI18n()
  return computed(() =>
    listEntries(locale.value).filter((e) => collectProblemIds(e.body).includes(id)),
  )
}
