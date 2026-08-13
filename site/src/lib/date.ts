// Format a problem ID (`YYYYMMDD`) as a human-friendly date, e.g.
// `"20260724"` -> `"2026 Jul 24"`.  IDs are guaranteed to be 8 digits.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(id: string): string {
  const year = id.slice(0, 4)
  const month = Number(id.slice(4, 6))
  const day = id.slice(6, 8)
  const mmm = MONTHS[month - 1] ?? month
  return `${year} ${mmm} ${day}`
}
