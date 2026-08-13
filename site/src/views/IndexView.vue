<script setup lang="ts">
import { useCatalog } from '@/stores/catalog'

const catalog = useCatalog()
</script>

<template>
  <section>
    <h1>QPD — Problem Per Day</h1>
    <p>A curated collection of physics problems by the QPD problem-setting group.</p>

    <ul>
      <li>
        <RouterLink to="/problem">{{ catalog.ids.length }} problems</RouterLink>
      </li>
      <li>
        <RouterLink to="/setters">{{ catalog.setters.length }} setters</RouterLink>
      </li>
    </ul>
  </section>
</template>
