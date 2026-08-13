<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()

const search = ref('')
const status = ref<'' | 'ok' | 'err'>('')
const topic = ref('')

const results = computed(() =>
  catalog.query({ search: search.value, status: status.value, topic: topic.value }),
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
    </form>

    <p class="count">{{ results.length }} of {{ catalog.ids.length }} problems</p>

    <ul class="list">
      <li v-for="p in results" :key="p.id">
        <RouterLink :to="`/problem/${p.id}`" class="card row">
          <span class="id">{{ p.id }}</span>
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
  gap: var(--s3);
  margin: var(--s4) 0;
}
.filters input {
  flex: 1;
  padding: 0.4rem 0.6rem;
}
.row {
  display: grid;
  grid-template-columns: 7rem 1fr auto;
  gap: var(--s4);
  align-items: baseline;
}
.setters a {
  margin-left: var(--s2);
}
</style>
