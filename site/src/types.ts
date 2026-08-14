// Problem metadata as produced by ../export_web.py and consumed by the site.
// `setter` and `tags` are arrays; `difficulty` is an integer or null.
export interface ProblemMeta {
  id: string
  date: string
  name: string
  setter: string[]
  score: string
  status: string
  topic: string
  difficulty: number | null
  tags: string[]
  // true => the problem is still "open": the answer is withheld from the site.
  open: boolean
  // Allowed resources (e.g. "CAS", "Calculator").  Surfaced for future
  // tool/CAS integration on the site.
  resources: string[]
}

export interface ProblemQuery {
  search?: string
  setter?: string
  status?: '' | 'ok' | 'err'
  topic?: string
  tag?: string
  // Inclusive date bounds, ISO `YYYY-MM-DD` (matching `ProblemMeta.date`).
  dateFrom?: string
  dateTo?: string
}

// Topic descriptions as produced by ../export_web.py (from `\topic` lines in
// main.tex) and consumed by the Topics catalog.
export interface TopicMeta {
  name: string
  description: string
}

// Setter contacts as produced by ../export_web.py (from `\setterContact` lines
// in main.tex) and consumed by the setter pages.
export interface ContactMeta {
  label: string
  url: string
}
export interface SetterMeta {
  name: string
  contacts: ContactMeta[]
}
