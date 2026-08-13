<script setup lang="ts">
import 'katex/dist/katex.min.css'
import { renderMarkdown } from '@/lib/markdown'
import aboutRaw from '@/content/about.md?raw'

const html = renderMarkdown(aboutRaw)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <article class="about" v-html="html"></article>
</template>

<style scoped>
.about {
  /* A narrower, centered prose column so the text doesn't sprawl across the
     full shell width and crowd into the top-left corner. */
  max-width: 44rem;
  margin: 0 auto;
  padding: var(--s6) 0 var(--s6);
  line-height: 1.7;
}
.about :deep(h1) {
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 var(--s6);
}
.about :deep(h2) {
  font-size: 1.4rem;
  line-height: 1.25;
  margin: var(--s6) 0 var(--s4);
  padding-top: var(--s4);
}
.about :deep(p) {
  margin: var(--s4) 0;
}
.about :deep(ul) {
  padding-left: 1.5rem;
  margin: var(--s4) 0;
}
.about :deep(li) {
  margin: var(--s2) 0;
}
.about :deep(a) {
  color: var(--c-accent);
}
.about :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--c-accent-bg);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}
.about :deep(.katex-display) {
  margin: var(--s4) 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
