<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('notfound.title') }}</h1>
    <p>{{ t('notfound.body') }}</p>
    <p><RouterLink to="/">{{ t('notfound.back') }}</RouterLink></p>
  </section>
</template>
