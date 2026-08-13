<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '@/stores/catalog'

const catalog = useCatalog()

// The most recent problem (highest ID) is "today's" problem.
const latest = computed(() => catalog.problems[catalog.problems.length - 1])
</script>

<template>
  <section class="hero">
    <p class="equation">∂<sub>t</sub> Q = 1</p>
    <p class="tagline">A curated collection of physics problems by the QPD problem-setting group.</p>

    <div class="cta">
      <RouterLink v-if="latest" :to="`/problem/${latest.id}`" class="btn btn--primary">
        Today's Problem
      </RouterLink>
      <RouterLink to="/problem" class="btn btn--secondary">Catalog</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--s6);
}
.equation {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-style: italic;
  font-family: var(--font-serif, Georgia, 'Times New Roman', serif);
  margin: 0;
}
.tagline {
  font-size: 1.15rem;
  color: var(--c-muted);
  max-width: 36rem;
  margin: 0;
}
.cta {
  display: flex;
  gap: var(--s3);
  flex-wrap: wrap;
  justify-content: center;
}
.btn {
  display: inline-block;
  padding: var(--s3) var(--s6);
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 600;
}
.btn--primary {
  background: var(--c-accent);
  color: #fff;
}
.btn--primary:hover {
  background: var(--c-accent-strong);
}
.btn--secondary {
  border: 1px solid var(--c-accent);
  color: var(--c-accent);
}
.btn--secondary:hover {
  background: var(--c-accent-bg);
}
</style>
