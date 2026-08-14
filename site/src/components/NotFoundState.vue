<script setup lang="ts">
// Route-level "not found" state, designed to match the 404 catch-all page:
// one formal statement in the serif proof style, a human-readable message,
// and a back link — centered like the cover page.
defineProps<{
  /** Kind label in the formal statement, e.g. "Problem", "Tag", "Entry". */
  kind: string
  /** Attribute name, e.g. "id", "name", "slug". */
  attr: string
  /** The missing value (problem id, tag name, blog slug, …). */
  value: string
  /** Human-readable explanation. */
  message: string
  /** Link target for the back button. */
  to: string
  /** Back button label. */
  backLabel: string
}>()
</script>

<template>
  <section class="nfs">
    <div class="proof nfs__proof" :aria-label="message">
      <p class="proof__stmt">
        <span class="proof__num">1.</span>
        <span class="proof__math">
          ∄ <var>x</var> : <span class="upright">{{ kind }}</span>,
          <span class="upright">{{ attr }}</span> <var>x</var> =
          <code class="proof__value">{{ value }}</code>
        </span>
      </p>
    </div>

    <p class="nfs__message">{{ message }}</p>
    <RouterLink :to="to" class="btn btn--secondary">{{ backLabel }}</RouterLink>
  </section>
</template>

<style scoped>
/* Centered cover-style column, mirroring NotFoundView. */
.nfs {
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
.nfs__proof {
  margin-bottom: var(--s4);
}
.nfs__message {
  color: var(--c-muted);
  margin: 0;
}
</style>
