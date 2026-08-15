import type { RouterHistory, RouteRecordRaw } from 'vue-router'
import { createRouter } from 'vue-router'

// The route table is a plain constant (no router instance, no history) so it
// can be shared between the client entry (createWebHistory), the SSR entry
// (createMemoryHistory) and the build-only content compiler
// (scripts/compile-entry.ts), which runs in Node where createWebHistory is
// unavailable.
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/IndexView.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogEntriesView.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-entry',
    component: () => import('@/views/ContentView.vue'),
    props: true,
  },
  {
    path: '/problem',
    name: 'problem-catalog',
    component: () => import('@/views/ProblemCatalogView.vue'),
  },
  {
    path: '/problem/:id',
    name: 'problem',
    component: () => import('@/views/ProblemView.vue'),
    props: true,
  },
  {
    path: '/setters',
    name: 'setter-catalog',
    component: () => import('@/views/SetterCatalogView.vue'),
  },
  {
    path: '/setters/:nameNormalized',
    name: 'setter',
    component: () => import('@/views/SetterView.vue'),
    props: true,
  },
  {
    path: '/topics',
    name: 'topic-catalog',
    component: () => import('@/views/TopicCatalogView.vue'),
  },
  {
    path: '/topics/:nameNormalized',
    name: 'topic',
    component: () => import('@/views/TopicView.vue'),
    props: true,
  },
  {
    path: '/tags',
    name: 'tag-catalog',
    component: () => import('@/views/TagCatalogView.vue'),
  },
  {
    path: '/tags/:nameNormalized',
    name: 'tag',
    component: () => import('@/views/TagView.vue'),
    props: true,
  },
  {
    path: '/dev',
    name: 'dev',
    component: () => import('@/views/DevView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

// History-agnostic factory.  The client passes createWebHistory(BASE_URL);
// SSR and the prerender pass createMemoryHistory().
export function createAppRouter(history: RouterHistory) {
  return createRouter({
    history,
    routes,
    // Without this, SPA navigation leaves the window wherever it was — a
    // scrolled /blog list stays scrolled when a clicked entry swaps in, and
    // returning to the list lands mid-page.  Start every navigation at the
    // top; hash links (the TOC's heading anchors) scroll to their target
    // instead (headings carry scroll-margin-top for the sticky navbar).
    scrollBehavior(to, _from, _savedPosition) {
      if (to.hash) {
        return { el: to.hash, behavior: 'smooth' }
      }
      return { top: 0 }
    },
  })
}
