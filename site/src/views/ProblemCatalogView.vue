<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProblemQuery } from '@/composables/useProblemQuery'
import ProblemFilters from '@/components/ProblemFilters.vue'
import ProblemList from '@/components/ProblemList.vue'

const { t } = useI18n()
const { search, status, topic, dateFrom, dateTo, useFrom, useTo, results, total } =
  useProblemQuery()
</script>

<template>
  <section>
    <h1>{{ t('nav.problems') }}</h1>

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
</template>
