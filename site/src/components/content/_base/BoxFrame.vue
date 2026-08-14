<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type BoxTone = 'problem' | 'answer' | 'warning' | 'info' | 'error' | 'theorem'

const props = withDefaults(defineProps<{ title?: string; tone?: BoxTone }>(), { tone: 'problem' })

const { t } = useI18n()

// Icon glyph for each tone (Lucide-style, 24×24, stroked with currentColor so
// it inherits the box's accent colour).
const ICONS: Record<BoxTone, string> = {
  problem:
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  answer:
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  warning:
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info:
    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  error:
    '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  theorem:
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
}

// Explicit `title` wins; otherwise fall back to a localized default label so
// the box is still semantically labelled by text, not just colour.
const label = computed(() => props.title || t(`content.box.${props.tone}`))

const iconSvg = computed(
  () =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[props.tone]}</svg>`,
)
</script>

<template>
  <div class="box" :class="`box--${tone}`">
    <header class="box__head">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span class="box__icon" v-html="iconSvg" />
      <span class="box__label">{{ label }}</span>
    </header>
    <div class="box__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.box {
  border: 1px solid var(--box-border);
  border-left: 4px solid var(--box-border);
  border-radius: var(--radius);
  margin: var(--s4) 0;
  overflow: hidden;
}
.box__head {
  display: flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s2) var(--s3);
  color: var(--box-fg);
  background: var(--box-bg);
  border-bottom: 1px solid var(--box-border);
}
.box__icon {
  display: inline-flex;
  width: 1.1em;
  height: 1.1em;
  flex: 0 0 auto;
}
.box__icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
.box__label {
  font-weight: 700;
  line-height: 1.3;
}
.box__body {
  padding: var(--s3);
}

.box--problem {
  --box-fg: #1c3d5a;
  --box-bg: #eef3f8;
  --box-border: #3b6ea5;
}
.box--answer {
  --box-fg: #1e6b3c;
  --box-bg: #eaf6ef;
  --box-border: #2f9e57;
}
.box--warning {
  --box-fg: #8a6d1a;
  --box-bg: #fdf6e3;
  --box-border: #c9a227;
}
.box--info {
  --box-fg: #115e73;
  --box-bg: #e7f5f8;
  --box-border: #2b93ab;
}
.box--error {
  --box-fg: #a12424;
  --box-bg: #fdecec;
  --box-border: #d64545;
}
.box--theorem {
  --box-fg: #5a3b8a;
  --box-bg: #f4eefb;
  --box-border: #7a52b8;
}
</style>
