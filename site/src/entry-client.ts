import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createWebHistory } from 'vue-router'

import App from './App.vue'
import i18n from './i18n'
import { createAppRouter } from './router'

import '@/assets/main.css'
import '@/assets/content.css'

// createSSRApp (not createApp) so the client *hydrates* the prerendered HTML
// emitted by scripts/prerender.mjs instead of re-rendering over it.
//
// In dev, index.html's `<!--app-html-->` placeholder is served verbatim (only
// scripts/prerender.mjs replaces it, and it only runs in the prod build).
// Hydrating the app against a lone comment node logs a spurious mismatch and
// re-renders everything anyway — so detect the un-replaced placeholder and
// clear it, letting Vue do a clean full client render with no warnings.
const container = document.querySelector('#app')
if (container && container.innerHTML.trim() === '<!--app-html-->') {
  container.innerHTML = ''
}

const app = createSSRApp(App)

app.use(createPinia())
const router = createAppRouter(createWebHistory(import.meta.env.BASE_URL))
app.use(router)
app.use(i18n)

// Wait for the router's initial navigation before mounting, so the client's
// first render matches the prerendered HTML (the server entry awaits the same
// navigation).  Without this, RouterView renders a placeholder comment on the
// first client pass and hydration reports a mismatch against the real page.
router.isReady().then(() => {
  app.mount('#app')
})
