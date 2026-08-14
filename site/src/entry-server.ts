import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from '@vue/server-renderer'

import App from './App.vue'
import i18n from './i18n'
import { createAppRouter } from './router'

// Prerender entry.  scripts/prerender.mjs imports the built
// dist-server/entry-server.js and calls render(url) once per route.
// Dependency-light by design: no browser APIs, and heavy lazy imports (the
// PDF viewer) are never resolved because their render guards stay closed
// during SSR.
export async function render(url: string): Promise<{ html: string; title: string }> {
  const app = createSSRApp(App)
  const router = createAppRouter(createMemoryHistory())

  app.use(createPinia())
  app.use(router)
  app.use(i18n)

  await router.push(url)
  await router.isReady()

  // Locale is deterministically 'en' at module init and never mutated during
  // SSR (App.vue guards its document writes), so every prerendered page is
  // English — the client's first paint is too, keeping hydration in sync.
  const html = await renderToString(app)
  const title = i18n.global.t('meta.title')

  return { html, title }
}
