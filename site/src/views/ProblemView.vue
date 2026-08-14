<script setup lang="ts">
import { ref, computed, onBeforeUnmount, defineAsyncComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'
import { useEntriesReferencingProblem } from '@/lib/content'
import TwikooComments from '@/components/TwikooComments.vue'
import NotFoundState from '@/components/NotFoundState.vue'

// Lazy-load the PDF viewer so its heavy bundle (viewer JS + pdfium WASM) is
// only fetched when the modal is first opened, not on every problem-page visit.
const PDFViewer = defineAsyncComponent({
    loader: () => import('@embedpdf/vue-pdf-viewer').then((m) => m.PDFViewer),
    loadingComponent: {
        render() {
            return h('div', { class: 'pdf-loading' })
        },
    },
})

const props = defineProps<{ id: string }>()

const { t } = useI18n()

const catalog = useCatalog()
const problem = computed(() => catalog.problem(props.id))

// Blog entries (active locale) that reference this problem via a problem card.
// Getter, not value: the router reuses this component instance between
// `/problem/:id` routes, so the hook must re-read the prop on every change.
const referencing = useEntriesReferencingProblem(() => props.id)

// Which document is shown in the dialog.  `null` = closed.
const view = ref<'statement' | 'answer' | null>(null)
const dialog = ref<HTMLDialogElement | null>(null)

function open(which: 'statement' | 'answer') {
    view.value = which
    dialog.value?.showModal()
    setBodyScrollLock(true)
}
function close() {
    dialog.value?.close()
    view.value = null
    setBodyScrollLock(false)
}

// `showModal()` makes the background inert to pointer events, but the page
// behind can still be scrolled.  Lock body/html scrolling and pad the gap left
// by the now-hidden scrollbar so the content doesn't jump.
function setBodyScrollLock(lock: boolean) {
    if (lock) {
        const gap = window.innerWidth - document.documentElement.clientWidth
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${gap}px`
    } else {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
    }
}

// If the component unmounts with the dialog open (e.g. navigation), release
// the lock so the next page isn't stuck unscrollable.
onBeforeUnmount(() => setBodyScrollLock(false))

const pdfUrl = (which: 'statement' | 'answer') =>
    `${import.meta.env.BASE_URL}data/${props.id}/${which}.pdf`
</script>

<template>
    <article v-if="problem" class="problem">
        <header class="head">
            <h1>
                <template v-if="problem.status === 'err'">{{ t('common.err_prefix') }}</template> {{ problem.name }}
            </h1>
            <p class="setters">
                {{ t('problem.by') }}
                <RouterLink v-for="s in problem.setter" :key="s" :to="`/setters/${slugify(s)}`">
                    {{ s }}
                </RouterLink>
            </p>
        </header>

        <dl class="meta-table">
            <template v-if="problem.date">
                <dt>{{ t('problem.date') }}</dt>
                <dd>{{ problem.date }}</dd>
            </template>
            <template v-if="problem.score">
                <dt>{{ t('problem.score') }}</dt>
                <dd>{{ problem.score }} {{ t('problem.pts') }}</dd>
            </template>
            <template v-if="problem.topic">
                <dt>{{ t('problem.topic') }}</dt>
                <dd>
                    <RouterLink :to="`/topics/${slugify(problem.topic)}`">{{ problem.topic }}</RouterLink>
                </dd>
            </template>
            <template v-if="problem.difficulty">
                <dt>{{ t('problem.difficulty') }}</dt>
                <dd>{{ problem.difficulty }} / 5</dd>
            </template>
            <template v-if="problem.status === 'err'">
                <dt>{{ t('problem.status') }}</dt>
                <dd class="err">{{ t('problem.status_erroneous') }}</dd>
            </template>
            <template v-if="problem.open">
                <dt>{{ t('problem.status') }}</dt>
                <dd>{{ t('problem.status_open') }}</dd>
            </template>
            <template v-if="problem.tags.length">
                <dt>{{ t('problem.tags') }}</dt>
                <dd>
                    <RouterLink v-for="tag in problem.tags" :key="tag" :to="`/tags/${slugify(tag)}`" class="tag">
                        {{ tag }}
                    </RouterLink>
                </dd>
            </template>
            <template v-if="problem.resources.length">
                <dt>{{ t('problem.resources') }}</dt>
                <dd>{{ problem.resources.join(', ') }}</dd>
            </template>
        </dl>

        <div class="toolbar">
            <button class="action" type="button" :data-tip="t('problem.pdf_tooltip_question')"
                @click="open('statement')">
                <span class="action-char">Q</span>
                <span class="action-hint">PDF</span>
                <span class="action-label">{{ t('problem.problem_statement') }}</span>
            </button>
            <button v-if="!problem.open" class="action" type="button" :data-tip="t('problem.pdf_tooltip_answer')"
                @click="open('answer')">
                <span class="action-char">A</span>
                <span class="action-hint">PDF</span>
                <span class="action-label">{{ t('problem.reference_answer') }}</span>
            </button>
        </div>

        <div class="comments">
            <TwikooComments />
        </div>

        <section v-if="referencing.length" class="references">
            <h2 class="references__title">{{ t('problem.referenced_by') }}</h2>
            <ul class="references__list">
                <li v-for="e in referencing" :key="e.slug">
                    <RouterLink :to="`/blog/${e.slug}`">{{ e.title }}</RouterLink>
                </li>
            </ul>
        </section>

        <dialog ref="dialog" class="modal"
            :aria-label="view === 'statement' ? t('problem.problem_statement') : t('problem.answer')" @close="close"
            @click.self="close">
            <header class="modal-head">
                <h2>{{ view === 'statement' ? t('problem.problem_statement') : t('problem.answer') }}</h2>
                <button class="close" type="button" :aria-label="t('problem.close')" @click="close">×</button>
            </header>
            <div class="modal-body">
                <div v-if="view" class="pdf-wrap">
                    <PDFViewer style="height: 100%" :config="{
                        src: pdfUrl(view),
                        theme: { preference: 'light' },
                    }" />
                </div>
            </div>
        </dialog>
    </article>

    <NotFoundState
      v-else
      kind="Problem"
      attr="id"
      :value="id"
      :message="t('problem.not_found', { id })"
      to="/problem"
      :back-label="t('notfound.back_to', { target: t('nav.problems') })"
    />
</template>

<style scoped>
/* The problem page lays its blocks out in a wrapping flex row so the toolbar
   can sit beside the title on desktop yet drop below the metadata table on
   narrow screens (reordered with `order`). */
.problem {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    column-gap: var(--s4);
}

.head {
    order: 0;
    flex: 1 1 auto;
    min-width: 0;
}

.head h1 {
    margin-bottom: var(--s1);
}

.setters {
    color: var(--c-muted);
    margin: 0;
}

.setters a {
    margin-left: 0.4rem;
}

/* Two-column key/value metadata table. */
.meta-table {
    order: 2;
    flex: 1 1 100%;
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--s1) var(--s4);
    margin: var(--s4) 0;
    padding: var(--s3);
    border: 1px solid var(--c-border);
    border-radius: var(--radius);
}

.meta-table dt {
    color: var(--c-muted);
    font-weight: 600;
}

.meta-table dd {
    margin: 0;
}

.meta-table dd.err {
    color: var(--c-warn-fg);
}

.meta-table .tag {
    margin-right: 0.3rem;
}

.toolbar {
    order: 1;
    flex: 0 0 auto;
    display: flex;
    gap: var(--s2);
}

.toolbar .action {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    width: 5.5rem;
    height: 5.5rem;
    padding: var(--s3);
    cursor: pointer;
    border: 1px solid var(--c-accent);
    background: var(--c-accent-bg);
    border-radius: var(--radius);
    text-align: center;
}

.toolbar .action:hover {
    background: #e3edf5;
}

.action-char {
    font-size: 2rem;
    line-height: 1;
    font-weight: 700;
    color: var(--c-accent-strong);
}

.action-hint {
    font-size: 0.7rem;
    color: var(--c-muted);
}

/* Full-word button label, shown only on mobile (the desktop toolbar uses the
   compact Q/A + "PDF" glyph instead). */
.action-label {
    display: none;
}

.comments {
    order: 3;
    flex: 1 1 100%;
}

/* Blog entries referencing this problem. */
.references {
    order: 4;
    flex: 1 1 100%;
    margin-top: var(--s4);
}
.references__title {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin: 0 0 var(--s2);
}
.references__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--s2);
}
.references__list a {
    color: var(--c-accent);
}

/* Custom tooltip — appears immediately on hover/focus (native `title` has a
   ~1s delay and is suppressed on some setups).  Driven by data-tip. */
.action::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%) translateY(0.25rem);
    white-space: nowrap;
    background: var(--c-fg);
    color: #fff;
    font-size: 0.8rem;
    padding: 0.35rem 0.6rem;
    border-radius: var(--radius);
    opacity: 0;
    /* `visibility: hidden` (not just `opacity: 0`) so the off-screen tooltip
       doesn't contribute to scrollable overflow and create a stray horizontal
       scrollbar when the toolbar sits flush against the right edge. */
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.12s ease, transform 0.12s ease, visibility 0.12s;
    z-index: 10;
}

.action:hover::after,
.action:focus-visible::after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

.modal {
    background: #fff;
    border: none;
    border-radius: var(--radius);
    width: min(960px, 100%);
    height: 90vh;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Native <dialog> is `display:none` when closed via the UA stylesheet, but our
   `display:flex` above overrides that UA rule — so a closed dialog would
   otherwise stay visible.  Restore the hidden state explicitly. */
.modal:not([open]) {
    display: none;
}

/* Native dialog backdrop — rendered in the top layer, so it correctly dims
   everything behind it (including the navbar) with no z-index juggling. */
.modal::backdrop {
    background: rgba(0, 0, 0, 0.4);
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--s3) var(--s4);
    border-bottom: 1px solid var(--c-border);
}

.modal-head h2 {
    margin: 0;
    font-size: 1.15rem;
}

.close {
    border: none;
    background: none;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    color: var(--c-muted);
}

.close:hover {
    color: var(--c-fg);
}

.modal-body {
    flex: 1;
    min-height: 0;
    padding: 0;
    position: relative;
}

/* The embedpdf viewer (a custom element) shrink-wraps its toolbar unless its
   ancestors have a real, definite height.  Absolutely position the wrapper so
   it fills the dialog body regardless of percentage-height quirks, then force
   the PDFViewer root and the custom element to that full height. */
.pdf-wrap {
    position: absolute;
    inset: 0;
}

.pdf-wrap :deep(embedpdf-container) {
    height: 100%;
}

/* Spinner shown while the viewer chunk + WASM are first loading. */
.pdf-loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pdf-loading::after {
    content: '';
    width: 2.25rem;
    height: 2.25rem;
    border: 3px solid var(--c-border);
    border-top-color: var(--c-accent);
    border-radius: 50%;
    animation: pdf-spin 0.8s linear infinite;
}

@keyframes pdf-spin {
    to {
        transform: rotate(360deg);
    }
}

/* Mobile: stack the blocks and turn the two actions into full-width, vertical
   buttons labelled "Problem statement" / "Reference answer", below the table. */
@media (max-width: 640px) {
    .problem {
        column-gap: 0;
    }

    .head,
    .meta-table,
    .toolbar,
    .comments,
    .references {
        flex: 1 1 100%;
    }

    .head {
        order: 0;
    }

    .meta-table {
        order: 1;
    }

    .toolbar {
        order: 2;
        flex-direction: column;
    }

    .comments {
        order: 3;
    }

    .references {
        order: 4;
    }

    .toolbar .action {
        width: 100%;
        height: auto;
        flex-direction: row;
        justify-content: center;
        gap: 0.5rem;
    }

    .action-char,
    .action-hint {
        display: none;
    }

    .action-label {
        display: inline;
        font-weight: 600;
        color: var(--c-accent-strong);
    }

    /* The label already names the action; suppress the hover tooltip. */
    .action::after {
        content: none;
    }
}
</style>
