import MarkdownIt from 'markdown-it'
import MarkdownItMdc from 'markdown-it-mdc'
import { h } from 'vue'
import type { Component, VNode, VNodeChild } from 'vue'
import katex from 'katex'
import { createHighlighter } from 'shiki'
import type { Highlighter } from 'shiki'
import 'katex/dist/katex.min.css'

// --- Markdown-it instance --------------------------------------------------

// GFM extras (tables, strikethrough) are enabled so "all markdown syntax"
// renders; `html:false` keeps raw HTML out (safe).
const md = new MarkdownIt({ html: false, linkify: true })
  .enable(['table', 'strikethrough'])
  .use(MarkdownItMdc)

// Token type derived from the instance (avoids the `export =` namespace quirk
// in @types/markdown-it).
type Token = NonNullable<ReturnType<typeof md.parse>[number]>

// --- Component registry ----------------------------------------------------
//
// Only components placed under `src/components/content/` are injectable from
// markdown.  `import.meta.glob` with `eager` bundles them at build time; the
// default export of each `.vue` file is the component itself.
const contentComponents = import.meta.glob('../components/content/*.vue', {
  eager: true,
}) as Record<string, { default: Component }>

// Canonical key: lowercase, alphanumeric only.  So `ProblemBox`, `problem-box`
// and `problembox` all resolve to the same component.
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const registry = new Map<string, Component>()
for (const [path, mod] of Object.entries(contentComponents)) {
  const file = path.split('/').pop()!.replace(/\.vue$/, '')
  registry.set(normalizeName(file), mod.default)
}

function resolveComponent(name: string): Component | undefined {
  return registry.get(normalizeName(name))
}

// --- Shiki code highlighting ----------------------------------------------
//
// A single lazily-created highlighter is shared across renders.  Fenced code
// blocks are highlighted up-front (like math below) and parked in a per-render
// array, then re-injected when the fence token is materialised.
const SHIKI_LANGS = [
  'javascript', 'typescript', 'python', 'bash', 'shell', 'json', 'yaml',
  'html', 'css', 'vue', 'c', 'cpp', 'rust', 'go', 'java', 'latex', 'markdown',
  'sql', 'ruby', 'php', 'diff',
]

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  py: 'python', sh: 'bash', zsh: 'bash', shell: 'shell', yml: 'yaml',
  md: 'markdown', tex: 'latex', 'c++': 'cpp', cxx: 'cpp', cc: 'cpp',
  rb: 'ruby',
}

function normalizeLang(info: string | null): string {
  const raw = (info ?? '').trim().toLowerCase().split(/\s+/)[0] ?? ''
  if (!raw) return 'text'
  return LANG_ALIASES[raw] ?? raw
}

let highlighterPromise: Promise<Highlighter> | null = null
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light'],
      langs: SHIKI_LANGS,
    })
  }
  return highlighterPromise
}

let currentCodeHtml: (string | null)[] = []
const CODE_RE = /QPDCODEPLACEHOLDER(\d+)END/

// Replace each fence/code_block token's content with a placeholder and record
// the highlighted HTML (or null on failure, leaving content untouched).
async function highlightCodeBlocks(tokens: Token[]): Promise<void> {
  const hl = await getHighlighter()
  currentCodeHtml = []
  for (const t of tokens) {
    if (t.type !== 'fence' && t.type !== 'code_block') continue
    const lang = t.type === 'fence' ? normalizeLang(t.info) : 'text'
    let html: string | null = null
    try {
      html = hl.codeToHtml(t.content, { lang, theme: 'github-light' })
    } catch {
      html = null
    }
    if (html !== null) {
      const id = currentCodeHtml.length
      currentCodeHtml.push(html)
      t.content = `QPDCODEPLACEHOLDER${id}END`
    }
  }
}

function renderCodeBlock(t: Token): VNode {
  const m = CODE_RE.exec(t.content)
  if (m) {
    const html = currentCodeHtml[Number(m[1])]
    if (html) return h('div', { class: 'code-block', innerHTML: html })
  }
  return h('pre', [
    h('code', { class: t.info ? `language-${t.info}` : undefined }, t.content),
  ])
}

// --- Math stashing ---------------------------------------------------------
//
// KaTeX is rendered up-front (same pattern as the old markdown.ts) so that
// markdown-it never sees the `$` delimiters.  Rendered HTML is parked in a
// per-render array and re-injected when a `text` token is materialised.
type MathToken = { html: string }

let currentMath: MathToken[] = []

