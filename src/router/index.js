import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/factions',
      name: 'factions',
      component: () => import('../views/FactionsView.vue'),
    },
    {
      path: '/factions/:id',
      name: 'faction-detail',
      component: () => import('../views/FactionsView.vue'),
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharactersView.vue'),
    },
    {
      path: '/characters/:id',
      name: 'character-detail',
      component: () => import('../views/CharacterDetailView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue'),
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      component: () => import('../views/EventDetailView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
    {
      path: '/animations',
      name: 'animations',
      component: () => import('../views/tests/AnimationTestView.vue'),
    },
    {
      path: '/relation-graph',
      name: 'relation-graph',
      component: () => import('../views/tests/RelationGraphView.vue'),
    },
    {
      path: '/avatar-gallery',
      name: 'avatar-gallery',
      component: () => import('../views/tests/AvatarGalleryView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contributing',
      name: 'contributing',
      component: () => import('../views/ContributingView.vue'),
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: () => import('../views/ChangelogView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
