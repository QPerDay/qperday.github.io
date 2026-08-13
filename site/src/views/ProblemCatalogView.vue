<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { formatDate } from '@/lib/date'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()

const search = ref('')
const status = ref<'' | 'ok' | 'err'>('')
const topic = ref('')
const dateFrom = ref('')
const dateTo = ref('')
// Whether each bound is applied.  Unchecking disables the selector and
// ignores its value without discarding it, so it can be re-enabled in place.
const useFrom = ref(false)
const useTo = ref(false)

const results = computed(() =>
  catalog.query({
    search: search.value,
    status: status.value,
    topic: topic.value,
    dateFrom: useFrom.value ? dateFrom.value : '',
    dateTo: useTo.value ? dateTo.value : '',
  }),
)
</script>

<template>
  <section>
    <h1>Problems</h1>

    <form class="filters" @submit.prevent>
      <input v-model="search" type="search" placeholder="Search name / topic / tags…" />
      <select v-model="status">
        <option value="">All statuses</option>
        <option value="ok">OK only</option>
        <option value="err">ERR only</option>
      </select>
      <select v-model="topic">
        <option value="">All topics</option>
        <option v-for="t in catalog.topics" :key="t" :value="t">{{ t }}</option>
      </select>
      <label class="range">
        <input v-model="useFrom" type="checkbox" />
        <span class="range-label">From</span>
        <input v-model="dateFrom" type="date" :disabled="!useFrom" />
      </label>
      <label class="range">
        <input v-model="useTo" type="checkbox" />
        <span class="range-label">To</span>
        <input v-model="dateTo" type="date" :disabled="!useTo" />
      </label>
    </form>

    <p class="count">{{ results.length }} of {{ catalog.ids.length }} problems</p>

    <ul class="list">
      <li v-for="p in results" :key="p.id">
        <RouterLink :to="`/problem/${p.id}`" class="card row">
          <span class="id">{{ formatDate(p.id) }}</span>
          <span class="name">
            <template v-if="p.status === 'err'">[ERR]</template> {{ p.name }}
          </span>
          <span class="setters">
            <template v-for="s in p.setter" :key="s">
              <RouterLink :to="`/setters/${slugify(s)}`">{{ s }}</RouterLink>
            </template>
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
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
  padding: 0.4rem 0.6rem;
}
.filters input[type='date'],
.filters select {
  padding: 0.4rem 0.6rem;
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
.range input[type='date']:disabled {
  color: var(--c-faint);
  background: var(--c-border);
  cursor: not-allowed;
}
.row {
  display: grid;
  grid-template-columns: 8rem 1fr auto;
  gap: var(--s4);
  align-items: baseline;
}
.setters a {
  margin-left: var(--s2);
}
</style>
