<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEntry } from '@/lib/content'
import { collectProblemIds, collectHeadings } from '@/lib/mdc'
import { useCatalog } from '@/stores/catalog'
import { formatDate } from '@/lib/date'
import type { ProblemMeta } from '@/types'
import MarkdownContent from '@/components/MarkdownContent.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import TwikooComments from '@/components/TwikooComments.vue'

const props = defineProps<{ slug: string }>()

const { t, locale } = useI18n()
const entry = useEntry(props.slug)
const catalog = useCatalog()

const date = computed(() => {
  if (!entry.value?.date) return ''
  const d = new Date(entry.value.date)
  return Number.isNaN(d.getTime())
    ? entry.value.date
    : d.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
})

const authors = computed(() => {
  const author = entry.value?.author
  if (author === 'all') return t('content.author_all')
  if (!author || author.length === 0) return ''
  return author.join(', ')
})

// Problems referenced by `:problem-card{id=…}` components in the body.
const referenced = computed<ProblemMeta[]>(() => {
  if (!entry.value) return []
  return collectProblemIds(entry.value.body)
    .map((id) => catalog.problem(id))
    .filter((p): p is ProblemMeta => p !== undefined)
})

// Section headings in the body, for the floating table of contents.
const headings = computed(() => (entry.value ? collectHeadings(entry.value.body) : []))
</script>

<template>
  <div v-if="entry" class="entry-page">
    <article class="entry">
      <header class="entry__head">
        <p v-if="entry.description" class="entry__description">{{ entry.description }}</p>
        <h1 class="entry__title">{{ entry.title }}</h1>
        <p class="entry__meta">
          <span v-if="date">{{ date }}</span>
          <template v-if="authors">
            <span aria-hidden="true" class="entry__sep"> · </span>
            <span>{{ authors }}</span>
          </template>
        </p>

        <section v-if="referenced.length" class="entry__problems">
          <h2 class="entry__problems-title">{{ t('content.referenced_problems') }}</h2>
          <ul class="entry__problems-list">
            <li v-for="p in referenced" :key="p.id">
              <RouterLink :to="`/problem/${p.id}`" class="entry__problem">
                <span class="entry__problem-date">{{ formatDate(p.id, locale) }}</span>
                <span class="entry__problem-name">{{ p.name }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </header>

      <MarkdownContent :source="entry.body" />

      <TwikooComments :path="`/blog/${slug}`" />
    </article>

    <aside class="entry-toc">
      <TableOfContents :headings="headings" />
    </aside>
  </div>

  <p v-else class="empty">{{ t('content.not_found', { slug }) }}</p>
</template>

<style scoped>
.entry-page {
  display: grid;
  grid-template-columns: minmax(0, 44rem);
  justify-content: center;
  gap: var(--s4);
  align-items: start;
}
.entry {
  /* Fills its grid column; the column (not the article) caps the prose width. */
  max-width: none;
  margin: 0;
  padding: var(--s6) 0;
  line-height: 1.7;
}
.entry-toc {
  display: none;
}

/* Wide screens: a sticky right rail that floats alongside the text. */
@media (min-width: 64rem) {
  .entry-page {
    grid-template-columns: minmax(0, 44rem) 11rem;
  }
  .entry-toc {
    display: block;
    position: sticky;
    /* Clears the sticky navbar (~3.5rem) plus a small gap. */
    top: 5rem;
  }
}
.entry__head {
  margin-bottom: var(--s6);
  padding-bottom: var(--s6);
  border-bottom: 1px solid var(--c-border);
}
.entry__description {
  font-size: 1.15rem;
  line-height: 1.55;
  color: var(--c-muted);
  margin: 0 0 var(--s4);
}
.entry__title {
  font-size: 2.5rem;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s3);
}
.entry__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--s1);
  color: var(--c-muted);
  font-size: 0.95rem;
  margin: 0;
}
.entry__sep {
  color: var(--c-faint);
}

/* Referenced problems block in the header. */
.entry__problems {
  margin-top: var(--s4);
}
.entry__problems-title {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin: 0 0 var(--s2);
}
.entry__problems-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}
.entry__problem {
  display: inline-flex;
  align-items: baseline;
  gap: var(--s2);
  padding: var(--s2) var(--s3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.entry__problem:hover {
  border-color: var(--c-accent);
  background: var(--c-accent-bg);
}
.entry__problem-date {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-faint);
}
.entry__problem-name {
  font-weight: 500;
}
</style>
