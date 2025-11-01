import { BACKEND_API_ROOT } from '../constants'
import type { UserRegistration } from '../types/user'
import api from './request'
import Cookies from 'js-cookie'

export async function registerUser(data: UserRegistration) {
  await api.get('/sanctum/csrf-cookie')

  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return await api.post(`${BACKEND_API_ROOT}/auth/register`, data, {
    headers: {
      'X-XSRF-TOKEN': xsrfToken || '',
    },
  })
}

export async function fetchCurrentUser() {
  const response = await api.get(`${BACKEND_API_ROOT}/auth/user`)
  return response.data
}

export async function loginUser(email: string, password: string) {
  await api.get('/sanctum/csrf-cookie')

  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return await api.post(
    `${BACKEND_API_ROOT}/auth/login`,
    { email, password },
    {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
    },
  )
}
