<script setup lang="ts">
// MDC component: embeds a Desmos calculator as a bordered, width-filling
// iframe.  Usage:  ::desmos{src="https://www.desmos.com/3d/mkgde7bh6s"}
withDefaults(
  defineProps<{
    src: string
    title?: string
    caption?: string
    height?: string
  }>(),
  {
    title: 'Desmos graph',
    height: '28rem',
  },
)
</script>

<template>
  <figure class="desmos">
    <iframe
      class="desmos__frame"
      :src="src"
      :title="title"
      :style="{ height }"
      loading="lazy"
      allowfullscreen
    ></iframe>
    <figcaption v-if="caption" class="desmos__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.desmos {
  margin: var(--s4) 0;
}
.desmos__frame {
  display: block;
  width: 100%;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  background: #fff;
}
.desmos__caption {
  margin-top: var(--s2);
  color: var(--c-muted);
  font-size: 0.85rem;
}
</style>
