<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()
const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('nav.tags') }}</h1>
    <ul class="list">
      <li v-for="[name, count] in catalog.tags" :key="name">
        <RouterLink :to="`/tags/${slugify(name)}`" class="card row">
          <span class="name">{{ name }}</span>
          <span class="count">{{ t('catalog.problem_count', { count }) }}</span>
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
