<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { useProblemQuery } from '@/composables/useProblemQuery'
import { useEntries, entryAuthoredBy } from '@/lib/content'
import { slugify } from '@/lib/slug'
import ProblemFilters from '@/components/ProblemFilters.vue'
import ProblemList from '@/components/ProblemList.vue'
import NotFoundState from '@/components/NotFoundState.vue'

const props = defineProps<{ nameNormalized: string }>()

const catalog = useCatalog()
const { t, locale } = useI18n()

const name = computed(() => catalog.setterFromSlug(props.nameNormalized))
const problems = computed(() => (name.value ? catalog.problemsForSetter(name.value) : []))
const contacts = computed(() => (name.value ? catalog.setterContacts[name.value] ?? [] : []))

// Distinct topics this setter has written in, for the header chips.
const topics = computed(() => {
  const set = new Set<string>()
  for (const p of problems.value) if (p.topic) set.add(p.topic)
  return [...set]
})

// Blog entries (active locale) authored by this setter.
const entries = useEntries()
const blogEntries = computed(() => {
  const n = name.value
  if (!n) return []
  return entries.value.filter((e) => entryAuthoredBy(e, n))
})

// Blog entries, resolved into card fields (localized date) for display.
const blogCards = computed(() =>
  blogEntries.value.map((e) => {
    const d = new Date(e.date)
    const date = Number.isNaN(d.getTime())
      ? e.date
      : d.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
    return { slug: e.slug, title: e.title, description: e.description, date }
  }),
)

const isMailto = (url: string) => url.startsWith('mailto:')

// Show the destination explicitly: drop the `mailto:` scheme and the `https://`
// prefix (plus a trailing slash) so the chip reads as a clean address.
function displayUrl(url: string): string {
  if (url.startsWith('mailto:')) return url.slice('mailto:'.length)
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

const { search, status, topic, dateFrom, dateTo, useFrom, useTo, results, total } =
  useProblemQuery(problems)
</script>

<template>
  <section v-if="name" class="setter">
    <header class="setter__head">
      <h1 class="setter__name">{{ name }}</h1>
      <p class="setter__meta">
        <span>{{ t('catalog.problem_count', { count: problems.length }) }}</span>
        <template v-if="blogEntries.length">
          <span aria-hidden="true" class="setter__sep"> · </span>
          <span>{{ t('setter.blog_entries_count', { count: blogEntries.length }) }}</span>
        </template>
      </p>

      <ul v-if="topics.length" class="topics">
        <li v-for="tp in topics" :key="tp">
          <RouterLink :to="`/topics/${slugify(tp)}`" class="tag">{{ tp }}</RouterLink>
        </li>
      </ul>
    </header>

    <ul v-if="contacts.length" class="contacts">
      <li v-for="c in contacts" :key="c.label">
        <a
          class="chip"
          :href="c.url"
          :target="isMailto(c.url) ? undefined : '_blank'"
          :rel="isMailto(c.url) ? undefined : 'noopener'"
        >
          <span class="chip__label">{{ c.label }}</span>
          <span class="chip__value">{{ displayUrl(c.url) }}</span>
        </a>
      </li>
    </ul>

    <section v-if="blogCards.length" class="entries">
      <h2 class="entries__title">{{ t('catalog.blog_entries') }}</h2>
      <div class="entries__grid">
        <RouterLink v-for="e in blogCards" :key="e.slug" :to="`/blog/${e.slug}`" class="entry">
          <h3 class="entry__title">{{ e.title }}</h3>
          <p v-if="e.description" class="entry__desc">{{ e.description }}</p>
          <p class="entry__meta">
            <span v-if="e.date">{{ e.date }}</span>
          </p>
        </RouterLink>
      </div>
    </section>

    <ProblemFilters
      v-model:search="search"
      v-model:status="status"
      v-model:topic="topic"
      v-model:date-from="dateFrom"
      v-model:date-to="dateTo"
      v-model:use-from="useFrom"
      v-model:use-to="useTo"
    />

    <p class="count">
      {{ t('catalog.results_count', { shown: results.length, count: total }) }}
    </p>

    <ProblemList :problems="results" :show-setters="false" />
  </section>
  <NotFoundState
    v-else
    kind="Setter"
    attr="name"
    :value="nameNormalized"
    :message="t('catalog.setter_not_found', { name: nameNormalized })"
    to="/setters"
    :back-label="t('notfound.back_to', { target: t('nav.setters') })"
  />
</template>

<style scoped>
.setter__head {
  margin-bottom: var(--s4);
}
.setter__name {
  margin: 0;
}
.setter__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--s1);
  color: var(--c-muted);
  font-size: 0.95rem;
  margin: var(--s2) 0 0;
}
.setter__sep {
  color: var(--c-faint);
}
.topics {
  list-style: none;
  padding: 0;
  margin: var(--s3) 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.contacts {
  list-style: none;
  padding: 0;
  margin: var(--s3) 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}
.contacts li {
  display: inline-flex;
}
.count {
  color: var(--c-muted);
}

/* Blog entries authored by this setter. */
.entries {
  margin-top: var(--s4);
}
.entries__title {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin: 0 0 var(--s2);
}
.entries__grid {
  display: flex;
  gap: var(--s3);
  overflow-x: auto;
  padding-bottom: var(--s2);
  scroll-snap-type: x proximity;
}
.entry {
  flex: 0 0 18rem;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
  text-decoration: none;
  color: inherit;
  padding: var(--s4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  transition: border-color 0.15s ease;
}
.entry:hover {
  border-color: var(--c-accent);
}
.entry__title {
  font-size: 1.05rem;
  line-height: 1.3;
  margin: 0 0 var(--s2);
  color: var(--c-accent-strong);
}
.entry:hover .entry__title {
  color: var(--c-accent);
}
.entry__desc {
  color: var(--c-muted);
  line-height: 1.55;
  font-size: 0.9rem;
  margin: 0 0 var(--s2);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.entry__meta {
  margin-top: auto;
  color: var(--c-faint);
  font-size: 0.8rem;
}
</style>
