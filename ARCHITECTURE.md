# QPD — Architecture

## Overview

QPD is a LaTeX toolchain plus a static web front-end. One problem = one
`YYYYMMDD.tex` file; the same source is rendered three ways:

1. **Standalone PDF** — a single problem with its solution (for authors).
2. **Booklet PDF** — all problems grouped by month, with a TOC and an answer
   section (for distribution).
3. **Web site** — a statically generated Vue site (SSG): every route is
   prerendered to its own `dist/<route>/index.html`, fed by JSON +
   per-problem PDFs (for online browsing).

The core is a key/value **metadata** system that flows from the `.tex` source,
through an in-memory registry and the `.aux` file, into `meta.json`, and
finally into the site's compiled bundle.

---

## Files

| File | Role |
|---|---|
| `qpd-common.sty` | Environments (`problem`, `solution`, `assumptions`, `questions`, `answer`), math macros, the metadata registry + storage, answer printing |
| `QPDBooklet.cls` | Booklet document class (base `report`) — cover, foreword, month TOCs, answer section |
| `QPDSingle.cls` | Single-problem document class (base `article`) — standalone rendering |
| `qpd-bootstrap.tex` | `\input` at the top of every problem; emits `\documentclass` when standalone |
| `qpd-end.tex` | `\input` at the bottom; emits `\end{document}` when standalone |
| `export_web.py` | Incremental web exporter → `web/` (JSON + PDFs) |
| `export.sh` | Wraps `export_web.py` (and the older source-copy `export/` mode) |
| `site/` | Vue 3 + Vite + Pinia static site (SSG: content precompilation + route prerendering) |
| `site/scripts/compile-content.mjs` | Compiles `src/content/**/*.md` → `src/generated/content.json` (HTML + reference metadata) |
| `site/scripts/prerender.mjs` | Renders every route via the SSR entry → `dist/<route>/index.html` + `dist/404.html` |
| `site/scripts/generate-llms.mjs` | Emits `dist/llms.txt` + `dist/llms-full.txt` from the same metadata (llmstxt.org convention) |

---

## API

### Problem

```latex
\begin{problem}{YYYYMMDD}
  \meta{name}{Problem Name}
  \meta{setter}{Alice, Bob}
  \meta{score}{12}
  \meta{status}{err}           % optional; renders an [ERR] prefix
  \meta{topic}{mechanics}      % optional; the single most significant tag
  \meta{difficulty}{4}         % optional; integer 1–5
  \meta{tags}{mechanics,rotation,energy}   % atomic tags, no synonyms
  \meta{open}{false}           % optional; true withholds the answer on the web
  \meta{resources}{CAS}        % optional; empty = no restriction

  ... problem body ...
\end{problem}

\begin{solution}{YYYYMMDD}
  ... one \subsection*{Qn. Title} per question ...
\end{solution}
```

- `problem` takes **exactly one positional argument — the ID**. Everything
  else is a `\meta{key}{value}` line at the top of the body.
- `solution` is keyed by the same ID.

### Environments

| Environment | Arguments | Rendering |
|---|---|---|
| `problem` | `{ID}` | Header (big Q + date/name/setter/score) + resources box + body |
| `solution` | `{ID}` | **Swallowed** — stored, never rendered inline |
| `assumptions` | — | Boxed numbered list ("Assumptions") |
| `assumption` | — | Inline paragraph ("Assumption.") |
| `questions` | — | Enumerated list, auto-labelled **Q1, Q2, Q3…** |
| `answer` | — | Rule-framed "Answer." block |
| `example` | — | Inline "Example." paragraph |

### Class options

| Option | `QPDBooklet` | `QPDSingle` | Effect |
|---|---|---|---|
| `answers` | ✓ | ✓ | Print the answer section |
| `noanswers` | ✓ (default) | ✓ | Suppress answers |
| `answersonly` | — | ✓ | **Statement suppressed, answer only** (used by the web export) |
| `draft` | ✓ | ✓ | ID labels in the margin |
| `strict` | ✓ | ✓ | Missing solutions are errors, not warnings |

### Preamble commands (`QPDBooklet`)

