<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { useProblemQuery } from '@/composables/useProblemQuery'
import ProblemFilters from '@/components/ProblemFilters.vue'
import ProblemList from '@/components/ProblemList.vue'
import NotFoundState from '@/components/NotFoundState.vue'

const props = defineProps<{ nameNormalized: string }>()

const catalog = useCatalog()
const { t } = useI18n()

const name = computed(() => catalog.topicFromSlug(props.nameNormalized))
const problems = computed(() =>
  name.value ? catalog.problems.filter((p) => p.topic === name.value) : [],
)

const { search, status, topic, dateFrom, dateTo, useFrom, useTo, results, total } =
  useProblemQuery(problems)
</script>

<template>
  <section v-if="name">
    <h1>{{ name }}</h1>
    <p v-if="catalog.topicDescriptions[name]" class="desc">
      {{ catalog.topicDescriptions[name] }}
    </p>

    <ProblemFilters
      v-model:search="search"
      v-model:status="status"
      v-model:topic="topic"
      v-model:date-from="dateFrom"
      v-model:date-to="dateTo"
      v-model:use-from="useFrom"
      v-model:use-to="useTo"
      :show-topic="false"
    />

    <p class="count">
      {{ t('catalog.results_count', { shown: results.length, count: total }) }}
    </p>

    <ProblemList :problems="results" />
  </section>
  <NotFoundState
    v-else
    kind="Topic"
    attr="name"
    :value="nameNormalized"
    :message="t('catalog.topic_not_found', { name: nameNormalized })"
    to="/topics"
    :back-label="t('notfound.back_to', { target: t('nav.topics') })"
  />
</template>

<style scoped>
.count {
  color: var(--c-muted);
}
.desc {
  color: var(--c-muted);
  margin: var(--s2) 0 0;
  max-width: var(--measure);
}
</style>
