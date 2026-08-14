<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY } from '@/i18n'

const { t, locale } = useI18n()

const locales = [
  { code: 'en', label: 'En' },
  { code: 'zh', label: '中' },
]

function setLocale(code: string) {
  locale.value = code
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code)
  } catch {
    // Storage unavailable (private mode) — the choice just won't persist.
  }
}
</script>

<template>
  <div class="seg" role="group" :aria-label="t('common.language')">
    <button
      v-for="l in locales"
      :key="l.code"
      type="button"
      class="seg-btn"
      :class="{ active: locale === l.code }"
      :aria-pressed="locale === l.code"
      @click="setLocale(l.code)"
    >
      {{ l.label }}
    </button>
  </div>
</template>

<style scoped>
.seg {
  display: inline-flex;
  align-items: stretch;
  margin-left: auto;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  overflow: hidden;
  background: var(--c-accent-bg);
}
.seg-btn {
  border: none;
  background: transparent;
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--c-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.seg-btn + .seg-btn {
  border-left: 1px solid var(--c-border);
}
.seg-btn:hover {
  color: var(--c-fg);
}
.seg-btn.active {
  background: var(--c-accent);
  color: #fff;
}
.seg-btn:focus-visible {
  outline: 2px solid var(--c-accent-strong);
  outline-offset: -2px;
}
</style>
