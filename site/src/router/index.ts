import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
