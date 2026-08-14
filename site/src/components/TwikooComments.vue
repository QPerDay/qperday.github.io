<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Twikoo comments.  One thread per problem, keyed by the page path.
// The script is lazy-loaded once, then `twikoo.init` mounts into #tcomment.
// This component renders only the mount point; the collapsible panel chrome
// lives in the parent (ProblemView), which controls when the body is visible.
const props = defineProps<{ path?: string }>()

const { locale } = useI18n()

const ENV_ID = 'https://qpd-comments.makabaka1880.xyz'
const SCRIPT_ID = 'twikoo-script'
const SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/twikoo@1.7.15/dist/twikoo.min.js'

function init() {
  const w = window as unknown as {
    twikoo?: { init: (o: Record<string, unknown>) => void }
  }
  w.twikoo?.init({
    envId: ENV_ID,
    el: '#tcomment',
    // Distinct thread per problem; defaults to the current route path.
    path: props.path ?? window.location.pathname,
    lang: locale.value.startsWith('zh') ? 'zh-CN' : 'en',
  })
}

onMounted(() => {
  if (document.getElementById(SCRIPT_ID)) {
    init()
    return
  }
  const s = document.createElement('script')
  s.id = SCRIPT_ID
  s.src = SCRIPT_URL
  s.onload = init
  document.head.appendChild(s)
})
</script>

<template>
  <div id="tcomment"></div>
</template>
