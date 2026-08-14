<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { formatDate } from '@/lib/date'
import { slugify } from '@/lib/slug'

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

      <RouterLink
        v-if="problem.topic"
        :to="`/topics/${slugify(problem.topic)}`"
        class="problem-card__topic"
        @click.stop
      >
        {{ problem.topic }}
      </RouterLink>

      <span v-if="problem.open" class="problem-card__open">{{ t('problem.status_open') }}</span>
    </div>

    <div v-if="problem.tags.length" class="problem-card__tags">
      <RouterLink
        v-for="tag in problem.tags"
        :key="tag"
        :to="`/tags/${slugify(tag)}`"
        class="tag"
        @click.stop
      >
        {{ tag }}
      </RouterLink>
    </div>
  </RouterLink>

  <span v-else class="card problem-card problem-card--missing">
    {{ t('problem.not_found', { id }) }}
  </span>
</template>

<style scoped>
.problem-card {
  display: block;
}
.problem-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s3);
  margin-bottom: var(--s2);
}
.problem-card__titles {
  min-width: 0;
}
.problem-card__name {
  display: block;
  font-weight: 600;
  line-height: 1.3;
}
.problem-card__setters {
  display: block;
  color: var(--c-muted);
  font-size: 0.85rem;
  margin-top: 0.1rem;
}
.problem-card__corner {
  display: flex;
  align-items: center;
  gap: var(--s2);
  flex-shrink: 0;
}
.problem-card__date {
  font-family: var(--font-mono);
  color: var(--c-faint);
  font-size: 0.85rem;
}
.problem-card__warn {
  width: 1.05em;
  height: 1.05em;
  color: var(--c-warn-fg);
}

.problem-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s2);
}
.problem-card__stars {
  display: inline-flex;
  color: var(--c-accent);
  letter-spacing: 0.1em;
}
.problem-card__stars .off {
  color: var(--c-border-strong);
}
.problem-card__score {
  color: var(--c-muted);
  font-size: 0.85rem;
}
/* Topic is a plain accent link — distinct from the tag badges. */
.problem-card__topic {
  color: var(--c-accent);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
}
.problem-card__topic:hover {
  color: var(--c-accent-strong);
  text-decoration: underline;
}
.problem-card__open {
  color: var(--c-warn-fg);
  background: var(--c-warn-bg);
  border-radius: var(--radius-pill);
  padding: 0.1rem 0.6rem;
  font-size: 0.8rem;
}

.problem-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: var(--s2);
}

/* Unknown ID: a muted, non-interactive placeholder. */
.problem-card--missing {
  color: var(--c-muted);
  font-size: 0.9rem;
}
</style>