| Command | Purpose |
|---|---|
| `\title{...}` | Cover title (unused if a cover image is set) |
| `\date{...}` | Cover date |
| `\coverimage{path}` | Cover artwork (relative path); empty = no image |
| `\intro{...}` | Foreword prose |
| `\problemsintro{...}` | Prose above the Problems TOC |
| `\answersintro{...}` | Prose above the Answers TOC |

There is no `\author` — the cover lists setters collected automatically from
`\meta{setter}`.

---

## Data model

### Metadata registry

`qpd-common.sty` keeps a single comma list of registered fields:

```latex
\def\qpd@metafields{name,setter,score,status,topic,difficulty,tags,open,resources}
```

Each field is stored in one namespace:

```
\qpd@meta@FIELD@ID   →   value
```

Accessors:

```latex
\qpd@setmeta{ID}{field}{value}   % write
\qpd@getmeta{ID}{field}          % read (empty if unset)
\qpd@getname{ID}                 % sugar → \qpd@getmeta{ID}{name}
```

### `\meta` — the author-facing declaration

`\meta{key}{value}` does two things:

1. `\qpd@setmeta{\qpd@currentid}{key}{value}` (in-memory, this run)
2. `\immediate\write\@auxout{\qpd@metaset{ID}{key}{value}}` (persist for next run)

Writing the *plain value* at the moment it's typed avoids the classic
`\csname`-in-`\write` trap (a `\write` emits the *name* of a `\csname`, never
its value).

### Cross-pass rehydration

On the next pass, the `.aux` file re-executes:

```latex
\qpd@metaset{20260803}{name}{Three Coins Again}
```

`\qpd@metaset` re-stores the field AND records the ID into `\qpd@tocorder`,
which drives month grouping, the TOC, and the answer section.

### Derived data

| Structure | Source | Purpose |
|---|---|---|
| `\qpd@problemorder` | `\begin{problem}` | ordered ID list |
| `\qpd@tocorder` | `.aux` (`\qpd@metaset`) | cross-pass problem list |
| `\qpd@monthorder` / `\qpd@monthprobs@YYYYMM` | ID → month extraction | month grouping |
| `\qpd@uniquesetters` | `\meta{setter}` | foreword author list → `.qps` |

### Solution capture

`solution` uses `+b` (body grab): the body is stored in
`\qpd@solution@ID` and never reaches the page. `\printanswers` walks the
problem list and renders each stored solution at `\end{document}`.

---

## Standalone detection

Every problem file is wrapped in:

```latex
\input qpd-bootstrap   % top
...
\input qpd-end         % bottom
```

`qpd-bootstrap.tex` checks for the `\QPDbooklet` sentinel (defined only by
`QPDBooklet.cls`):

- **Booklet** (sentinel present) → both `\input`s are no-ops; the body renders
  inside the booklet.
- **Standalone** (sentinel absent) → bootstrap emits
  `\documentclass{QPDSingle}\begin{document}`, and `qpd-end` emits
  `\end{document}`.

Standalone mode is selected with flags set *before* `\input qpd-bootstrap`:

```latex
\let\QPDnoanswerslocal=1     % statement only
\let\QPDanswersonlylocal=1   % answer only
```

The web exporter injects exactly these flags to produce `statement.pdf` and
`answer.pdf`.

---

## Booklet structure

`QPDBooklet.cls` (base `report`) produces, in order:

1. **Cover** — `\coverimage` (if set); art only, no title
2. **Foreword** — `\intro` text + setter list
3. **Problems TOC** — prose (`\problemsintro`) + a list of *months*
4. **Month fronts** — one `\chapter*` page per month with a mini-TOC
5. **Problems** — one per page, in source order
6. **Answers** — mirror structure: answers TOC → month fronts → answers

Month grouping is computed from the ID (`YYYYMMDD` → `YYYYMM`). `\chapter*`
headings are styled sparse/book-like via `titlesec`; problem/answer pages stay
compact.

---

## Web export

`export_web.py` (via `./export.sh --web`) produces:

```
web/
├── toc.json                  # ordered ID list
└── YYYYMMDD/
    ├── meta.json             # coerced metadata
    ├── statement.pdf
    └── answer.pdf            # omitted for `open` problems
```

Metadata is read from each problem's `\meta` lines and coerced by type:

| TeX value | JSON |
|---|---|
| `setter`, `tags`, `resources` | comma-split → `string[]` |
| `difficulty` | `int` (or `null`) |
| `open` | `bool` (`true`/`1`/`yes`/`on`/`y`) |
| otherwise | `string` |

