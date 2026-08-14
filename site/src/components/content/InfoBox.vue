<script setup lang="ts">
import BoxFrame from './_base/BoxFrame.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <BoxFrame tone="info" :title="title">
    <slot />
  </BoxFrame>
</template>
