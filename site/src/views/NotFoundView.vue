<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

// The attempted path is only known on the client: the prerendered 404.html is
// a generic fallback page, and hydration must match it exactly.  So the server
// and the client's first paint both show the literal `<path>`, and the real
// URL is swapped in after mount.
const shownPath = ref('')
onMounted(() => {
  shownPath.value = route.fullPath
})
</script>

<template>
  <section class="notfound">
    <!-- The page's headline: two statements, typeset like a formal proof.
         Hand-typeset on purpose — the client no longer ships KaTeX (compiled
         markdown is static HTML), and the path in line 2 is dynamic.  The
         typography lives in main.css (.proof) and is shared with the
         route-level NotFoundState. -->
    <div class="proof notfound__proof" aria-label="404 is false; no page exists at this path">
      <p class="proof__stmt">
        <span class="proof__num">1.</span>
        <span class="proof__math">404 ≔ ⊥</span>
      </p>
      <p class="proof__stmt">
        <span class="proof__num">2.</span>
        <span class="proof__math">
          ∃ <var>p</var> : <span class="upright">Page</span>,
          <span class="upright">Path</span> <var>p</var> =
          <code class="proof__value">{{ shownPath || '<path>' }}</code> → 404
        </span>
      </p>
    </div>

    <h1 class="notfound__title">{{ t('notfound.title') }}</h1>
    <p class="notfound__body">{{ t('notfound.body') }}</p>
    <RouterLink to="/" class="btn btn--primary">{{ t('notfound.back') }}</RouterLink>
  </section>
</template>

<style scoped>
.notfound {
  /* Centered like the cover page: fill the shell, then center the column. */
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--s3);
  padding: var(--s6) 0;
}
.notfound__proof {
  margin-bottom: var(--s4);
}
.notfound__title {
  margin: 0;
  font-size: 1.5rem;
}
.notfound__body {
  color: var(--c-muted);
  margin: 0;
}
.notfound :deep(.btn) {
  margin-top: var(--s3);
}
</style>
