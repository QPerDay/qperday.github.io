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

const name = computed(() => catalog.tagFromSlug(props.nameNormalized))
const problems = computed(() => (name.value ? catalog.problemsForTag(name.value) : []))

const { search, status, topic, dateFrom, dateTo, useFrom, useTo, results, total } =
  useProblemQuery(problems)
</script>

<template>
  <section v-if="name">
    <h1>#{{ name }}</h1>

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

    <ProblemList :problems="results" />
  </section>
  <p v-else>{{ t('catalog.tag_not_found', { name: nameNormalized }) }}</p>
</template>

<style scoped>
.count {
  color: var(--c-muted);
}
</style>
