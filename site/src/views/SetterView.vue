<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { useProblemQuery } from '@/composables/useProblemQuery'
import ProblemFilters from '@/components/ProblemFilters.vue'
import ProblemList from '@/components/ProblemList.vue'

const props = defineProps<{ nameNormalized: string }>()

const catalog = useCatalog()
const { t } = useI18n()

const name = computed(() => catalog.setterFromSlug(props.nameNormalized))
const problems = computed(() => (name.value ? catalog.problemsForSetter(name.value) : []))
const contacts = computed(() => (name.value ? catalog.setterContacts[name.value] ?? [] : []))
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
  <section v-if="name">
    <h1>{{ name }}</h1>
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
  <p v-else class="empty">{{ t('catalog.setter_not_found', { name: nameNormalized }) }}</p>
</template>

<style scoped>
.count {
  color: var(--c-muted);
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
</style>
