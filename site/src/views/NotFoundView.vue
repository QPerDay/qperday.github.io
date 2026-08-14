<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="notfound">
    <p class="notfound__code" aria-hidden="true">404</p>
    <h1 class="notfound__title">{{ t('notfound.title') }}</h1>
    <p class="notfound__body">{{ t('notfound.body') }}</p>
    <RouterLink to="/" class="btn btn--primary">{{ t('notfound.back') }}</RouterLink>
  </section>
</template>

<style scoped>
.notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--s3);
  padding: var(--s6) 0;
}
.notfound__code {
  font-family: var(--font-mono);
  font-size: clamp(4rem, 14vw, 7rem);
  font-weight: 700;
  line-height: 1;
  color: var(--c-border-strong);
  margin: 0;
}
.notfound__title {
  margin: 0;
  font-size: 1.75rem;
}
.notfound__body {
  color: var(--c-muted);
  margin: 0;
}
.notfound :deep(.btn) {
  margin-top: var(--s3);
}
</style>
