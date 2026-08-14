<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HeadingItem } from '@/lib/frontmatter'

const props = defineProps<{ headings: HeadingItem[] }>()

const { t } = useI18n()

// Scroll-spy: highlight the heading currently nearest the reading line.  A
// passive scroll listener (rAF-throttled) is simpler and cheaper than an
// IntersectionObserver here, since heading counts are tiny.
const activeId = ref('')

// Reading line in px from the viewport top.  Sits a little *below* the
// headings' `scroll-margin-top` (5rem = 80px), so a heading jumped to via an
// anchor click lands above the line and reads as active immediately.  Without
// this buffer, sub-pixel scroll rounding can leave the clicked heading a hair
// below an equal threshold and highlight the previous section instead.
const READ_TOP = 96

let ticking = false
function update() {
  ticking = false
  let current = ''
  for (const h of props.headings) {
    const el = document.getElementById(h.id)
    if (el && el.getBoundingClientRect().top <= READ_TOP) current = h.id
  }
  // The comments section is the last "heading" in the document.
  const commentsEl = document.getElementById('comments')
  if (commentsEl && commentsEl.getBoundingClientRect().top <= READ_TOP) current = 'comments'
  activeId.value = current
}
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="toc" :aria-label="t('content.toc')">
    <p class="toc__title">{{ t('content.toc') }}</p>
    <ul class="toc__list">
      <li
        v-for="h in headings"
        :key="h.id"
        class="toc__item"
        :class="{ 'toc__item--sub': h.level > 2 }"
      >
        <a
          class="toc__link"
          :class="{ 'is-active': activeId === h.id }"
          :href="`#${h.id}`"
        >{{ h.text }}</a>
      </li>

      <li class="toc__item">
        <a
          class="toc__link"
          :class="{ 'is-active': activeId === 'comments' }"
          href="#comments"
        >{{ t('content.comments') }}</a>
      </li>
    </ul>

    <a class="toc__top" href="#top">
      <svg
        class="toc__top-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      <span>{{ t('content.top') }}</span>
    </a>
  </nav>
</template>

<style scoped>
.toc {
  font-size: 0.85rem;
  line-height: 1.4;
}
.toc__title {
  margin: 0 0 var(--s2);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--c-muted);
}
.toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toc__link {
  display: block;
  padding: var(--s1) var(--s2);
  border-left: 2px solid transparent;
  border-radius: 0 4px 4px 0;
  color: var(--c-muted);
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.toc__link:hover {
  color: var(--c-accent-strong);
  background: var(--c-accent-bg);
}
.toc__link.is-active {
  color: var(--c-accent-strong);
  border-left-color: var(--c-accent);
  font-weight: 600;
}
/* Deeper headings indent and read a touch smaller. */
.toc__item--sub .toc__link {
  padding-left: var(--s4);
  font-size: 0.8rem;
}
/* "Back to top" sits below the list, separated and muted. */
.toc__top {
  display: flex;
  align-items: center;
  gap: var(--s1);
  margin-top: var(--s3);
  padding-top: var(--s2);
  border-top: 1px solid var(--c-border);
  color: var(--c-muted);
  font-size: 0.8rem;
  text-decoration: none;
}
.toc__top:hover {
  color: var(--c-accent-strong);
}
.toc__top-icon {
  width: 0.9em;
  height: 0.9em;
  flex: 0 0 auto;
}
</style>
