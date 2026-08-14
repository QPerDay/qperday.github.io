<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEntry } from '@/lib/content'
import MarkdownContent from '@/components/MarkdownContent.vue'
import TwikooComments from '@/components/TwikooComments.vue'

const props = defineProps<{ slug: string }>()

const { t, locale } = useI18n()
const entry = useEntry(props.slug)

const date = computed(() => {
  if (!entry.value?.date) return ''
  const d = new Date(entry.value.date)
  return Number.isNaN(d.getTime()) ? entry.value.date : d.toLocaleDateString(locale.value)
})

const authors = computed(() => {
  const author = entry.value?.author
  if (author === 'all') return t('content.author_all')
  if (!author || author.length === 0) return ''
  return author.join(', ')
})
</script>

<template>
  <article v-if="entry" class="entry">
    <header class="entry__head">
      <h1>{{ entry.title }}</h1>
      <p class="entry__meta">
        <span v-if="date">{{ date }}</span>
        <template v-if="authors">
          <span aria-hidden="true"> · </span>
          <span>{{ authors }}</span>
        </template>
      </p>
    </header>

    <MarkdownContent :source="entry.body" />

    <TwikooComments :path="`/blog/${slug}`" />
  </article>

  <p v-else>{{ t('content.not_found', { slug }) }}</p>
</template>

<style scoped>
.entry {
  /* A narrower, centered prose column, matching the old About layout. */
  max-width: 44rem;
  margin: 0 auto;
  padding: var(--s6) 0;
  line-height: 1.7;
}
.entry__head {
  margin-bottom: var(--s6);
}
.entry__head h1 {
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 var(--s2);
}
.entry__meta {
  color: var(--c-muted);
  font-size: 0.9rem;
  margin: 0;
}
</style>
