import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useCatalog } from '@/stores/catalog'
import type { ProblemMeta, ProblemQuery } from '@/types'

// Filter state + results for a list of problems.  Extracted from
// ProblemCatalogView so the same query/restriction machinery can drive any
// problem list.  Pass a `base` (reactive) set of problems to restrict the
// query to a scope (e.g. one setter's problems); omit it to query the whole
// catalog.
export function useProblemQuery(base?: MaybeRefOrGetter<ProblemMeta[]>) {
  const catalog = useCatalog()

  const baseProblems = computed(() => (base ? toValue(base) : catalog.problems))

  const search = ref('')
  const status = ref<'' | 'ok' | 'err'>('')
  const topic = ref('')
  const dateFrom = ref('')
  const dateTo = ref('')
  // Whether each bound is applied.  Unchecking disables the selector and
  // ignores its value without discarding it, so it can be re-enabled in place.
  const useFrom = ref(false)
  const useTo = ref(false)

  const query = computed<ProblemQuery>(() => ({
    search: search.value,
    status: status.value,
    topic: topic.value,
    dateFrom: useFrom.value ? dateFrom.value : '',
    dateTo: useTo.value ? dateTo.value : '',
  }))

  const results = computed(() => catalog.query(query.value, baseProblems.value))

  // Total number of problems in the (pre-filter) scope, for the
  // "shown of total" count.
  const total = computed(() => baseProblems.value.length)

  return { search, status, topic, dateFrom, dateTo, useFrom, useTo, results, total }
}
