<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { formatDate } from '@/lib/date'

const props = defineProps<{ nameNormalized: string }>()

const catalog = useCatalog()

const name = computed(() => catalog.setterFromSlug(props.nameNormalized))
const problems = computed(() => (name.value ? catalog.problemsForSetter(name.value) : []))
</script>

<template>
  <section v-if="name">
    <h1>{{ name }}</h1>
    <p class="count">{{ problems.length }} problem{{ problems.length === 1 ? '' : 's' }}</p>

    <ul class="list">
      <li v-for="p in problems" :key="p.id">
        <RouterLink :to="`/problem/${p.id}`" class="card row">
          <span class="id">{{ formatDate(p.id) }}</span>
          <span class="name">
            <template v-if="p.status === 'err'">[ERR]</template> {{ p.name }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
  <p v-else>Setter <code>{{ nameNormalized }}</code> not found.</p>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: var(--s4);
}
</style>
