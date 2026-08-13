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
}
