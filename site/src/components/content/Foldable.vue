<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    title?: string
    /** Start expanded. */
    open?: boolean
  }>(),
  { open: false },
)

const { t } = useI18n()

// Controlled `<details>`: bind the `open` attribute and sync back on every
// native toggle, so `open` can set the initial state without fighting clicks.
const isOpen = ref(props.open)
</script>

<template>
  <details
    class="foldable"
    :open="isOpen"
    @toggle="isOpen = ($event.target as HTMLDetailsElement).open"
  >
    <summary class="foldable__summary">
      <span class="foldable__chevron" aria-hidden="true">›</span>
      <span class="foldable__title">{{ title || t('content.foldable.default') }}</span>
    </summary>
    <div class="foldable__body">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.foldable {
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  margin: var(--s4) 0;
  overflow: hidden;
}
.foldable__summary {
  display: flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s2) var(--s3);
  cursor: pointer;
  user-select: none;
  list-style: none; /* hide the native disclosure triangle */
  background: var(--c-accent-bg);
  font-weight: 600;
  color: var(--c-accent-strong);
}
.foldable__summary::-webkit-details-marker {
  display: none; /* hide the native marker in WebKit */
}
.foldable__summary:hover {
  background: #e3edf5;
}
.foldable__chevron {
  display: inline-block;
  line-height: 1;
  transition: transform 0.15s ease;
}
.foldable[open] .foldable__chevron {
  transform: rotate(90deg);
}
.foldable__title {
  line-height: 1.3;
}
.foldable__body {
  padding: var(--s3);
}
</style>
