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
    /** Image width as any CSS length/percentage (defaults to 80%). */
    width?: string
  }>(),
  { caption: '', alt: '', width: '80%' },
)

const url = computed(() => {
  // External URLs pass through unchanged.  Bundled assets emit a placeholder
  // token (basename only) instead of a resolved URL: the compiled HTML is
  // baked into content.json once, but the correct URL differs per build —
  // `/src/assets/…` under `vite dev` vs the hashed `/assets/…-HASH.png` in
  // production/SSR.  `resolveAssetUrls` in src/lib/content.ts swaps the token
  // for the right URL at render time via Vite's `?url` glob.
  if (/^(https?:)?\/\//.test(props.src)) return props.src
  const base = props.src.split('/').pop() ?? props.src
  return `__QPD_ASSET__:${base}`
})
</script>

<template>
  <figure class="pic">
    <img :src="url" :alt="alt || caption || ''" :style="{ width }" loading="lazy" />
    <figcaption v-if="caption" class="pic__caption">{{ caption }}</figcaption>
  </figure>
</template>
