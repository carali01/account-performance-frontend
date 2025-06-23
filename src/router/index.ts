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
      path: '/detail/:analyst',
      name: 'detail',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DetailView.vue'),
    },
    {
      path: '/post/:id/:platform/:analyst',
      name: 'post conent',
      component: () => import('../views/PostsContentView.vue'),
    },
    {
      path: '/pop-sector',
      name: 'pop-sector',
      component: () => import('../views/PopSector.vue'),
    },
    {
      path: '/pop-stock',
      name: 'pop-stock',
      component: () => import('../views/PopStock.vue'),
    },
  ],
})

export default router
