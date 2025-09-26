// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router'
import TodoPage from '../components/TodoPage.vue'
import NotFoundPage from '../components/NotFound.vue'
import TodoItemDetail from '../components/TodoItemDetail.vue'
import TestError from '../components/TestError.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/todos' },
    { path: '/todos', component: TodoPage },
    { path: '/todos/:todoId', component: TodoItemDetail, props: true },
    { path: '/test-error', component: TestError },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
})
