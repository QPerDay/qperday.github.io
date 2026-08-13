import MarkdownIt from 'markdown-it'
import katex from 'katex'

// Render a markdown string to HTML, with KaTeX for $...$ (inline) and
// $$...$$ (display) math.  Raw HTML is disabled (safe); URLs are linkified.
//
// Usage:
//   const html = renderMarkdown(rawMarkdownText)
//
// This is the single rendering entry point for markdown content, so a future
// static blog reuses it directly.
export function renderMarkdown(src: string): string {
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false })

  // Math rendering: run KaTeX BEFORE markdown so that markdown-it never sees
  // (and mangles) the $ delimiters and their contents.  We protect math with
  // placeholder tokens, render markdown, then substitute the KaTeX HTML back.
  // The placeholder is a distinctive ASCII token — control characters (e.g.
  // NUL) get mangled to U+FFFD by HTML serialisation, so we avoid them.
  const tokens: string[] = []

  const stash = (html: string): string => {
    const id = tokens.length
    tokens.push(html)
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

  const html = md.render(src)

  // Restore the KaTeX HTML in place of the placeholder tokens.
  return html.replace(/QPDMATHPLACEHOLDER(\d+)END/g, (_m, i: string) => tokens[Number(i)]!)
}

// KaTeX stylesheet must be imported once for the rendered math to look right.
export { katex }
