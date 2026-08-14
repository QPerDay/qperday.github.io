import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createWebHistory } from 'vue-router'

import App from './App.vue'
import i18n from './i18n'
import { createAppRouter } from './router'

import '@/assets/main.css'
import '@/assets/content.css'

// createSSRApp (not createApp) so the client *hydrates* the prerendered HTML
// emitted by scripts/prerender.mjs instead of re-rendering over it.  In dev
// (no prerendered HTML) Vue falls back to a full client render.
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
