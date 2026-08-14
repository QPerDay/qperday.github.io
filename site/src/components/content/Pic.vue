<script setup lang="ts">
import { computed } from 'vue'

// Image wrapper with a caption.  `src` may be a bare filename or a path under
// `src/assets/`; it is resolved to the bundled (hashed) asset URL at build
// time via Vite's `?url` glob.
const props = withDefaults(
  defineProps<{
    src: string
    caption?: string
    alt?: string
  }>(),
  { caption: '', alt: '' },
)

const assets = import.meta.glob('../../assets/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const url = computed(() => {
  const base = props.src.split('/').pop() ?? props.src
  for (const [path, resolved] of Object.entries(assets)) {
    if (path.split('/').pop() === base) return resolved
  }
  // Not bundled (e.g. an external URL) — pass through unchanged.
  return props.src
})
</script>

<template>
  <figure class="pic">
    <img :src="url" :alt="alt || caption || ''" loading="lazy" />
    <figcaption v-if="caption" class="pic__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.pic {
  margin: var(--s4) 0;
  text-align: center;
}
.pic img {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
}
.pic__caption {
  margin-top: var(--s2);
  color: var(--c-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
