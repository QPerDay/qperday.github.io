# QPD — Question Per Day

A LaTeX toolchain for authoring, typesetting, and publishing a shared problem
set. Each problem is a single compilable `.tex` file; the same source renders
as a standalone PDF, joins a monthly-grouped booklet, or feeds a Vue static
site. Built by the QPD problem-setting group (SSBS '28).

## Getting started

This is everything you need to build the project from a fresh clone.

### Prerequisites

- **TeX** with **XeLaTeX** (TeX Live 2022+ or MacTeX). XeLaTeX is required for
  Chinese problems; English-only problems also work with pdfLaTeX.
- The LaTeX packages used by `qpd-common.sty` — all in a standard full TeX
  Live install: `etoolbox`, `amsmath`, `amssymb`, `mathtools`, `enumitem`,
  `environ`, `graphicx`, `xcolor`, `tikz`/`pgf` (+ `pgfcalendar`), `cancel`,
  `caption`, `geometry`, `hyperref`, `trimspaces`, `iftex`, `xeCJK`,
  `fontspec`.
- A **CJK font** for Chinese problems — `Songti SC` on macOS (used
  automatically), or `Noto Serif CJK SC` on Linux.
- **Node ≥ 22.18** (or ≥ 24) and **pnpm** for the web site.

### Build the booklet

```bash
xelatex main.tex
xelatex main.tex    # second pass resolves the TOC / cross-refs
# → main.pdf
```

### Build a single problem

```bash
xelatex 20260803.tex    # → 20260803.pdf (statement + answer)
```

Each `YYYYMMDD.tex` file compiles on its own — it detects whether it's
standalone or being `\input` into the booklet.

### Build the web site

```bash
./export.sh --web          # compile every problem into web/ (JSON + PDFs)
cd site
pnpm install
pnpm sync                  # copy web/ into src/data/ and public/data/
pnpm dev                   # local dev server
pnpm build                 # production build → site/dist/ (static site)
```

`./export.sh --web` is incremental — it skips problems whose source hasn't
changed since the last run. To force a recompile (e.g. after editing an
image), delete that problem's line from `.qpd-web-hashes.json`.

The `web/` directory is **committed to git**. CI consumes the committed export
rather than recompiling the TeX, so it never needs a TeX installation.

`pnpm build` is a real static-site build (not a SPA bundle):

1. `node scripts/compile-content.mjs` — **compiles every blog Markdown file to
   HTML at build time** (markdown-it + MDC + Shiki + KaTeX) into
   `src/generated/content.json`, including reference metadata (referenced
   problem IDs, referenced blog slugs, headings). The client never runs
   markdown-it/Shiki/KaTeX at runtime,
2. `type-check` (vue-tsc),
3. `vite build` (client) + `vite build --ssr` (server entry),
4. `node scripts/prerender.mjs` — renders **one `dist/<route>/index.html` per
   route** plus a real `dist/404.html`, via Vue SSR.
5. `node scripts/generate-llms.mjs` — emits **`dist/llms.txt`** and
   **`dist/llms-full.txt`** (an LLM-readable index + full content) from the
   same metadata the site renders, so they stay in sync with the pages.

`src/generated/` is **gitignored** — it is a pure build artifact, regenerated
from scratch by every `pnpm build` (and by `pnpm dev`, so Markdown edits are
picked up in dev). Because the compile step runs before type-check, a fresh
clone builds with no committed copy of it.

### Continuous integration (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` deploys the site to GitHub Pages
on every push to `main`.

What it does (and doesn't do):

- **Does not install TeX** or recompile the problems. It consumes the
  `web/` export that is committed to the repo.
- Runs `pnpm sync` (flatten `web/` → `site/src/data/` + `site/public/data/`),
  `pnpm install --frozen-lockfile`, and `pnpm build`.
- The build prerenders every route (`/problem/20260803`, `/blog/…`, …) to its
  own `index.html` and emits a real `404.html`, so deep links and search
  crawlers get fully rendered pages with no JS.
- Uploads the built `site/dist/` and deploys it with GitHub's official Pages
  actions (no PAT needed).

To enable it: **Settings → Pages → Source: GitHub Actions**, then push to
`main`. Because CI relies on the committed `web/`, remember to re-run
`./export.sh --web` and commit the changes whenever a problem's PDF changes.

### Writing blog entries

Blog entries live in `site/src/content/{en,zh}/*.md`, with YAML frontmatter
(`title`, `description`, `date`, `author`) followed by an MDC body. They are
compiled to static HTML at build time (see above), with full support for
LaTeX math (`$…$`, `$$…$$`), fenced code highlighting (Shiki), and custom MDC
components — see `site/src/components/content/*.vue` (`problem-box`,
`answer-box`, `warning-box`, `info-box`, `error-box`, `theorem-box`,
`foldable`, `pic`, `desmos`, `problem-card`, `blog-entry-card`).

Cross-referencing is automatic: `:problem-card{id="20260727"}` links to a
problem, `:blog-entry-card{slug="0412-jacobian-guide"}` links to another
entry, and the site shows the backlinks in both directions (an entry's header
lists its referenced problems and the entries referencing it; each problem
page lists the entries referencing it).

## Architecture
> This is just tech details. Skip this if you are not interested in how the plumbing works.

I wrote a custom `documentclass` called `QPDBooklet`. Every problem gets a date as its ID — since this is *Question Per Day*, that keeps things simple.

The idea: write each problem in its own file, then `\input` them all into `main.tex`. Each problem file is also compilable by itself (no command-line flags — just hit "compile"), so you can preview your work without building the whole booklet.

The class files are **generic** — they don't know about this specific problem set. The cover artwork is supplied by `main.tex` via `\coverimage{assets/cover.png}`, not baked into the class. If you're writing your own problem set, just don't pass `\coverimage` (or point it at your own image) and the tooling stays reusable.

There are four files doing the heavy lifting:

| File | What it does |
|---|---|
| `QPDBooklet.cls` | The booklet class — title page, problem list, answer section |
| `QPDSingle.cls` | Stripped-down class for compiling a single problem |
| `qpd-common.sty` | Shared package — all the environments, math macros, plumbing |
| `qpd-bootstrap.tex` / `qpd-end.tex` | Two tiny files that auto-detect "am I standalone or inside the booklet?" |

The `solution` environment never prints where you write it — it gets captured, stored, and dumped at the end of the booklet as an answer section. That way you can distribute the booklet without answers (default) or with them (`\documentclass[answers]{QPDBooklet}`).

Chinese problems are supported out of the box. Compile them with **XeLaTeX** (`xelatex`) — CJK typesetting loads automatically when the engine is XeTeX, using the macOS `Songti SC` font. English-only problems still compile under plain `pdflatex`.

## How do I add another problem?

> **DO NOT TOUCH `main.tex` except to add one `\input` line.** Everything else is covered by the template.

1. Create a new file named `YYYYMMDD.tex` at the root of the repository. For example, create `20260901.tex` for September 1, 2026.
2. Copy everything from `TEMPLATE.tex` into the new file.
3. Add this to `main.tex`:

```tex
\input{YYYYMMDD.tex}
```

For example:

```tex
\input{20260901.tex}
```

That's it. Compile `main.tex` twice and your problem appears in the booklet.

## TEMPLATE.tex explained

Your new file will look like this:

```tex
\input qpd-bootstrap          % ← boilerplate, don't touch

\begin{problem}{YYYYMMDD}
  \meta{name}{Problem Name}   % required-ish
  \meta{setter}{Your Name}    % optional
  \meta{score}{N}             % optional
  \meta{status}{err}          % optional — err marks a known-broken problem
  \meta{topic}{mechanics}     % optional — most significant tag
  \meta{difficulty}{4}        % optional — integer 1–5
  \meta{tags}{mechanics,optics,waves}   % optional — atomic tags
  \meta{resources}{CAS}       % optional — allowed resources (comma-sep)

  % Problem statement here.

  \begin{assumptions}         % optional — bullet-point assumptions
    \item ...
  \end{assumptions}

  \begin{questions}           % optional — Q1, Q2, Q3 question parts
    \item ...
  \end{questions}
\end{problem}

\begin{solution}{YYYYMMDD}    % same ID as the problem
  % Solution goes here, one \subsection*{Qn. Title} per question.

  \begin{answer}              % optional — the concise final answer
    ...
  \end{answer}
\end{solution}

\input qpd-end                % ← boilerplate, don't touch
```

A few things to keep in mind:

- **The ID (`YYYYMMDD`) must match your filename** and the `\input` line in `main.tex`.
- **Metadata is key-value** — `\meta{key}{value}` lines at the top of the problem body. Only `name` is effectively required; everything else is optional and omitted if absent. `status=err` puts an `[ERR]` tag on the problem; `open=true` withholds the answer from the web site (default `false`); `resources` is a comma-separated list (empty = no restriction).
- **One `solution` per problem.** The template will yell at you (friendly error) if you forget.
- **`\begin{assumptions}` for lists, `\begin{assumption}` for a single one.** Both work. Same idea — `assumptions` gives you a boxed numbered list; `assumption` is just an inline paragraph.

## Problem-setting conventions

Follow these uniformly across every problem file. They keep the booklet looking consistent and make cross-referencing unambiguous.

- **Boilerplate** — `\input qpd-bootstrap` at the very top, `\input qpd-end` at the very bottom.
- **Problem header** — `\begin{problem}{YYYYMMDD}` (ID is the only positional argument).
- **Metadata** — `\meta{key}{value}` lines at the top of the problem body. Keys: `name`, `setter`, `score`, `status`, `topic`, `difficulty`, `tags`, `open`, `resources`. All optional except `name`; `status=err` renders an `[ERR]` tag; `open=true` withholds the answer from the web site; `resources` is a comma-separated list of allowed resources, rendered by the problem environment. All prose is en-US (Chinese only inside names).
- **Questions** — number them **Q1, Q2, Q3, …** (the `questions` environment auto-labels them). Each `\item` starts with a bold title ending in a period: `\item \textbf{Title.}`.
- **Sub-parts** — within a question, use `\begin{enumerate}[label=\arabic*.]` so sub-parts read 1., 2., 3.
- **Solution** — `\begin{solution}{YYYYMMDD}`, then one `\subsection*{Qn. Problem Name}` per question, matching the number and title exactly (e.g. `\subsection*{Q1. Toss Constraint}`).
- **Units** — upright, via `\mathrm{kg}`, `\mathrm{m}`, `\mathrm{s}`, `\mathrm{N}`, `\mathrm{N\,m^{2}\,kg^{-2}}`, etc.
- **Final answers** — wrap the boxed result in `\boxed{...}`.
- **Cross-references** — in prose refer to questions as `Q1`, `Q2`, … (no parentheses, no lowercase `(a)`/`(b)`).
- **Assumptions** — `\begin{assumptions}` with one `\item` per numbered assumption; `\begin{assumption}` for a single inline one.
- **Vectors & magnitudes** — `\arr{v}` for vectors, `\abs{x}` for magnitude, `\norm{x}` for norm, `\inner{a}{b}` for inner product.
- **Prose style** — two spaces after a sentence-ending period; em-dash as `---`; `Dr.\ Wen` with a backslash-space after the abbreviation.

## Tag vocabulary

`tags` is a controlled, flat vocabulary of atomic concepts. Use only the
canonical spelling below — pick the most general form and avoid synonyms
(`rotation`, not "rotational dynamics"; `energy`, not "work-energy" or
"potential energy"). A problem lists every tag that applies, comma-separated,
in the `\meta{tags}{...}` line; `topic` is simply the most significant one of
those tags.

- centripetal force
- circular motion
- collisions
- control theory
- differential equations
- dynamics
- electromagnetism
- electrostatics
- energy
- feedback
- fluid mechanics
- friction
- gravitation
- inclined plane
- ionic bonding
- kinematics
- Kepler
- Lorentz force
- magnetic field
- mechanics
- momentum
- Newton's laws
- optics
- orbital motion
- oscillations
- pendulum
- photography
- projectile motion
- rigid body
- rolling
- rolling shutter
- rotation
- springs
- variable mass
- viscosity

## Assets

If you want to use external resources (images, graphs, whatever), name them like this:

```
YYYYMMDD-idx.ext
```

For example, if your problem for 2026/9/1 has two images:

```
20260901-1.png
20260901-2.jpg
```

Put them under `/assets`. Reference them in your `.tex` file with `\includegraphics{assets/20260901-1.png}`.

## How do I compile my problem?

Open **Settings > Compiler > Main Document** and select your problem file. For example, choose `20260901.tex`.

Set the compiler to **XeLaTeX** for Chinese problems (English-only problems also work with pdfLaTeX).

**Remember to set it back to `main.tex` afterwards!**

> **Note for Overleaf users:** you'll need to compile **twice** when building `main.tex`. The first pass scans all problems and writes metadata; the second pass builds the table of contents and answer section. This is normal — LaTeX does this for cross-references too.

## Exporting

Two export scripts bundle the project for different targets.

**`./export.sh`** — copies the LaTeX sources, infrastructure, and assets into `export/` (for syncing the whole source tree to texpage).

**`./export.sh --web`** — builds a web bundle into `web/`:

```
web/
├── toc.json                    # list of every problem's metadata
└── YYYYMMDD/
    ├── meta.json               # this problem's metadata
    ├── statement.pdf           # statement only, no answer
    └── answer.pdf              # answer only, no statement
```

The JSON is read straight from each problem's `\meta{...}` declarations, so it always matches the source. The two PDFs come from compiling the problem standalone in two modes (`statement` and `answersonly`).

## Math macros available

These are built into the template. You can use them without loading any packages.

Each row shows the macro **call**, its **expansion** (what it becomes in the
source), and how it **renders**.

### Vectors & blackboard bold

| Call | Expands to | Renders |
|---|---|---|
| `\arr{v}` | `\vec{\mathbf{v}}` | $\vec{\mathbf{v}}$ |
| `\RR` | `\mathbb{R}` | $\mathbb{R}$ |
| `\CC` | `\mathbb{C}` | $\mathbb{C}$ |
| `\NN` | `\mathbb{N}` | $\mathbb{N}$ |
| `\ZZ` | `\mathbb{Z}` | $\mathbb{Z}$ |
| `\QQ` | `\mathbb{Q}` | $\mathbb{Q}$ |

### Differentials

| Call | Expands to | Renders |
|---|---|---|
| `\dd{x}` | `\mathop{}\!\mathrm{d}x` | $\mathrm{d}x$ |
| `\dx` | `\dd{x}` | $\mathrm{d}x$ |
| `\dy` | `\dd{y}` | $\mathrm{d}y$ |
| `\dz` | `\dd{z}` | $\mathrm{d}z$ |
| `\dt` | `\dd{t}` | $\mathrm{d}t$ |
| `\dr` | `\dd{r}` | $\mathrm{d}r$ |
| `\ds` | `\dd{s}` | $\mathrm{d}s$ |
| `\du` | `\dd{u}` | $\mathrm{d}u$ |
| `\dv` | `\dd{v}` | $\mathrm{d}v$ |
| `\dtheta` | `\dd{\theta}` | $\mathrm{d}\theta$ |

### Derivatives

| Call | Expands to | Renders |
|---|---|---|
| `\pd{f}{x}` | `\frac{\partial f}{\partial x}` | $\frac{\partial f}{\partial x}$ |

### Delimiters

| Call | Expands to | Renders |
|---|---|---|
| `\abs{x}` | `\left\lvert x \right\rvert` | $\left\lvert x \right\rvert$ |
| `\norm{x}` | `\left\lVert x \right\rVert` | $\left\lVert x \right\rVert$ |
| `\inner{a}{b}` | `\left\langle a ,\, b \right\rangle` | $\left\langle a ,\, b \right\rangle$ |
| `\parens{x}` | `\left( x \right)` | $\left( x \right)$ |
| `\bracks{x}` | `\left[ x \right]` | $\left[ x \right]$ |
| `\braces{x}` | `\left\{ x \right\}` | $\left\{ x \right\}$ |

### Operators

| Call | Expands to | Renders |
|---|---|---|
| `\dom` | `\operatorname{dom}` | $\operatorname{dom}$ |
| `\ran` | `\operatorname{ran}` | $\operatorname{ran}$ |
| `\sgn` | `\operatorname{sgn}` | $\operatorname{sgn}$ |
| `\im` | `\operatorname{im}` | $\operatorname{im}$ |

### Greek shorthands

| Call | Expands to | Renders |
|---|---|---|
| `\eps` | `\varepsilon` | $\varepsilon$ |
| `\ph` | `\varphi` | $\varphi$ |
| `\lam` | `\lambda` | $\lambda$ |

## Project structure

```
QPD/
├── main.tex               # booklet entry point (\input each problem)
├── YYYYMMDD.tex           # one problem per file (statement + solution)
├── TEMPLATE.tex           # copy-paste starter for a new problem
├── QPDBooklet.cls         # booklet document class
├── QPDSingle.cls          # standalone single-problem class
├── qpd-common.sty         # environments, math macros, metadata plumbing
├── qpd-bootstrap.tex      # standalone/import detection (top of every problem)
├── qpd-end.tex            # ... and the matching end
├── export.sh              # bundle sources -> export/ (or --web -> web/)
├── export_web.py          # incremental web exporter (JSON + PDFs)
├── assets/                # images named YYYYMMDD-idx.ext
├── site/                  # Vue 3 + Vite static site (SSG)
│   ├── index.html             # Vite entry template (prerender injects HTML)
│   ├── src/
│   │   ├── entry-client.ts    # hydrates the prerendered HTML
│   │   ├── entry-server.ts    # SSR render(url), used by prerender
│   │   ├── content/{en,zh}/   # blog entries (Markdown + MDC frontmatter)
│   │   ├── generated/         # compiled content.json (gitignored, build-only)
│   │   ├── components/content/  # MDC components (boxes, cards, foldable, …)
│   │   ├── stores/catalog.ts  # compile-time metadata injection + querying
│   │   ├── views/             # index / problems / topics / tags / setters / blog
│   │   └── lib/               # content, frontmatter, mdc (build-only), …
│   └── scripts/
│       ├── sync.mjs           # copy web/ into src/data/ + public/data/
│       ├── compile-content.mjs  # Markdown → HTML at build time
│       └── prerender.mjs      # one dist/<route>/index.html per route
├── EXTENDING.md           # how to add a metadata field end-to-end
└── ARCHITECTURE.md        # original design notes
```

## Contributing

You are welcome to contribute to the **infrastructure** (the tooling, classes,
exporters, and the site) and to **report issues or point out errors** in the
problem set.

We do **not** accept problem submissions — the problem set is authored and
curated by the QPD problem-setting group. Please don't open PRs that add or
rewrite problems.

For infrastructure work, see `EXTENDING.md` for the metadata pipeline and
`.claude/skills/make-problem.md` for the authoring conventions. Tag vocabulary
is intentionally a controlled set of atomic concepts — avoid synonyms
(`rotation`, not "rotational dynamics"); `topic` is just the most significant
tag.

## License

- **Code & tooling** (`*.cls`, `*.sty`, `*.tex` boilerplate, `export*.{sh,py}`, `site/`) — **MIT** (`LICENSE`).
- **Problem content** (`YYYYMMDD.tex` files and derived statements/solutions) — **CC BY 4.0** (`LICENSE-CONTENT`).

You are free to share and adapt the problems (even commercially) with
attribution. If you reuse or adapt a problem, credit the individual setter(s)
and the group:

> Problem by &lt;Setter&gt;, QPD problem-setting group (SSBS '28).

As a courtesy — not a legal requirement — we'd be glad to hear from you if you
reuse a problem.
