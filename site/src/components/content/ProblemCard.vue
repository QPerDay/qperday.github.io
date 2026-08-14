<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { formatDate } from '@/lib/date'

// MDC component: a compact card linking to a specific problem by ID.
//   ::problem-card{id="20260724"}   (block)  or  :problem-card{id="20260724"}
// Mirrors the problem page's header + metadata table, condensed into one card:
// name + setters (header), date top-right, and a metadata strip with difficulty
// as stars, score, topic/tags, and a warning glyph for erroneous entries.
const props = defineProps<{ id: string }>()

const catalog = useCatalog()
const { t, locale } = useI18n()

const problem = computed(() => catalog.problem(props.id))
const date = computed(() => (problem.value ? formatDate(problem.value.id, locale.value) : ''))
const setters = computed(() => problem.value?.setter.join(', ') ?? '')

const difficulty = computed(() => problem.value?.difficulty ?? 0)
// Five stars, filled up to the difficulty rating (1–5).
const stars = computed(() => Array.from({ length: 5 }, (_, i) => i < difficulty.value))
</script>

<template>
  <RouterLink v-if="problem" :to="`/problem/${problem.id}`" class="card problem-card">
    <header class="problem-card__head">
      <div class="problem-card__titles">
        <span class="problem-card__name">
          <template v-if="problem.status === 'err'">{{ t('common.err_prefix') }}</template>
          {{ problem.name }}
        </span>
        <span v-if="setters" class="problem-card__setters">{{ t('problem.by') }} {{ setters }}</span>
      </div>

      <div class="problem-card__corner">
        <svg
          v-if="problem.status === 'err'"
          class="problem-card__warn"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <title>{{ t('problem.status_erroneous') }}</title>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span class="problem-card__date">{{ date }}</span>
      </div>
    </header>

    <div class="problem-card__meta">
      <span
        v-if="difficulty"
        class="problem-card__stars"
        role="img"
        :aria-label="`${t('problem.difficulty')}: ${difficulty} / 5`"
      >
        <span v-for="(on, i) in stars" :key="i" :class="on ? 'on' : 'off'">{{ on ? '★' : '☆' }}</span>
      </span> ·

      <span v-if="problem.score" class="problem-card__score">{{ problem.score }} {{ t('problem.pts') }}</span> ·

      <!-- Topic/tags are spans, not links: the whole card is already a link, and
           nested <a> inside <a> is invalid HTML — the browser's parser would
           close the card link at the first inner anchor and mangle the card. -->
      <span v-if="problem.topic" class="problem-card__topic">
        {{ problem.topic }}
      </span>

      <span v-if="problem.open" class="problem-card__open">{{ t('problem.status_open') }}</span>
    </div>

    <div v-if="problem.tags.length" class="problem-card__tags">
      <span v-for="tag in problem.tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
  </RouterLink>

  <span v-else class="card problem-card problem-card--missing">
    {{ t('problem.not_found', { id }) }}
  </span>
</template>
