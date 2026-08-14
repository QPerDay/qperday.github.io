// Format a problem ID (`YYYYMMDD`) as a human-friendly date, e.g.
// `"20260724"` -> `"2026 Jul 24"` (en) or `"2026年7月24日"` (zh).  IDs are
// guaranteed to be 8 digits.  Locale is passed in so the formatting follows
// the active i18n locale (and re-renders when it changes).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(id: string, locale = 'en'): string {
  const year = id.slice(0, 4)
  const month = Number(id.slice(4, 6))
  const day = Number(id.slice(6, 8))

  if (locale.toLowerCase().startsWith('zh')) {
    return `${year}年${month}月${day}日`
  }

  const mmm = MONTHS[month - 1] ?? month
  return `${year} ${mmm} ${day}`
}

// Compact form for narrow screens: two-digit year + month + day.
//   `"20260724"` -> `"26/07/24"` (locale-neutral numeric).
export function formatDateShort(id: string, _locale = 'en'): string {
  const yy = id.slice(2, 4)
  const mm = id.slice(4, 6)
  const dd = id.slice(6, 8)
  return `${yy}/${mm}/${dd}`
}
