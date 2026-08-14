// sync.mjs — pull the web/ export into the site.
//
//   node scripts/sync.mjs
//
// Flattens ../web/{id}/meta.json -> src/data/problem-{id}.json (so it can be
// imported at compile time via import.meta.glob), and copies the PDFs into
// public/data/ (served as static files, referenced by URL at runtime).
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = dirname(dirname(fileURLToPath(import.meta.url)))
const web = join(site, '..', 'web')
const dataDir = join(site, 'src', 'data')
const publicData = join(site, 'public', 'data')

const tocPath = join(web, 'toc.json')
if (!existsSync(tocPath)) {
  console.error('web/toc.json not found. Run `./export.sh --web` from the repo root first.')
  process.exit(1)
}

const toc = JSON.parse(readFileSync(tocPath, 'utf8'))

rmSync(dataDir, { recursive: true, force: true })
rmSync(publicData, { recursive: true, force: true })
mkdirSync(dataDir, { recursive: true })
mkdirSync(publicData, { recursive: true })

let n = 0
for (const id of toc) {
  const metaSrc = join(web, id, 'meta.json')
  if (existsSync(metaSrc)) {
    writeFileSync(join(dataDir, `problem-${id}.json`), readFileSync(metaSrc, 'utf8'))
  }

  const idPub = join(publicData, id)
  mkdirSync(idPub, { recursive: true })
  for (const which of ['statement', 'answer']) {
    const pdf = join(web, id, `${which}.pdf`)
    if (existsSync(pdf)) copyFileSync(pdf, join(idPub, `${which}.pdf`))
  }
  n++
}

// Topic descriptions (from \topic declarations in main.tex) -> src/data/topics.json.
const topicsSrc = join(web, 'topics.json')
if (existsSync(topicsSrc)) {
  writeFileSync(join(dataDir, 'topics.json'), readFileSync(topicsSrc, 'utf8'))
}

// Setter contacts (from \setterContact declarations in main.tex).
const settersSrc = join(web, 'setters.json')
if (existsSync(settersSrc)) {
  writeFileSync(join(dataDir, 'setters.json'), readFileSync(settersSrc, 'utf8'))
}

console.log(`Synced ${n} problems -> src/data/ (JSON) + public/data/ (PDFs)`)