The exporter is **incremental**: it hashes each problem's source and records
it in `.qpd-web-hashes.json`. Unchanged problems are skipped. Only the source
is hashed — not assets — so editing an image requires deleting that problem's
line from the hash file to force a recompile.

The `web/` directory (including its PDFs) is **committed to git**. CI consumes
the committed export rather than recompiling the TeX, so the deploy workflow
never installs TeX. The hash cache (`.qpd-web-hashes.json`) is gitignored — it
is a local-only convenience; a clean checkout always rebuilds from scratch.

---

## Site

`site/` is a Vue 3 app (Vite + Pinia + vue-router) built as a **static site**.
`pnpm build` runs two build-time phases, so the shipped `dist/` is plain HTML
per route plus a hydrated SPA on top:

### Phase 1 — content precompilation

`scripts/compile-content.mjs` (which bundles and runs
`scripts/compile-entry.ts` via `vite build --ssr`) compiles every
`src/content/{en,zh}/*.md` to HTML through the same markdown-it + MDC + Shiki
+ KaTeX pipeline the site used to run client-side, inside a throwaway SSR app
that provides pinia, the route table, and per-locale i18n so MDC components
(`problem-card`, `blog-entry-card`, boxes, …) resolve their context and
`RouterLink` renders real `<a href>`s. The output is
`src/generated/content.json`:

```
{ locale: { slug: { html, title, description, date, author,
                    problemIds, entrySlugs, headings } } }
```

Reference metadata (`problemIds`/`entrySlugs` from the `:problem-card{id=…}`
and `:blog-entry-card{slug=…}` components, and TOC `headings`) is computed
here, so the client never parses markdown. `src/generated/` is **gitignored**
and regenerated by every build (and by `pnpm dev`); the compile step runs
before type-check so a fresh clone builds without it.

The compiled HTML is styled by the **global** `src/assets/content.css` (prose,
boxes, foldable, cards, KaTeX) — scoped component styles cannot reach
`v-html`'d markup, so the content components' styles were moved there.

### Phase 2 — route prerendering

`vite build --ssr src/entry-server.ts` produces a `render(url)` entry used by
`scripts/prerender.mjs`, which:

1. enumerates every route — static pages, plus `/problem/{id}`,
   `/topics/{slug}`, `/tags/{slug}`, `/setters/{slug}` from `web/*.json`, and
   `/blog/{slug}` from the `src/content/*/*.md` filenames;
2. renders each to `dist/<route>/index.html` (and `dist/404.html` from the
   catch-all route) with the app HTML injected at `<!--app-html-->` and the
   `<title>` swapped.

### Phase 3 — llms.txt

`scripts/generate-llms.mjs` (the last step of `pnpm build`) writes
`dist/llms.txt` (a concise, LLM-readable index: catalog links, every problem,
topic, tag, setter, and blog entry) and `dist/llms-full.txt` (the complete
problem index with PDF links plus the full markdown of every blog article),
following the llmstxt.org convention. It derives everything from
`src/data/*.json` and `src/generated/content.json` — the same inputs the site
renders — so the index never drifts from the deployed pages.

### Client hydration

`src/entry-client.ts` creates a `createSSRApp` and mounts after
`router.isReady()`, hydrating the prerendered markup. Three invariants keep
hydration clean:

- **Locale** — i18n initializes deterministically to `en` (server and first
  client paint match); `applyDetectedLocale()` then applies the
  saved/browser locale in `onMounted`.
- **Scroll** — `scrollBehavior` starts every navigation at the top, except
  hash links (TOC heading anchors), which scroll to their target. This makes
  SPA navigations behave like full page loads.
- **Same-record reuse** — vue-router reuses component instances between
  `/blog/:slug` (etc.) routes, so `useEntry` and friends take
  `MaybeRefOrGetter` and re-read the prop inside their computeds.

### Assets

Compiled HTML cannot bake a fixed image URL — dev serves `/src/assets/…`
while production serves hashed `/assets/…-HASH.png`. `Pic` therefore emits a
`__QPD_ASSET__:<basename>` token, and `resolveAssetUrls()` in
`src/lib/content.ts` swaps it via an eager `?url` glob, which Vite resolves
per build mode. The glob also forces the client build to emit the files.

