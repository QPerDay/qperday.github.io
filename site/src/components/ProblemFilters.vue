<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'

const catalog = useCatalog()
const { t } = useI18n()

// Each filter is a two-way `v-model:*` prop, so the parent owns the state
// (via useProblemQuery) and this component is purely presentational.
const search = defineModel<string>('search', { default: '' })
const status = defineModel<'' | 'ok' | 'err'>('status', { default: '' })
const topic = defineModel<string>('topic', { default: '' })
const dateFrom = defineModel<string>('dateFrom', { default: '' })
const dateTo = defineModel<string>('dateTo', { default: '' })
const useFrom = defineModel<boolean>('useFrom', { default: false })
const useTo = defineModel<boolean>('useTo', { default: false })

// Hide the topic selector where it is redundant (e.g. on a single topic's page).
withDefaults(defineProps<{ showTopic?: boolean }>(), { showTopic: true })
</script>

<template>
  <form class="filters" @submit.prevent>
    <input v-model="search" type="search" :placeholder="t('catalog.search_placeholder')" />
    <select v-model="status">
      <option value="">{{ t('catalog.status_all') }}</option>
      <option value="ok">{{ t('catalog.status_ok') }}</option>
      <option value="err">{{ t('catalog.status_err') }}</option>
    </select>
    <select v-if="showTopic" v-model="topic">
      <option value="">{{ t('catalog.topic_all') }}</option>
      <option v-for="tp in catalog.topics" :key="tp" :value="tp">{{ tp }}</option>
    </select>
    <label class="range">
      <input v-model="useFrom" type="checkbox" />
      <span class="range-label">{{ t('catalog.from') }}</span>
      <input v-model="dateFrom" type="date" :disabled="!useFrom" />
    </label>
    <label class="range">
      <input v-model="useTo" type="checkbox" />
      <span class="range-label">{{ t('catalog.to') }}</span>
      <input v-model="dateTo" type="date" :disabled="!useTo" />
    </label>
  </form>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s3);
  margin: var(--s4) 0;
}
.filters input[type='search'] {
  flex: 1;
  min-width: 12rem;
}
.range {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
}
.range-label {
  color: var(--c-muted);
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
