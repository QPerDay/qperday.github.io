---
name: make-problem
description: Process a problem source file into a QPD .tex file under the project root.
---

Process a problem source file into a QPD `.tex` file under the project root.

## When to use

- The user asks to create / scaffold / translate a problem
- The user runs `/make-problem <source-file>`
- The user says "process this into a problem file"

## Project context

- Root: `/Users/makabaka1880/scratch/fitch/QPD/`
- Output: `YYYYMMDD.tex` at project root
- Assets: `assets/YYYYMMDD-idx.ext`
- Boilerplate: `qpd-bootstrap.tex` (top), `qpd-end.tex` (bottom)
- Math macros available: everything in `qpd-common.sty` — `\RR`, `\NN`, `\dd{x}`, `\abs`, `\norm`, `\inner`, `\parens`, `\bracks`, `\pd`, `\arr`, `\eps`, `\ph`, `\lam`, etc.
- TikZ is preloaded (`decorations.pathmorphing` library included)
- Chinese is supported via **XeLaTeX** (CJK loads automatically under XeTeX). Compile Chinese problems with `xelatex`, not `pdflatex`.

## Problem-setting conventions

Follow these uniformly in every `.tex` file.

- **Boilerplate** — `\input qpd-bootstrap` at the very top, `\input qpd-end` at the very bottom.
- **Problem header** — `\begin{problem}{YYYYMMDD}` (ID is the only positional argument).
- **Metadata** — declared inside the problem with `\meta{key}{value}` lines, **at the top of the body before any prose**. Known keys: `name`, `setter`, `score`, `status`, `topic`, `difficulty`, `tags`, `open`, `resources`. Any key may be omitted; `status=err` renders an `[ERR]` prefix; `open=true` withholds the answer from the web site (default `false`); `resources` is a comma-separated list of allowed resources, rendered as a "Resources" box by the problem environment (never write `\resources{...}` yourself). All prose is en-US (Chinese may appear only inside names). Unknown keys are allowed and serialise fine (add them to `\qpd@metafields` in `qpd-common.sty` to include them in future serialisers).
- **Questions** — number them **Q1, Q2, Q3, …** (the `questions` environment auto-labels them). Each `\item` starts with a bold title ending in a period: `\item \textbf{Title.}`.
- **Sub-parts** — within a question, use `\begin{enumerate}[label=\arabic*.]` so sub-parts read 1., 2., 3.
- **Solution** — `\begin{solution}{YYYYMMDD}`, then one `\subsection*{Qn. Problem Name}` per question, matching the question's number and title exactly (e.g. `\subsection*{Q1. Toss Constraint}`).
- **Units** — upright, via `\mathrm{kg}`, `\mathrm{m}`, `\mathrm{s}`, `\mathrm{N}`, `\mathrm{N\,m^{2}\,kg^{-2}}`, etc.
- **Final answers** — wrap the boxed result in `\boxed{...}`.
- **Cross-references** — in prose refer to questions as `Q1`, `Q2`, … (no parentheses, no lowercase `(a)`/`(b)`).
- **Assumptions** — `\begin{assumptions}` with one `\item` per numbered assumption; `\begin{assumption}` for a single inline one.
- **Vectors & magnitudes** — `\arr{v}` for vectors, `\abs{x}` for magnitude, `\norm{x}` for norm, `\inner{a}{b}` for inner product.
- **Prose style** — two spaces after a sentence-ending period; em-dash as `---`; `Dr.\ Wen` with a backslash-space after the abbreviation.

## Procedure

### 1. Read the source

The source is a plain text file with labeled fields. Supported fields:

```
ID: 20260901            (required — YYYYMMDD)
Name: Problem Title     (required)
Setter: Name            (optional)
Score: N                (optional)
Problem:                (required — multiline)
Assumptions:            (optional — bullet points)
Questions:              (optional — Q1, Q2, Q3...)
Resources:              (optional)
Solution:               (required — multiline)
Assumption:             (optional — singular, inside solution)
Answer:                 (optional — inside solution)
```

### 2. Ask about anything missing or ambiguous

Before writing any file, check:

| What | Action if missing |
|---|---|
| ID | Ask the user |
| Name | Ask the user |
| Setter | Can be empty `[]` — confirm with user |
| Score | Can be empty `[]` — confirm with user |
| Problem body | Ask the user — can't proceed without it |
| Solution body | Ask the user, or offer to leave a `To be completed` placeholder |
| Image references | Check that referenced files exist under `assets/`. If not, ask. |

### 3. Resolve the filename

The output filename is `ID.tex` where ID is `YYYYMMDD`. If the ID differs from any date mentioned in the source, flag the discrepancy.

### 4. Write the .tex file

Follow this structure exactly. Adapt the body based on what fields are present:

```latex
\input qpd-bootstrap

\begin{problem}{ID}
  \meta{name}{Problem Name}
  \meta{setter}{Setter}       % omit to leave blank
  \meta{score}{N}             % omit to leave blank
  \meta{status}{err}          % omit unless the problem is known-broken

  Problem body text.  Keep the prose in paragraph form.

  % Only if assumptions are provided as a list:
  \begin{assumptions}
    \item First assumption.
    \item Second assumption.
  \end{assumptions}

  % Only if a single assumption is provided:
  \begin{assumption}
    Assumption text.
  \end{assumption}

  % Only if resources are specified:
  \resources{Resource text.}

  % Only if questions are provided:
  \begin{questions}
    \item First question part.
    \item Second question part.
  \end{questions}
\end{problem}

\begin{solution}{ID}
  % One subsection per question, matching its number and title:
  \subsection*{Q1. First question title}
  Solution text for Q1.

  \subsection*{Q2. Second question title}
  Solution text for Q2.

  % Only if a question has a concise final answer:
  \begin{answer}
    The final answer.
  \end{answer}
\end{solution}

\input qpd-end
```

**Important formatting rules:**
- Preserve ALL LaTeX math verbatim — `$...$`, `\[...\]`, `$$...$$`, `\begin{align}...\end{align}`, etc.
- `\begin{assumptions}` expects `\item` entries (enumerated list). For a single assumption, use `\begin{assumption} ... \end{assumption}` (inline paragraph).
- Images use `\includegraphics{assets/YYYYMMDD-idx.ext}` — match the capitalisation exactly. If captions are needed, add `\captionof{figure}{...}` inside a `minipage` or `figure` environment.
- TikZ pictures go inline. The `decorations.pathmorphing` library is already loaded.

### 5. Validate

Compile with `xelatex` (Chinese problems require it; English-only problems also compile under `pdflatex`):
```bash
xelatex -interaction=nonstopmode -halt-on-error YYYYMMDD.tex
```

If it fails, read the `.log` file, find the error, fix it, retry. Do not leave a broken file. If the fix is unclear, report the error to the user and ask.

### 6. Register in the booklet

Append `\input{YYYYMMDD}` to `main.tex` (before `\end{document}`) **only** if the user hasn't explicitly said not to, and only if the line isn't already there.