function stashMath(src: string): string {
  currentMath = []
  const stash = (html: string) => {
    const id = currentMath.length
    currentMath.push({ html })
    return `QPDMATHPLACEHOLDER${id}END`
  }
  // Display math $$...$$ first (so its $$ don't clash with inline $).
  src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex: string) =>
    stash(katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false })),
  )
  // Inline math $...$ (single-dollar; skips $$ which are already stashed).
  src = src.replace(/\$([^\n$]+?)\$/g, (_m, tex: string) =>
    stash(katex.renderToString(tex.trim(), { throwOnError: false })),
  )
  return src
}

const MATH_RE = /QPDMATHPLACEHOLDER(\d+)END/g

// Split a text token's content into plain strings and math VNodes.
function renderText(content: string): VNodeChild[] {
  if (!content) return []
  const out: VNodeChild[] = []
  let last = 0
  let m: RegExpExecArray | null
  MATH_RE.lastIndex = 0
  while ((m = MATH_RE.exec(content))) {
    if (m.index > last) out.push(content.slice(last, m.index))
    const math = currentMath[Number(m[1])]
    if (math) out.push(h('span', { innerHTML: math.html }))
    last = m.index + m[0].length
  }
  if (last < content.length) out.push(content.slice(last))
  return out.length ? out : [content]
}

// --- Prop / attr helpers ---------------------------------------------------

function attrsToProps(attrs: Array<[string, string]> | null): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  if (!attrs) return props
  for (const [key, value] of attrs) {
    if (key === 'class') props.class = value
    else props[key] = value
  }
  return props
}

function slotNameOf(token: Token): string {
  const attr = token.attrs?.find(([key]) => key.startsWith('#'))
  return attr ? attr[0].slice(1) : 'default'
}

// Table cells carry alignment as an inline `style` (e.g. text-align:right).
function cellProps(token: Token): Record<string, unknown> {
  const style = token.attrGet('style')
  return style ? { style } : {}
}

// --- MDC component rendering ----------------------------------------------

function renderSelfClosing(token: Token): VNodeChild {
  const comp = resolveComponent(token.tag)
  if (!comp) return null
  return h(comp, attrsToProps(token.attrs))
}

// A block component: consumes children until its closing token, splitting
// `#slot` blocks into named slots and everything else into the default slot.
function renderMdcBlock(open: Token, tokens: Token[], idx: { i: number }): VNode {
  const comp = resolveComponent(open.tag)
  const props = attrsToProps(open.attrs)
  const defaultChildren: VNodeChild[] = []
  const namedSlots: Record<string, () => VNodeChild[]> = {}

  while (idx.i < tokens.length) {
    const t = tokens[idx.i]!
    if (t.hidden) {
      idx.i++
      continue
    }
    if (t.nesting === -1 && (t.type === 'mdc_block_close' || t.type === 'mdc_block_shorthand')) {
      idx.i++
      break
    }
    if (t.type === 'mdc_block_slot' && t.nesting === 1) {
      const name = slotNameOf(t)
      idx.i++ // past the slot open
      const children = renderBlockLevel(tokens, idx)
      namedSlots[name] = () => children
      continue
    }
    defaultChildren.push(...renderOne(tokens, idx))
  }

  if (!comp) {
    // Unregistered component: unwrap the default slot content.
    if (defaultChildren.length === 1) return defaultChildren[0] as VNode
    return h('div', {}, defaultChildren)
  }

  const slots: Record<string, () => VNodeChild[]> = { default: () => defaultChildren }
  for (const [name, render] of Object.entries(namedSlots)) slots[name] = render
  return h(comp, props, slots)
}

function renderInlineMdc(open: Token, children: VNodeChild[]): VNodeChild {
  const comp = resolveComponent(open.tag)
  const props = attrsToProps(open.attrs)
  if (!comp) return h('span', {}, children)
  return h(comp, props, { default: () => children })
}

// --- Token walkers ---------------------------------------------------------

