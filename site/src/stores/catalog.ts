import { computed } from 'vue'
import { defineStore } from 'pinia'
import Fuse from 'fuse.js'
import type { ProblemMeta, ProblemQuery } from '@/types'
import { slugify } from '@/lib/slug'

// Compile-time injection: every problem's meta.json is bundled into the app
// by Vite at build time.  No runtime fetch of metadata — only the PDFs are
// fetched lazily from /data/{id}/.
const modules = import.meta.glob('../data/problem-*.json', {
  eager: true,
  import: 'default',
}) as Record<string, ProblemMeta>

function loadProblems(): ProblemMeta[] {
  // Sort by ID (YYYYMMDD) = chronological order.
  return Object.values(modules).sort((a, b) => a.id.localeCompare(b.id))
}

export const useCatalog = defineStore('catalog', () => {
  const problems = loadProblems()

  // Fuzzy search over name / topic / tags, built once over the whole catalog.
  const fuse = new Fuse(problems, {
    keys: ['name', 'topic', 'tags'],
    threshold: 0.4,
    ignoreLocation: true,
  })

  const ids = computed(() => problems.map((p) => p.id))

  const byId = computed<Record<string, ProblemMeta>>(() =>
    Object.fromEntries(problems.map((p) => [p.id, p])),
  )

  // Deduplicated setter names, sorted alphabetically.
  const setters = computed(() => {
    const set = new Set<string>()
    for (const p of problems) for (const s of p.setter) if (s) set.add(s)
    return [...set].sort((a, b) => a.localeCompare(b))
  })

  // Distinct topic values that are actually present.
  const topics = computed(() => {
    const set = new Set<string>()
    for (const p of problems) if (p.topic) set.add(p.topic)
    return [...set].sort((a, b) => a.localeCompare(b))
  })

  // Distinct tags across all problems, sorted, each with a problem count.
  const tags = computed(() => {
    const counts = new Map<string, number>()
    for (const p of problems) for (const t of p.tags) if (t) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  })

  function problem(id: string): ProblemMeta | undefined {
    return byId.value[id]
  }

  function problemsForSetter(name: string): ProblemMeta[] {
    return problems.filter((p) => p.setter.includes(name))
  }

  function problemsForTag(tag: string): ProblemMeta[] {
    return problems.filter((p) => p.tags.includes(tag))
  }

  // Resolve a route slug back to the canonical setter name.
  function setterFromSlug(slug: string): string | undefined {
    return setters.value.find((s) => slugify(s) === slug)
  }

  // Resolve a route slug back to a canonical topic.
  function topicFromSlug(slug: string): string | undefined {
    return topics.value.find((t) => slugify(t) === slug)
  }

  // Resolve a route slug back to a canonical tag.
  function tagFromSlug(slug: string): string | undefined {
    return tags.value.find(([name]) => slugify(name) === slug)?.[0]
  }

  // Client-side querying over the bundled catalog.  Search is fuzzy (Fuse.js);
  // the remaining filters are exact and combine with search via AND.
  function query(q: ProblemQuery): ProblemMeta[] {
    const term = q.search?.trim() ?? ''

    // Start from the full list (chronological), or the fuzzy matches (ranked
    // best-first) when a search term is present.
    const base = term ? fuse.search(term).map((r) => r.item) : problems

    return base.filter((p) => {
      if (q.status === 'ok' && p.status === 'err') return false
      if (q.status === 'err' && p.status !== 'err') return false
      if (q.setter && !p.setter.includes(q.setter)) return false
      if (q.topic && p.topic !== q.topic) return false
      if (q.tag && !p.tags.includes(q.tag)) return false
      // ISO dates compare lexicographically, so string comparison is correct.
      if (q.dateFrom && p.date < q.dateFrom) return false
      if (q.dateTo && p.date > q.dateTo) return false
      return true
    })
  }

  return {
    problems,
    ids,
    byId,
    setters,
    topics,
    tags,
    problem,
    problemsForSetter,
    problemsForTag,
    setterFromSlug,
    topicFromSlug,
    tagFromSlug,
    query,
  }
})
