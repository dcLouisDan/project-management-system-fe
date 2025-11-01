import { BACKEND_API_ROOT } from '../constants'
import { handleApiError } from '../handle-api-error'
import type { UserRegistration } from '../types/user'
import api from './request'
import Cookies from 'js-cookie'

export async function registerUser(data: UserRegistration) {
  try {
    await api.get('/sanctum/csrf-cookie')

    const xsrfToken = Cookies.get('XSRF-TOKEN')

    const response = await api.post(`${BACKEND_API_ROOT}/auth/register`, data, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
    })

    if (response.status === 201) {
      return fetchCurrentUser()
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function fetchCurrentUser() {
  try {
    const xsrfToken = Cookies.get('XSRF-TOKEN')
    const response = await api.get(`${BACKEND_API_ROOT}/user`, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await api.get('/sanctum/csrf-cookie')

    const xsrfToken = Cookies.get('XSRF-TOKEN')
    const response = await api.post(
      `${BACKEND_API_ROOT}/auth/login`,
      { email, password },
      {
        headers: {
          'X-XSRF-TOKEN': xsrfToken || '',
        },
      },
    )

    console.log('login Response', response)

    if (response.status === 200) {
      return fetchCurrentUser()
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function logoutUser() {
  try {
    const xsrfToken = Cookies.get('XSRF-TOKEN')
    return await api.post(
      `${BACKEND_API_ROOT}/auth/logout`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken || '',
        },
      },
    )
  } catch (error) {
    throw handleApiError(error)
  }
}
