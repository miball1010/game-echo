import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()

  if (authStore.loading) {
    return new Promise((resolve) => {
      const unwatch = watch(
        () => authStore.loading,
        (newVal) => {
          if (!newVal) {
            unwatch()
            resolve(checkAuth(to, authStore))
          }
        }
      )
    })
  }
  return checkAuth(to, authStore)
})

function checkAuth(to: RouteLocationNormalized, authStore: ReturnType<typeof useAuthStore>) {
  if (to.meta.requiresAuth && !authStore.currentUser) return '/login'
  if (to.path === '/login' && authStore.currentUser) return '/'
  return true
}

export default router
