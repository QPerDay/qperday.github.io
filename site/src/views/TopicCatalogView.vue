<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()

const rows = computed(() =>
  catalog.topics.map((name) => ({
    name,
    slug: slugify(name),
    count: catalog.problems.filter((p) => p.topic === name).length,
  })),
)
</script>

<template>
  <section>
    <h1>Topics</h1>
    <ul class="list">
      <li v-for="r in rows" :key="r.name">
        <RouterLink :to="`/topics/${r.slug}`" class="card row">
          <span class="name">{{ r.name }}</span>
          <span class="count">{{ r.count }} problem{{ r.count === 1 ? '' : 's' }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>
