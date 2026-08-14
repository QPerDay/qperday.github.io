<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'

const catalog = useCatalog()
const { t } = useI18n()

// Today's date as a `YYYYMMDD` problem ID (local time).
const todayId = (() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
})()

// The problem dated today, if one exists.
const today = computed(() => catalog.problem(todayId))
</script>

<template>
  <section class="hero">
    <p class="equation">∂<sub>t</sub> Q = 1</p>
    <p class="tagline">{{ t('hero.tagline') }}</p>

    <div class="cta">
      <RouterLink v-if="today" :to="`/problem/${today.id}`" class="btn btn--primary">
        {{ t('hero.today') }}
      </RouterLink>
      <RouterLink to="/problem" class="btn" :class="today ? 'btn--secondary' : 'btn--primary'">
        {{ t('hero.catalog') }}
      </RouterLink>
      <RouterLink to="/blog/about" class="btn btn--secondary">
        {{ t('nav.about') }}
      </RouterLink>
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