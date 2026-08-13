# Extending QPD

This is the guide for adding new *metadata* to the system and surfacing it on
the site. It assumes you've read the metadata overview in `README.md`.

## The model in one paragraph

Every problem has an **ID** (`YYYYMMDD`) and a set of **key/value metadata
fields**. The ID is a positional argument to the `problem` environment; the
fields are declared with `\meta{key}{value}` lines at the top of the body.

The field data flows through five layers:

```
.tex source          qpd-common.sty          export_web.py         site
────────────────────────────────────────────────────────────────────────────
\meta{key}{value} ──▶ \qpd@meta@key@ID ──▶ meta.json ──▶ import.meta.glob ──▶ Pinia store ──▶ views
                     (in-memory)             (web/)     (compile-time)     (catalog.ts)
```

The **field registry** in `qpd-common.sty` is the single source of truth. Most
extensions are a handful of edits across these layers.

## Adding a data-only field (site-only, no booklet rendering)

This is the common case: a field that should appear in `meta.json` / the site,
but not in the printed booklet (e.g. a future `prereq`, `source`, `cas` tag).

### 1. Register it — `qpd-common.sty`

Append the key to `\qpd@metafields`:

```latex
\def\qpd@metafields{name,setter,score,status,topic,difficulty,tags,open,resources,prereq}
```

This makes it round-trip through the `.aux` file (and future serializers) with
no other LaTeX changes.

### 2. Export it — `export_web.py`

Add the key to `FIELDS`, and pick a JSON type in one of the coercion sets:

```python
FIELDS = [..., "prereq"]

LIST_FIELDS = {"setter", "tags", "resources"}   # -> list[str] (comma-separated in TeX)
INT_FIELDS   = {"difficulty"}                    # -> int | null
BOOL_FIELDS  = {"open"}                          # -> bool (true/1/yes/on/y)
# anything else -> str
```

For a `list[str]` field, add it to `LIST_FIELDS`; for an integer to
`INT_FIELDS`; for a boolean to `BOOL_FIELDS`; otherwise leave it (string).

### 3. Type it — `site/src/types.ts`

Add the field to `ProblemMeta`:

```ts
export interface ProblemMeta {
  // ...
  prereq: string[]
}
```

That's it. The store (`site/src/stores/catalog.ts`) already loads every field
from `meta.json` via `import.meta.glob`, so a newly-added field is available as
`problem.prereq` everywhere with no store changes.

## Adding a field that renders in the booklet

If the field should appear on the printed page, you also add a renderer and
call it from the `problem` environment.

`resources` is the worked example. It:

1. is registered in `\qpd@metafields`,
2. has a renderer `\qpd@renderresources{ID}` (in `qpd-common.sty`) that reads
   `\qpd@getmeta{ID}{resources}` and typesets a boxed "Resources:" line,
3. is called inside the `problem` environment's non-answer branch:

```latex
\qpd@renderresources{\qpd@currentid}%
```

`name`/`setter`/`score` are rendered by `\qpd@bighdr` (the header); `status`
by `\qpd@statusprefix`. Follow the same shape for a new field.

## Reading a field in LaTeX

```latex
\qpd@getmeta{ID}{field}     % -> value (empty if unset)
\qpd@getname{ID}            % sugar for \qpd@getmeta{ID}{name}
```

To check presence/emptiness (used in the renderers):

```latex
\ifcsname qpd@meta@field@ID\endcsname
  \expandafter\ifx\csname qpd@meta@field@ID\endcsname\@empty
    % empty
  \else
    % non-empty
  \fi
\fi
```

## Reading a field in the site

The catalog store exposes the whole array as `problems` and helpers:

```ts
import { useCatalog } from '@/stores/catalog'
const catalog = useCatalog()
catalog.problem(id)          // ProblemMeta | undefined
catalog.query({ topic: 'mechanics' })
catalog.problemsForSetter('Alice Liu')
```

A view reads `problem.prereq` directly. For example, a filter can be added to
`catalog.query` in the store (that's the single `query()` function in
`catalog.ts`).

## Type-coercion reference

| TeX value | JSON (via `export_web.py`) |
|---|---|
| in `LIST_FIELDS` | `"a, b"` → `["a", "b"]` (empty → `[]`) |
| in `INT_FIELDS` | `"5"` → `5`; unset/invalid → `null` |
| in `BOOL_FIELDS` | `"true"`/`"1"`/`"yes"`/`"on"`/`"y"` → `true`; otherwise `false` |
| otherwise | string, empty if unset |

## Files that participate

| File | Role |
|---|---|
| `qpd-common.sty` | `\qpd@metafields` registry, `\meta`, storage, renderers |
| `export_web.py` | `FIELDS` + coercion sets → `meta.json` / `toc.json` / PDFs |
| `site/src/types.ts` | `ProblemMeta` TypeScript interface |
| `site/src/stores/catalog.ts` | load, `query`, setter/topic getters |
| `site/src/views/*.vue` | consume the store |
