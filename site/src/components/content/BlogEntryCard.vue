<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEntry } from '@/lib/content'

// MDC component: a compact card linking to another blog entry by slug.
//   ::blog-entry-card{slug="0412-jacobian-guide"}   (block)
//   or  :blog-entry-card{slug="0412-jacobian-guide"}
// Mirrors ProblemCard, but for blog entries: title + description up top, then
// a footer with the localized date and author(s).
const props = defineProps<{ slug: string }>()

const { t, locale } = useI18n()
const entry = useEntry(props.slug)

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
</script>

<template>
  <RouterLink v-if="entry" :to="`/blog/${entry.slug}`" class="card entry-card">
    <span class="entry-card__title">{{ entry.title }}</span>
    <span v-if="entry.description" class="entry-card__description">{{ entry.description }}</span>
    <span class="entry-card__meta">
      <span v-if="date">{{ date }}</span>
      <template v-if="authors">
        <span aria-hidden="true"> · </span>
        <span>{{ authors }}</span>
      </template>
    </span>
  </RouterLink>
  <span v-else class="card entry-card entry-card--missing">
    {{ t('content.not_found', { slug }) }}
  </span>
</template>

<style scoped>
.entry-card {
  display: block;
}
.entry-card__title {
  display: block;
  font-weight: 600;
  line-height: 1.3;
}
.entry-card__description {
  display: block;
  color: var(--c-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-top: var(--s1);
}
.entry-card__meta {
  display: block;
  color: var(--c-faint);
  font-size: 0.85rem;
  margin-top: var(--s2);
}
/* Unknown slug: a muted, non-interactive placeholder. */
.entry-card--missing {
  color: var(--c-muted);
  font-size: 0.9rem;
}
</style>
