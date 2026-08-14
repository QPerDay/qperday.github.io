<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { applyDetectedLocale } from '@/i18n'
import NavBar from '@/components/NavBar.vue'

const { t, locale } = useI18n()

// Keep <html lang> and the document title in sync with the active locale.
// The immediate body is skipped during SSR/prerender (no `document` in Node);
// the prerendered HTML carries the deterministic English locale instead.
watch(
  locale,
  (l) => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = l
    document.title = t('meta.title')
  },
  { immediate: true },
)

// Apply the user's saved/browser locale after hydration.  The server-rendered
// HTML (and the client's first paint, for hydration parity) are English; this
// swap triggers the watcher above, which syncs <html lang> and the title.
onMounted(() => {
  applyDetectedLocale()
})
</script>

<template>
  <div class="app">
    <NavBar />

    <main class="shell">
      <RouterView />
    </main>

    <footer class="footer">
    <p>
      {{ t('footer.copyright') }}, {{ t('footer.licensed') }}
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">
        {{ t('footer.cc') }}
      </a>
      — {{ t('footer.license_text') }}
      <a href="mailto:sophiec2010@163.com" target="_blank" rel="noopener">{{ t('footer.get_in_touch') }}</a>
      {{ t('footer.if_reuse') }}
    </p>
    <p>
      <a href="https://github.com/QPerDay/qperday.github.io" target="_blank" rel="noopener">
        {{ t('footer.source') }}
      </a>
    </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  /* Full-viewport column: nav on top, main filling the middle, footer at the
     bottom.  `dvh` tracks the real viewport height (mobile address bar), so the
     home page never overflows vertically. */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}
.shell {
  /* `width: 100%` is required because .shell is a flex item of the .app column:
     without it, `margin: 0 auto` shrink-wraps the item to its content instead
     of letting `max-width` + auto margins center it at full width. */
  width: 100%;
  padding: var(--s6);
  max-width: var(--measure);
  margin: 0 auto;
  /* Clip horizontal overflow (e.g. the off-screen PDF-button tooltips) so it
     can't create a stray horizontal scrollbar.  `clip` — not `hidden` — so this
     doesn't become a scroll container and `position: sticky` / the top-layer
     `<dialog>` keep working. */
  overflow-x: clip;
  /* Grow to fill the space between nav and footer.  Also a flex column so the
     home hero can fill it; content taller than the viewport still expands it
     normally (no clipping). */
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
.footer {
  flex: 0 0 auto;
  width: 100%;
  max-width: var(--measure);
  margin: var(--s6) auto 0;
  padding: var(--s4) 1.5rem;
  border-top: 1px solid var(--c-border);
  color: var(--c-muted);
  font-size: 0.85rem;
}
.footer p {
  margin: 0;
}
.footer p + p {
  margin-top: var(--s2);
}
.footer a {
  color: var(--c-accent);
}
</style>
