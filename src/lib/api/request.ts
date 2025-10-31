import axios from 'axios'
import { BACKEND_URL } from '@/lib/constants'

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

api.defaults.withCredentials = true
api.defaults.withXSRFToken = true

export default api
