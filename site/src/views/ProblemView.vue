<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'
import TwikooComments from '@/components/TwikooComments.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = defineProps<{ id: string }>()

const { t } = useI18n()

const catalog = useCatalog()
const problem = computed(() => catalog.problem(props.id))

// Which document is shown in the dialog.  `null` = closed.
const view = ref<'statement' | 'answer' | null>(null)
const dialog = ref<HTMLDialogElement | null>(null)

function open(which: 'statement' | 'answer') {
  view.value = which
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
  view.value = null
}

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
          <RouterLink
            v-for="tag in problem.tags"
            :key="tag"
            :to="`/tags/${slugify(tag)}`"
            class="tag"
          >
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
      <button
        class="action"
        type="button"
        :data-tip="t('problem.pdf_tooltip_question')"
        @click="open('statement')"
      >
        <span class="action-char">Q</span>
        <span class="action-hint">PDF</span>
        <span class="action-label">{{ t('problem.problem_statement') }}</span>
      </button>
      <button
        v-if="!problem.open"
        class="action"
        type="button"
        :data-tip="t('problem.pdf_tooltip_answer')"
        @click="open('answer')"
      >
        <span class="action-char">A</span>
        <span class="action-hint">PDF</span>
        <span class="action-label">{{ t('problem.reference_answer') }}</span>
      </button>
    </div>

    <div class="comments">
      <TwikooComments />
    </div>

    <dialog
      ref="dialog"
      class="modal"
      :aria-label="view === 'statement' ? t('problem.problem_statement') : t('problem.answer')"
      @close="close"
      @click.self="close"
    >
      <header class="modal-head">
        <h2>{{ view === 'statement' ? t('problem.problem_statement') : t('problem.answer') }}</h2>
        <button class="close" type="button" :aria-label="t('problem.close')" @click="close">×</button>
      </header>
      <div class="modal-body">
        <VuePdfEmbed
          v-if="view"
          annotation-layer
          text-layer
          :source="pdfUrl(view)"
        />
      </div>
    </dialog>
  </article>

  <p v-else>{{ t('problem.not_found', { id }) }}</p>
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
  pointer-events: none;
  transition: opacity 0.12s ease, transform 0.12s ease;
  z-index: 10;
}
.action:hover::after,
.action:focus-visible::after {
  opacity: 1;
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
  padding: var(--s4);
  overflow-y: auto;
}
/* vue-pdf-embed renders each page as a stacked .vue-pdf-embed page; center
   them and space them vertically. */
.modal-body :deep(.vue-pdf-embed) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s3);
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
  .comments {
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
