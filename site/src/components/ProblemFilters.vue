<script setup lang="ts">
import { computed, ref } from 'vue'
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

// The list starts as just a search bar; advanced filters appear on demand.
const showFilters = ref(false)
const activeFilterCount = computed(() => {
  let n = 0
  if (status.value) n++
  if (topic.value) n++
  if (useFrom.value) n++
  if (useTo.value) n++
  return n
})
</script>

<template>
  <form class="filters" @submit.prevent>
    <input v-model="search" type="search" :placeholder="t('catalog.search_placeholder')" />

    <button
      type="button"
      class="filter-toggle"
      :class="{ active: showFilters }"
      :aria-expanded="showFilters"
      aria-controls="filter-advanced"
      @click="showFilters = !showFilters"
    >
      <svg class="filter-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span>{{ t('catalog.filters') }}</span>
      <span v-if="activeFilterCount" class="filter-badge">{{ activeFilterCount }}</span>
    </button>

    <div id="filter-advanced" v-show="showFilters" class="advanced">
      <select v-model="status">
        <option value="">{{ t('catalog.status_all') }}</option>
        <option value="ok">{{ t('catalog.status_ok') }}</option>
        <option value="err">{{ t('catalog.status_err') }}</option>
      </select>
      <select v-if="showTopic" v-model="topic">
        <option value="">{{ t('catalog.topic_all') }}</option>
        <option v-for="tp in catalog.topics" :key="tp" :value="tp">{{ tp }}</option>
      </select>
      <div class="range-group">
        <label class="range" :class="{ active: useFrom }">
          <input v-model="useFrom" type="checkbox" />
          <span class="range-label">{{ t('catalog.from') }}</span>
          <input v-model="dateFrom" type="date" :disabled="!useFrom" />
        </label>
        <span class="range-sep" aria-hidden="true"></span>
        <label class="range" :class="{ active: useTo }">
          <input v-model="useTo" type="checkbox" />
          <span class="range-label">{{ t('catalog.to') }}</span>
          <input v-model="dateTo" type="date" :disabled="!useTo" />
        </label>
      </div>
    </div>
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
.filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  padding: 0.4rem 0.75rem;
  font: inherit;
  font-weight: 600;
  color: var(--c-muted);
  background: #fff;
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}
.filter-toggle:hover {
  color: var(--c-fg);
  border-color: var(--c-accent);
}
.filter-toggle.active {
  color: var(--c-accent);
  border-color: var(--c-accent);
  background: var(--c-accent-bg);
}
.filter-toggle__icon {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.2rem;
  height: 1.2rem;
  padding: 0 0.3rem;
  border-radius: var(--radius-pill);
  background: var(--c-accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}
.advanced {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s3);
}
.range-group {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  padding: 0 var(--s2);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius);
  background: #fff;
}
.range {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
}
.range-sep {
  align-self: stretch;
  width: 1px;
  background: var(--c-border);
}
.range-group input[type='date'] {
  border: none;
  padding: 0.4rem 0;
  background: transparent;
}
.range-group input[type='date']:disabled {
  background: transparent;
}
.range-label {
  color: var(--c-muted);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}
.range.active .range-label {
  color: var(--c-accent);
}
</style>
