import axios from 'axios'
import { BACKEND_URL } from '@/lib/constants'
import useAppStore from '@/integrations/zustand/app-store'
import { getRouterInstance } from '@/lib/router-instance'

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

api.defaults.withCredentials = true
api.defaults.withXSRFToken = true
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([419, 401].includes(error.response?.status)) {
      useAppStore.getState().unsetUser()

      // Use TanStack Router for navigation instead of window.location.href
      // This maintains SPA navigation and prevents full page reloads
      const router = getRouterInstance()
      if (router) {
        const currentPath = router.state.location.pathname
        if (currentPath !== '/auth/login') {
          router.navigate({ to: '/auth/login' })
        }
      } else {
        // Fallback to window.location if router is not yet initialized
        // This should only happen during initial app load
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

export default api
