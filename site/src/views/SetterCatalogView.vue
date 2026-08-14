<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()
const { t } = useI18n()

const rows = computed(() =>
  catalog.setters.map((name) => ({
    name,
    slug: slugify(name),
    count: catalog.problemsForSetter(name).length,
  })),
)
</script>

<template>
  <section>
    <h1>{{ t('nav.setters') }}</h1>
    <ul class="list">
      <li v-for="r in rows" :key="r.name">
        <RouterLink :to="`/setters/${r.slug}`" class="card row">
          <span class="name">{{ r.name }}</span>
          <span class="count">{{ t('catalog.problem_count', { count: r.count }) }}</span>
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
