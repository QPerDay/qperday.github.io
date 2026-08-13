<script setup lang="ts">
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()
</script>

<template>
  <section>
    <h1>Tags</h1>
    <ul class="list">
      <li v-for="[name, count] in catalog.tags" :key="name">
        <RouterLink :to="`/tags/${slugify(name)}`" class="card row">
          <span class="name">{{ name }}</span>
          <span class="count">{{ count }} problem{{ count === 1 ? '' : 's' }}</span>
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