### Catalog & data

- **Compile-time injection** — `src/stores/catalog.ts` loads every
  `problem-*.json` via `import.meta.glob({ eager: true })`; metadata is
  bundled into the JS. No runtime metadata fetch.
- **PDFs** are copied to `public/data/` and fetched lazily at runtime.
- `scripts/sync.mjs` flattens `web/` into `src/data/` + `public/data/`.

### Routes

| Path | View |
|---|---|
| `/` | Index (hero, today's problem) |
| `/problem` | Problem catalog (search + status/topic/date filters) |
| `/problem/:id` | Problem (metadata table, modal PDF viewer, Twikoo comments, blog backlinks) |
| `/topics` / `/topics/:slug` | Topic catalog / topic's problems |
| `/tags` / `/tags/:slug` | Tag catalog / tag's problems |
| `/setters` / `/setters/:slug` | Setter catalog / setter's problems + contacts + blog entries |
| `/blog` / `/blog/:slug` | Blog entries / compiled entry (TOC, references, backlinks) |
| `/*` | 404 (proof-styled catch-all; route-level not-found states mirror it) |

The store exposes `query()` for filtering and slug-resolvers
(`topicFromSlug`, `tagFromSlug`, `setterFromSlug`) that reverse URL slugs back
to canonical names.

---

## File layout

```
QPD/
├── main.tex               # booklet entry point
├── YYYYMMDD.tex           # problems (one per file)
├── TEMPLATE.tex
├── QPDBooklet.cls
├── QPDSingle.cls
├── qpd-common.sty
├── qpd-bootstrap.tex
├── qpd-end.tex
├── export.sh / export_web.py
├── assets/                # YYYYMMDD-idx.ext
├── site/                  # Vue 3 static site (SSG)
│   ├── index.html             # entry template
│   ├── src/entry-client.ts    # hydration
│   ├── src/entry-server.ts    # SSR render(url)
│   ├── src/content/{en,zh}/   # blog entries (.md)
│   ├── src/generated/         # compiled content.json (gitignored)
│   ├── src/components/content/  # MDC components
│   └── scripts/{sync,compile-content,prerender,generate-llms}.mjs
├── README.md / EXTENDING.md / ARCHITECTURE.md
└── .github/workflows/deploy.yml
```

---

## Design decisions

| Decision | Rationale |
|---|---|
| ID is positional, metadata is KV | The ID is identity, not data; KV makes adding a field a one-line registry edit |
| `problem` renders on-the-spot, `solution` is collected | Avoids a full document model; answers always go at the back |
| `\meta` writes to `.aux` inline | Plain value at declaration time, sidestepping the `\csname`-in-`\write` trap |
| `\qpd@metaset` rehydrates and records TOC order | One `.aux` line does double duty |
| Date IDs (`YYYYMMDD`) | Lexicographic sort = chronological; doubles as the month key |
| Month grouping derived from ID | No author-maintained structure; months fall out of the data |
| `QPDSingle` defaults to answers, `QPDBooklet` to noanswers | Standalone = author review; booklet = distribution |
| `answersonly` mode | Lets the exporter render a standalone answer PDF |
| `open` withholds the answer at *export* time | The PDF is never generated, so it can't leak into the site |
| Incremental export via source hashes | Recompiling only changed problems; assets force via manual hash deletion |
| Compile-time `import.meta.glob` | Metadata is bundled; the site fetches nothing but PDFs |
| Tags are atomic, `topic` is the head tag | Enables faceted queries without synonym collisions |
| Markdown compiled at build time | The client never runs markdown-it/Shiki/KaTeX; compiled HTML rides in content.json (gitignored) |
| Per-route prerendering | Every route ships as real `dist/<route>/index.html`; crawlers and no-JS clients get full pages |
| Locale pinned to `en` during SSR, swapped on mount | Hydration parity (server and first client paint match), then localStorage/browser locale applies |
| `scrollBehavior` → top (hashes → element) | SPA navigations behave like full page loads; TOC anchors still work |
| Asset placeholder tokens + `?url` glob | Compiled HTML is build-mode-agnostic; Vite resolves dev/prod URLs per build |
| Reference metadata precomputed in content.json | Problem/blog backlinks are plain data lookups, no markdown parsing at runtime |
