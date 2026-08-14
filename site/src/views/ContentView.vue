<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEntry, useEntriesReferencingEntry, resolveAssetUrls } from '@/lib/content'
import { useCatalog } from '@/stores/catalog'
import { formatDate } from '@/lib/date'
import type { ProblemMeta } from '@/types'
import TableOfContents from '@/components/TableOfContents.vue'
import TwikooComments from '@/components/TwikooComments.vue'
import NotFoundState from '@/components/NotFoundState.vue'
import BlogEntryCard from '@/components/content/BlogEntryCard.vue'

const props = defineProps<{ slug: string }>()

const { t, locale } = useI18n()
// Getters, not values: the router reuses this component instance between
// `/blog/:slug` routes, so the hooks must re-read the prop on every change.
const entry = useEntry(() => props.slug)

// Compiled HTML carries `__QPD_ASSET__:<name>` tokens for bundled images; swap
// them for this build's asset URLs (dev server paths in dev, hashed prod URLs
// in production/SSR — so hydration matches the prerendered markup exactly).
const assetHtml = computed(() => (entry.value ? resolveAssetUrls(entry.value.html) : ''))
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

// Problems referenced by `:problem-card{id=…}` components in the body.  The
// reference set is precomputed at compile time (content.json), so no markdown
// is parsed here.
const referenced = computed<ProblemMeta[]>(() => {
  if (!entry.value) return []
  return entry.value.problemIds
    .map((id) => catalog.problem(id))
    .filter((p): p is ProblemMeta => p !== undefined)
})

// Other blog entries that reference this one via `:blog-entry-card{slug=…}`.
const referencingEntries = useEntriesReferencingEntry(() => props.slug)

// Section headings in the body, for the floating table of contents.  Also
// precomputed at compile time.
const headings = computed(() => entry.value?.headings ?? [])

// Mobile "Contents" bottom sheet.
const tocOpen = ref(false)

function onSheetClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('a')) tocOpen.value = false
}
</script>

<template>
  <div v-if="entry" class="entry-page">
    <article class="entry" id="top">
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

        <section v-if="referencingEntries.length" class="entry__backlinks">
          <h2 class="entry__backlinks-title">{{ t('content.referenced_in') }}</h2>
          <ul class="entry__backlinks-list">
            <li v-for="e in referencingEntries" :key="e.slug">
              <BlogEntryCard :slug="e.slug" />
            </li>
          </ul>
        </section>
      </header>

      <!-- Compiled at build time; the HTML already carries its own `.md`
           wrapper, which the global prose styles in src/assets/content.css
           target. -->
      <div v-html="assetHtml"></div>

      <hr class="entry__rule" />

      <section id="comments" class="entry__comments">
        <TwikooComments :path="`/blog/${slug}`" />
      </section>
    </article>

    <aside class="entry-toc">
      <TableOfContents :headings="headings" />
    </aside>

    <button class="toc-fab" type="button" :aria-expanded="tocOpen" @click="tocOpen = true">
      <svg
        class="toc-fab__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
      </svg>
      <span>{{ t('content.toc') }}</span>
    </button>

    <div v-if="tocOpen" class="toc-scrim" @click="tocOpen = false"></div>

    <div v-if="tocOpen" class="toc-sheet" role="dialog" aria-modal="true">
      <button
        class="toc-sheet__close"
        type="button"
        :aria-label="t('problem.close')"
        @click="tocOpen = false"
      >×</button>
      <TableOfContents :headings="headings" @click="onSheetClick" />
    </div>
  </div>

  <NotFoundState
    v-else
    kind="Entry"
    attr="slug"
    :value="slug"
    :message="t('content.not_found', { slug })"
    to="/blog"
    :back-label="t('notfound.back_to', { target: t('nav.blog') })"
  />
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
/* Separator between the article body and the comments thread. */
.entry__rule {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: var(--s6) 0;
}
/* Anchor target for the TOC's "Comments" link — clears the sticky navbar. */
.entry__comments {
  scroll-margin-top: 5rem;
}
.entry-toc {
  display: none;
}

/* Mobile table of contents — a floating "Contents" button that opens a bottom
   sheet.  Replaced by the sticky rail on wide screens. */
.toc-fab {
  display: flex;
  align-items: center;
  gap: var(--s2);
  position: fixed;
  right: var(--s4);
  bottom: var(--s4);
  z-index: 60;
  padding: var(--s2) var(--s4);
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
}
.toc-fab:hover {
  background: var(--c-accent-strong);
}
.toc-fab__icon {
  width: 1em;
  height: 1em;
}
.toc-scrim {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(0, 0, 0, 0.4);
  animation: toc-fade 0.2s ease;
}
.toc-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 71;
  max-height: 70vh;
  overflow-y: auto;
  padding: var(--s4);
  padding-bottom: calc(var(--s4) + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid var(--c-border);
  border-radius: var(--radius) var(--radius) 0 0;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
  animation: toc-rise 0.25s ease;
}
.toc-sheet__close {
  position: absolute;
  top: var(--s2);
  right: var(--s2);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--c-muted);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: var(--radius);
}
.toc-sheet__close:hover {
  background: var(--c-accent-bg);
  color: var(--c-accent-strong);
}
@keyframes toc-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes toc-rise {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
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
  .toc-fab {
    display: none;
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

/* Blog entries referencing this one (backlinks). */
.entry__backlinks {
  margin-top: var(--s4);
}
.entry__backlinks-title {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin: 0 0 var(--s2);
}
.entry__backlinks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s2);
}
</style>
