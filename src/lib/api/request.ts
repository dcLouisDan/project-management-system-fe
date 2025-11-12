import axios from 'axios'
import { BACKEND_URL } from '@/lib/constants'
import useAppStore from '@/integrations/zustand/app-store'

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

      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
