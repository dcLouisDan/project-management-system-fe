import axios from 'axios'
import { BACKEND_URL, BACKEND_API_URL } from '@/lib/constants'

const api = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
})

export const initCSRF = async () => {
  try {
    await axios.get('/sanctum/csrf-cookie', {
      baseURL: BACKEND_URL,
      withCredentials: true,
    })
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error)
    throw error
  }
}

export default api
