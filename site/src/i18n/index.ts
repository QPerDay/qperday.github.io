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

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages,
})

export default i18n
