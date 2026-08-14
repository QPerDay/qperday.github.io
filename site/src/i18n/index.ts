import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

export const LOCALE_STORAGE_KEY = 'qpd.locale'

// Initial locale: an explicit saved choice wins, otherwise the browser
// language, otherwise English.
function detectLocale(): 'en' | 'zh' {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    // localStorage unavailable (private mode) — fall through to detection.
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

const messages = { en, zh }

// The i18n singleton initializes deterministically with English: the module is
// shared by the SSR/prerender entry (Node, no localStorage/navigator), and the
// client must also render English on first paint so hydration matches the
// prerendered HTML.  `applyDetectedLocale()` (client-only, called in App.vue's
// onMounted) swaps to the detected locale after hydration.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

// Read localStorage/navigator and apply the result to the live instance.
// Client-only: touches browser APIs, so never call this during SSR.
export function applyDetectedLocale(): void {
  i18n.global.locale.value = detectLocale()
}

export default i18n
