<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEntries } from '@/lib/content'
import { slugify } from '@/lib/slug'

const { t, locale } = useI18n()
const entries = useEntries()

// Resolve each entry into display fields: localized date + per-author setter
// links (an "all setters" attribution links to the setter index instead).
const cards = computed(() =>
  entries.value.map((e) => {
    const authors =
      e.author === 'all'
        ? [{ name: t('content.author_all'), to: '/setters' }]
        : e.author.map((name) => ({ name, to: `/setters/${slugify(name)}` }))

    const d = new Date(e.date)
    const date = Number.isNaN(d.getTime())
      ? e.date
      : d.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })

    return { slug: e.slug, title: e.title, description: e.description, date, authors }
  }),
)
</script>

<template>
  <section class="blog">
    <header class="blog__head">
      <h1>{{ t('nav.blog') }}</h1>
    </header>

    <div class="entries">
      <article v-for="e in cards" :key="e.slug" class="entry">
        <h2 class="entry__title">
          <RouterLink :to="`/blog/${e.slug}`">{{ e.title }}</RouterLink>
        </h2>
        <p v-if="e.description" class="entry__desc">{{ e.description }}</p>
        <p class="entry__meta">
          <span v-if="e.date">{{ e.date }}</span>
          <template v-if="e.authors.length">
            <span aria-hidden="true">·</span>
            <span>{{ t('problem.by') }}</span>
            <template v-for="(a, i) in e.authors" :key="a.to">
              <RouterLink :to="a.to" class="entry__author">{{ a.name }}</RouterLink>
              <span v-if="i < e.authors.length - 1" aria-hidden="true">, </span>
            </template>
          </template>
        </p>
      </article>
    </div>

    <p v-if="cards.length === 0" class="empty">{{ t('blog.empty') }}</p>
  </section>
</template>

<style scoped>
.blog {
  max-width: 44rem;
  margin: 0 auto;
  padding: var(--s6) 0;
}
.blog__head h1 {
  font-size: 2rem;
  margin: 0 0 var(--s6);
}

.entries {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.entry {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: var(--s6);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.entry:hover {
  border-color: var(--c-accent);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.entry__title {
  font-size: 1.35rem;
  line-height: 1.25;
  margin: 0 0 var(--s2);
  color: var(--c-accent-strong);
}
.entry__title a {
  color: inherit;
  text-decoration: none;
}
.entry:hover .entry__title {
  color: var(--c-accent);
}

.entry__desc {
  color: var(--c-muted);
  line-height: 1.6;
  margin: 0 0 var(--s3);
}

.entry__meta {
  color: var(--c-faint);
  font-size: 0.85rem;
  margin: 0;
}
.entry__author {
  color: var(--c-accent);
  text-decoration: none;
}
.entry__author:hover {
  color: var(--c-accent-strong);
  text-decoration: underline;
}
</style>
