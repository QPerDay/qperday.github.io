#!/usr/bin/env node
// Writes src/generated/commit.json with the latest git commit, so the site can
// show a "latest commit" badge without any runtime fetch.  Run before `vite`
// and `vite build` (wired into the `dev`/`build` scripts in package.json).
//
// Falls back to an empty object when git metadata is unavailable (e.g. a
// source tarball without `.git`), which hides the badge rather than failing
// the build.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(siteRoot, 'src', 'generated', 'commit.json')

// Matches the hardcoded repo URL in src/App.vue's footer link.
const REPO_URL = 'https://github.com/QPerDay/qperday.github.io'

// Fields, NUL-separated (commit subjects never contain NUL):
//   %H  full hash      %h  short hash     %cI committer date (ISO 8601)
//   %cs committer date (YYYY-MM-DD)       %s  subject line      %an author name
const FORMAT = '%H%x00%h%x00%cI%x00%cs%x00%s%x00%an'

function readCommit() {
  const out = execFileSync('git', ['log', '-1', `--format=${FORMAT}`], {
    cwd: siteRoot,
    encoding: 'utf8',
  }).trim()
  const [hash, shortHash, date, dateShort, message, author] = out.split('\x00')
  return { hash, shortHash, date, dateShort, message, author }
}

let commit
try {
  commit = readCommit()
} catch {
  commit = null
  console.warn('[commit-info] git metadata unavailable — commit badge will be hidden.')
}

const data = commit ? { ...commit, url: `${REPO_URL}/commit/${commit.hash}` } : {}

mkdirSync(path.dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(data, null, 2) + '\n')
console.log(
  `[commit-info] wrote ${path.relative(siteRoot, outFile)}` +
    (commit ? ` (${commit.shortHash})` : ''),
)
