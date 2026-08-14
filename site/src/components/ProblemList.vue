<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ProblemMeta } from '@/types'
import { formatDate, formatDateShort } from '@/lib/date'
import { useMediaQuery } from '@/lib/media'
import { slugify } from '@/lib/slug'

withDefaults(
  defineProps<{
    problems: ProblemMeta[]
    // Hide the setters column when it is redundant (e.g. on a setter's page).
    showSetters?: boolean
  }>(),
  { showSetters: true },
)

const { t, locale } = useI18n()

// Narrow screens show only YY/MM/DD in the date column to save horizontal space.
const isNarrow = useMediaQuery('(max-width: 640px)')
const fmtDate = (id: string) =>
  isNarrow.value ? formatDateShort(id, locale.value) : formatDate(id, locale.value)
</script>

<template>
  <ul class="list">
    <!-- The card is a plain <li>; the problem link covers the date+name area and
         the setter links sit beside it.  They must NOT nest inside the problem
         link: nested <a> is invalid HTML, and the browser's parser (which now
         parses our prerendered pages) closes the outer anchor at the first
         inner one — breaking hydration and the card's structure. -->
    <li v-for="p in problems" :key="p.id" class="card row">
      <RouterLink :to="`/problem/${p.id}`" class="card-main">
        <span class="id">{{ fmtDate(p.id) }}</span>
        <span class="name">
          <template v-if="p.status === 'err'">{{ t('common.err_prefix') }}</template> {{ p.name }}
        </span>
      </RouterLink>
      <span v-if="showSetters" class="setters">
        <template v-for="s in p.setter" :key="s">
          <RouterLink :to="`/setters/${slugify(s)}`">{{ s }}</RouterLink>
        </template>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--s4);
  align-items: baseline;
}
/* The date+name grid lives inside the problem link, so the row's column
   structure is preserved while the anchor stays a real, focusable box. */
.card-main {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: var(--s4);
  align-items: baseline;
  color: inherit;
  text-decoration: none;
  min-width: 0;
}
.name {
  /* Long titles truncate with an ellipsis instead of wrapping the row. */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.setters {
  text-align: right;
}
.setters a {
  margin-left: var(--s2);
}

/* Mobile: collapse to a two-column row, size the date column to the (short)
   YY/MM/DD form, and drop the setters column. */
@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr;
  }
  .card-main {
    grid-template-columns: auto 1fr;
  }
  .setters {
    display: none;
  }
}
</style>
