<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NavBar from '@/components/NavBar.vue'

const { t, locale } = useI18n()

// Keep <html lang> and the document title in sync with the active locale.
watch(
  locale,
  (l) => {
    document.documentElement.lang = l
    document.title = t('meta.title')
  },
  { immediate: true },
)
</script>

<template>
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
</template>

<style scoped>
.shell {
  padding: var(--s6);
  max-width: var(--measure);
  margin: 0 auto;
}
.footer {
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
