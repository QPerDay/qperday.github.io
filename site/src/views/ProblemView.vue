<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'
import TwikooComments from '@/components/TwikooComments.vue'

const props = defineProps<{ id: string }>()

const catalog = useCatalog()
const problem = computed(() => catalog.problem(props.id))

// Which document (if any) is shown in the modal.  `null` = closed.
const view = ref<'statement' | 'answer' | null>(null)

function open(which: 'statement' | 'answer') {
  view.value = which
}
function close() {
  view.value = null
}

const pdfUrl = (which: 'statement' | 'answer') =>
  `${import.meta.env.BASE_URL}data/${props.id}/${which}.pdf`
</script>

<template>
  <article v-if="problem">
    <div class="head-row">
      <header class="head">
        <h1>
          <template v-if="problem.status === 'err'">[ERR]</template> {{ problem.name }}
        </h1>
        <p class="setters">
          by
          <RouterLink v-for="s in problem.setter" :key="s" :to="`/setters/${slugify(s)}`">
            {{ s }}
          </RouterLink>
        </p>
      </header>

      <div class="toolbar">
        <button
          class="action"
          type="button"
          data-tip="Click to open the problem statement"
          @click="open('statement')"
        >
          <span class="action-char">Q</span>
          <span class="action-hint">PDF</span>
        </button>
        <button
          v-if="!problem.open"
          class="action"
          type="button"
          data-tip="Click to open the answer"
          @click="open('answer')"
        >
          <span class="action-char">A</span>
          <span class="action-hint">PDF</span>
        </button>
      </div>
    </div>

    <dl class="meta-table">
      <template v-if="problem.date">
        <dt>Date</dt>
        <dd>{{ problem.date }}</dd>
      </template>
      <template v-if="problem.score">
        <dt>Score</dt>
        <dd>{{ problem.score }} pts</dd>
      </template>
      <template v-if="problem.topic">
        <dt>Topic</dt>
        <dd>
          <RouterLink :to="`/topics/${slugify(problem.topic)}`">{{ problem.topic }}</RouterLink>
        </dd>
      </template>
      <template v-if="problem.difficulty">
        <dt>Difficulty</dt>
        <dd>{{ problem.difficulty }} / 5</dd>
      </template>
      <template v-if="problem.status === 'err'">
        <dt>Status</dt>
        <dd class="err">erroneous</dd>
      </template>
      <template v-if="problem.open">
        <dt>Status</dt>
        <dd>open — answer not yet released</dd>
      </template>
      <template v-if="problem.tags.length">
        <dt>Tags</dt>
        <dd>
          <RouterLink
            v-for="t in problem.tags"
            :key="t"
            :to="`/tags/${slugify(t)}`"
            class="tag"
          >
            {{ t }}
          </RouterLink>
        </dd>
      </template>
      <template v-if="problem.resources.length">
        <dt>Resources</dt>
        <dd>{{ problem.resources.join(', ') }}</dd>
      </template>
    </dl>

    <TwikooComments />

    <Teleport to="body">
      <div
        v-if="view"
        class="overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="view === 'statement' ? 'Problem statement' : 'Answer'"
        @click.self="close"
      >
        <div class="modal">
          <header class="modal-head">
            <h2>{{ view === 'statement' ? 'Problem statement' : 'Answer' }}</h2>
            <button class="close" type="button" aria-label="Close" @click="close">×</button>
          </header>
          <div class="modal-body">
            <iframe
              class="pdf"
              :src="pdfUrl(view)"
              :title="view === 'statement' ? 'Problem statement' : 'Answer'"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </article>

  <p v-else>Problem <code>{{ id }}</code> not found.</p>
</template>

<style scoped>
.head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s4);
}
.head {
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
  display: flex;
  gap: var(--s2);
  flex-shrink: 0;
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

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s4);
  z-index: 100;
}
.modal {
  background: #fff;
  border-radius: var(--radius);
  width: min(960px, 100%);
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
}
.pdf {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
