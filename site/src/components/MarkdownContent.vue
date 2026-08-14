<script lang="ts">
import { shallowRef, watchEffect, h, defineComponent } from 'vue'
import type { VNodeChild } from 'vue'
import { renderMarkdownToVNodes } from '@/lib/mdc'

// Render a markdown/MDC string to Vue VNodes.  A render-function component is
// required so the VNode tree produced by the MDC renderer is emitted verbatim
// (a template would not know how to flatten it).  Rendering is async because
// Shiki code highlighting awaits its shared highlighter.
export default defineComponent({
  name: 'MarkdownContent',
  props: {
    source: { type: String, required: true },
  },
  setup(props) {
    const nodes = shallowRef<VNodeChild[]>([])
    let seq = 0
    watchEffect(() => {
      const current = ++seq
      void renderMarkdownToVNodes(props.source).then((n) => {
        if (current === seq) nodes.value = n
      })
    })
    return () => h('div', { class: 'md' }, nodes.value)
  },
})
</script>

<style scoped>
/* Base prose styling for rendered content.  Mirrors the old About page styles
   but scoped to the generic `.md` wrapper. */
.md :deep(h1) {
  font-size: 1.9rem;
  line-height: 1.2;
  margin: 0 0 var(--s6);
}
.md :deep(h2) {
  font-size: 1.4rem;
  line-height: 1.25;
  margin: var(--s6) 0 var(--s4);
  padding-top: var(--s4);
}
.md :deep(h3) {
  font-size: 1.15rem;
  margin: var(--s4) 0 var(--s3);
}
.md :deep(h4),
.md :deep(h5),
.md :deep(h6) {
  font-size: 1.05rem;
  margin: var(--s4) 0 var(--s2);
}
/* Anchor jumps clear the sticky navbar so headings aren't hidden under it. */
.md :deep(h1),
.md :deep(h2),
.md :deep(h3),
.md :deep(h4),
.md :deep(h5),
.md :deep(h6) {
  scroll-margin-top: 5rem;
}
.md :deep(p) {
  margin: var(--s4) 0;
}
.md :deep(ul),
.md :deep(ol) {
  padding-left: 1.5rem;
  margin: var(--s4) 0;
}
.md :deep(li) {
  margin: var(--s2) 0;
}
.md :deep(blockquote) {
  margin: var(--s4) 0;
  padding-left: var(--s4);
  border-left: 3px solid var(--c-border);
  color: var(--c-muted);
}
/* Style prose links, but not component-styled badges (`.tag`) — those carry
   their own colour and hover state (see main.css).  Without this, the scoped
   `.md a` rule (specificity 0,2,1) would override `.tag:hover`'s white text. */
.md :deep(a:not(.tag)) {
  color: var(--c-accent);
}
.md :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--c-accent-bg);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}
.md :deep(pre) {
  margin: var(--s4) 0;
  padding: var(--s3) var(--s4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  overflow-x: auto;
  line-height: 1.5;
  font-size: 0.9em;
}
.md :deep(pre code) {
  background: none;
  padding: 0;
}
.md :deep(.code-block pre) {
  /* Shiki injects its own background inline; keep layout consistent. */
  font-family: var(--font-mono);
}
.md :deep(table) {
  border-collapse: collapse;
  margin: var(--s4) 0;
  width: 100%;
}
.md :deep(th),
.md :deep(td) {
  border: 1px solid var(--c-border);
  padding: var(--s2) var(--s3);
  text-align: left;
}
.md :deep(th) {
  background: var(--c-accent-bg);
  font-weight: 600;
}
.md :deep(img) {
  max-width: 100%;
}
.md :deep(hr) {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: var(--s6) 0;
}
.md :deep(.katex-display) {
  margin: var(--s4) 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
