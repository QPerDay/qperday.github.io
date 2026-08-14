import { ref, onMounted, onBeforeUnmount } from 'vue'

// Reactive media query.  `matches` starts false and tracks the query on mount,
// re-evaluating on resize.  Use for layout decisions that can't be expressed
// in pure CSS (e.g. choosing between two text forms).
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mql: MediaQueryList | null = null

  const onChange = (e: MediaQueryListEvent) => {
    matches.value = e.matches
  }

  onMounted(() => {
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', onChange)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', onChange)
  })

  return matches
}