// Render a single block-level token (advancing `idx` past it and its subtree).
function renderOne(tokens: Token[], idx: { i: number }): VNodeChild[] {
  const t = tokens[idx.i]!
  if (t.hidden) {
    idx.i++
    return []
  }
  idx.i++

  switch (t.type) {
    case 'inline':
      return renderInlineLevel(t.children ?? [], { i: 0 })
    case 'fence':
    case 'code_block':
      return [renderCodeBlock(t)]
    case 'hr':
      return [h('hr')]
    case 'heading_open':
      return [h(t.tag, {}, renderBlockLevel(tokens, idx))]
    case 'paragraph_open':
      return [h('p', {}, renderBlockLevel(tokens, idx))]
    case 'bullet_list_open':
      return [h('ul', {}, renderBlockLevel(tokens, idx))]
    case 'ordered_list_open':
      return [
        h(
          'ol',
          { start: t.attrGet('start') ? Number(t.attrGet('start')) : undefined },
          renderBlockLevel(tokens, idx),
        ),
      ]
    case 'list_item_open':
      return [h('li', {}, renderBlockLevel(tokens, idx))]
    case 'blockquote_open':
      return [h('blockquote', {}, renderBlockLevel(tokens, idx))]
    case 'table_open':
      return [h('table', {}, renderBlockLevel(tokens, idx))]
    case 'thead_open':
      return [h('thead', {}, renderBlockLevel(tokens, idx))]
    case 'tbody_open':
      return [h('tbody', {}, renderBlockLevel(tokens, idx))]
    case 'tr_open':
      return [h('tr', {}, renderBlockLevel(tokens, idx))]
    case 'th_open':
      return [h('th', cellProps(t), renderBlockLevel(tokens, idx))]
    case 'td_open':
      return [h('td', cellProps(t), renderBlockLevel(tokens, idx))]
    case 'mdc_block_shorthand':
      return t.nesting === 0 ? [renderSelfClosing(t)] : [renderMdcBlock(t, tokens, idx)]
    case 'mdc_block_open':
      return [renderMdcBlock(t, tokens, idx)]
    case 'mdc_block_slot':
      // A slot at the top level (shouldn't happen): render its content inline.
      return renderBlockLevel(tokens, idx)
    default:
      // Unknown block token — best effort: render any inline children.
      return t.children ? renderInlineLevel(t.children, { i: 0 }) : []
  }
}

// Render block tokens until the next closing token (`nesting === -1`), which
// is consumed.  Used to collect the children of an open block.
function renderBlockLevel(tokens: Token[], idx: { i: number }): VNodeChild[] {
  const out: VNodeChild[] = []
  while (idx.i < tokens.length) {
    const t = tokens[idx.i]!
    if (t.hidden) {
      idx.i++
      continue
    }
    if (t.nesting === -1) {
      idx.i++
      break
    }
    out.push(...renderOne(tokens, idx))
  }
  return out
}

// Render an inline token list (already-parsed `token.children`).
function renderInlineLevel(children: Token[], idx: { i: number }): VNodeChild[] {
  const out: VNodeChild[] = []
  while (idx.i < children.length) {
    const t = children[idx.i]!
    if (t.nesting === -1) {
      idx.i++
      break
    }
    idx.i++

    switch (t.type) {
      case 'text':
        out.push(...renderText(t.content))
        break
      case 'code_inline':
        out.push(h('code', t.content))
        break
      case 'softbreak':
        out.push('\n')
        break
      case 'hardbreak':
        out.push(h('br'))
        break
      case 'image':
        out.push(
          h('img', {
            src: t.attrGet('src') ?? '',
            alt: t.content,
            title: t.attrGet('title') ?? undefined,
          }),
        )
        break
      case 'strong_open':
        out.push(h('strong', {}, renderInlineLevel(children, idx)))
        break
      case 'em_open':
        out.push(h('em', {}, renderInlineLevel(children, idx)))
        break
      case 's_open':
        out.push(h('s', {}, renderInlineLevel(children, idx)))
        break
      case 'link_open': {
        const href = t.attrGet('href') ?? ''
        const external = /^https?:\/\//.test(href)
        out.push(
          h(
            'a',
            {
              href,
              title: t.attrGet('title') ?? undefined,
              ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
            },
            renderInlineLevel(children, idx),
          ),
        )
        break
      }
      case 'mdc_inline_component':
        if (t.nesting === 0) out.push(renderSelfClosing(t))
        else out.push(renderInlineMdc(t, renderInlineLevel(children, idx)))
        break
      case 'mdc_inline_span':
        // `[text]{.class}` — render the content as a span.  The trailing
        // `mdc_inline_props` (class list) is not yet applied, but the text
        // itself is preserved.
        out.push(h('span', {}, renderInlineLevel(children, idx)))
        break
      default:
        break
    }
  }
  return out
}

// --- Public entry ----------------------------------------------------------

// Render a markdown/MDC source string to a tree of Vue VNodes.  Async because
// Shiki code highlighting must await the shared highlighter.
export async function renderMarkdownToVNodes(source: string): Promise<VNodeChild[]> {
  const stashed = stashMath(source)
  const tokens = md.parse(stashed, {})
  await highlightCodeBlocks(tokens)
  const idx = { i: 0 }
  const nodes = renderBlockLevel(tokens, idx)
  currentMath = []
  currentCodeHtml = []
  return nodes
}
