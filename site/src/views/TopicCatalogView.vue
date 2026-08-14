<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()
const { t } = useI18n()

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
    <h1>{{ t('nav.topics') }}</h1>
    <ul class="list">
      <li v-for="r in rows" :key="r.name">
        <RouterLink :to="`/topics/${r.slug}`" class="card row">
          <span class="name">{{ r.name }}</span>
          <span v-if="catalog.topicDescriptions[r.name]" class="desc">
            {{ catalog.topicDescriptions[r.name] }}
          </span>
          <span class="count">{{ t('catalog.problem_count', { count: r.count }) }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* Name + description on the left, count anchored to the right. */
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'name count'
    'desc count';
  column-gap: var(--s4);
  row-gap: var(--s1);
  align-items: center;
}
.name {
  grid-area: name;
}
.desc {
  grid-area: desc;
  color: var(--c-muted);
  font-size: 0.9rem;
  line-height: 1.4;
}
.count {
  grid-area: count;
  color: var(--c-muted);
}
</style>
