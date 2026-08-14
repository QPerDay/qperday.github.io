// Build-only compiler entry.  scripts/compile-content.mjs bundles this file
// with `vite build --ssr` (production mode, so `?url` asset imports resolve to
// their final hashed URLs and no dev-only instrumentation leaks into the
// output) and then runs `compileContent()` in Node.  It renders every
// `src/content/{locale}/{slug}.md` to HTML through the exact same
// markdown-it + MDC + Shiki + KaTeX pipeline the site used to run client-side,
// inside a throwaway SSR app that provides pinia, vue-router and vue-i18n so
// the MDC content components (ProblemCard, BlogEntryCard, boxes, …) can
// `inject()` their context and `RouterLink` renders real `<a href>`s.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { h, createSSRApp } from 'vue'
import type { App as VueApp, VNodeChild } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import { renderToString } from '@vue/server-renderer'
import {
  renderMarkdownToVNodes,
  collectProblemIds,
  collectBlogEntrySlugs,
  collectHeadings,
} from '../src/lib/mdc'
import { splitFrontmatter, entryMetadata } from '../src/lib/frontmatter'
import type { ContentEntry } from '../src/lib/frontmatter'
// The shared route table from src/router/index.ts — a browser-free constant,
// safe to import under Node (createWebHistory is never called at module scope).
// RouterLink inside MDC components only needs `router.resolve()` to compute
// crawlable hrefs, so the lazy view components are never resolved at runtime.
import { routes as ROUTES } from '../src/router'

export interface CompileContentOptions {
  siteRoot: string
  outFile: string
}

const LOCALES = ['en', 'zh'] as const

// The site's i18n singleton (src/i18n/index.ts) is deliberately not imported:
// its module-scope locale detection touches `localStorage`/`navigator`.  The
// message catalog is the same JSON, loaded from disk instead.
function loadMessages(siteRoot: string) {
  const read = (locale: string) =>
    JSON.parse(readFileSync(path.join(siteRoot, 'src/i18n', `${locale}.json`), 'utf8'))
  return { en: read('en'), zh: read('zh') }
}

// Structural view of the vue-i18n instance the compiler needs: installable as
// a plugin, with a settable global locale.
interface CompileI18n {
  install: (app: VueApp) => unknown
  global: { locale: { value: string } }
}

// One i18n instance for the whole run; `global.locale` is switched per entry
// before its render so localized labels (box titles, dates) come out in the
// entry's own language.
function makeApp(i18n: CompileI18n, nodes: VNodeChild[]): VueApp {
  // The `.md` wrapper is part of the compiled HTML — the global prose styles
  // in src/assets/content.css target it (scoped styles can't reach v-html).
  const app = createSSRApp({ render: () => h('div', { class: 'md' }, nodes) })
  const router = createRouter({ history: createMemoryHistory(), routes: ROUTES })
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  return app
}

export async function compileContent({ siteRoot, outFile }: CompileContentOptions): Promise<void> {
  const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: loadMessages(siteRoot) })

  const data: Record<string, Record<string, ContentEntry>> = {}
  let count = 0

  for (const locale of LOCALES) {
    const dir = path.join(siteRoot, 'src/content', locale)
    const slugs = readdirSync(dir)
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.replace(/\.md$/, ''))
      .sort()

    const byLocale: Record<string, ContentEntry> = {}
    for (const slug of slugs) {
      const raw = readFileSync(path.join(dir, `${slug}.md`), 'utf8')
      const { body } = splitFrontmatter(raw)

      const nodes = await renderMarkdownToVNodes(body)
      i18n.global.locale.value = locale
      const html = await renderToString(makeApp(i18n, nodes))

      byLocale[slug] = {
        ...entryMetadata(locale, slug, raw),
        html,
        problemIds: collectProblemIds(body),
        entrySlugs: collectBlogEntrySlugs(body),
        headings: collectHeadings(body),
      }
      count++
      console.log(`[compile-content] ${locale}/${slug} (${html.length} bytes)`)
    }
    data[locale] = byLocale
  }

  mkdirSync(path.dirname(outFile), { recursive: true })
  writeFileSync(outFile, JSON.stringify(data, null, 2) + '\n')
  console.log(`[compile-content] wrote ${count} entries to ${outFile}`)
}
