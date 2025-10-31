import { BACKEND_API_ROOT } from '../constants'
import type { UserRegistration } from '../types/user'
import api from './request'
import Cookies from 'js-cookie'

export async function registerUser(data: UserRegistration) {
  await api.get('/sanctum/csrf-cookie')

  const xsrfToken = Cookies.get('XSRF-TOKEN')
  console.log('XSRF-TOKEN cookie:', xsrfToken)
  const response = await api.post(`${BACKEND_API_ROOT}/auth/register`, data, {
    headers: {
      'X-XSRF-TOKEN': xsrfToken || '',
    },
  })
  return response.data
}
