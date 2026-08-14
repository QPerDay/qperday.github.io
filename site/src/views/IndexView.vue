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
  /* Fill the available height (the app is a 100dvh flex column), so the page
     always fits the viewport with no vertical scroll, shrinking on short
     screens instead of overflowing. */
  flex: 1 1 auto;
  min-height: 0;
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
  font-family: var(--font-serif);
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
/* Buttons come from the shared `.btn` primitives in main.css. */
</style>