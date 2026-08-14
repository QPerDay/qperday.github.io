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
