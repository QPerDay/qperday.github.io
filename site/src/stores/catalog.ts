import { computed } from 'vue'
import { defineStore } from 'pinia'
import Fuse from 'fuse.js'
import type { ProblemMeta, ProblemQuery, TopicMeta, SetterMeta, ContactMeta } from '@/types'
import { slugify } from '@/lib/slug'

// Compile-time injection: every problem's meta.json is bundled into the app
// by Vite at build time.  No runtime fetch of metadata — only the PDFs are
// fetched lazily from /data/{id}/.
const modules = import.meta.glob('../data/problem-*.json', {
  eager: true,
  import: 'default',
}) as Record<string, ProblemMeta>

// Topic descriptions (from \topic declarations in main.tex, via topics.json).
const topicData = import.meta.glob('../data/topics.json', {
  eager: true,
  import: 'default',
}) as Record<string, TopicMeta[]>
const topicMetas: TopicMeta[] = Object.values(topicData)[0] ?? []

// Setter contacts (from \setterContact declarations in main.tex, via setters.json).
const setterData = import.meta.glob('../data/setters.json', {
  eager: true,
  import: 'default',
}) as Record<string, SetterMeta[]>
const setterMetas: SetterMeta[] = Object.values(setterData)[0] ?? []

function loadProblems(): ProblemMeta[] {
  // Newest first: IDs are YYYYMMDD, so descending lexicographic = reverse-chronological.
  return Object.values(modules).sort((a, b) => b.id.localeCompare(a.id))
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

  // topic name -> description, from the \topic registry in main.tex.
  const topicDescriptions = computed<Record<string, string>>(() =>
    Object.fromEntries(topicMetas.map((t) => [t.name, t.description])),
  )

  // setter name -> contact links, from the \setterContact registry in main.tex.
  const setterContacts = computed<Record<string, ContactMeta[]>>(() =>
    Object.fromEntries(setterMetas.map((s) => [s.name, s.contacts])),
  )

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
  //
  // An optional `scope` restricts the search to a pre-filtered set (e.g. all
  // problems by one setter).  Within a scope, fuzzy matching over the whole
  // catalog would be wrong, so a scoped search falls back to substring
  // matching over name/topic/tags.
  function query(q: ProblemQuery, scope?: ProblemMeta[]): ProblemMeta[] {
    const term = q.search?.trim() ?? ''

    let base: ProblemMeta[]
    if (term) {
      if (scope) {
        const t = term.toLowerCase()
        base = scope.filter(
          (p) =>
            p.name.toLowerCase().includes(t) ||
            p.topic.toLowerCase().includes(t) ||
            p.tags.some((tag) => tag.toLowerCase().includes(t)),
        )
      } else {
        // Full catalog: fuzzy matches, ranked best-first.
        base = fuse.search(term).map((r) => r.item)
      }
    } else {
      base = scope ?? problems
    }

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
    topicDescriptions,
    setterContacts,
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
