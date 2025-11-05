import { handleApiError } from '../handle-api-error'
import type {
  UserLoginResponse,
  UserRegistrationResponse,
} from '../types/response'
import type { UserRegistration } from '../types/user'
import api from './request'
import Cookies from 'js-cookie'

export async function registerUser(data: UserRegistration) {
  await api.get('/sanctum/csrf-cookie').catch((error) => {
    throw handleApiError(error)
  })

  const xsrfToken = Cookies.get('XSRF-TOKEN')

  const response = await api
    .post(`/auth/register`, data, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })

  if (response.status === 201) {
    return fetchCurrentUser()
  } else {
    throw handleApiError({ message: 'Registration failed' })
  }
}

export async function fetchCurrentUser() {
  const XSRFToken = Cookies.get('XSRF-TOKEN')
  return api
    .get<UserRegistrationResponse>(`/user`, {
      headers: {
        'X-XSRF-TOKEN': XSRFToken || '',
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function loginUser(email: string, password: string) {
  await api.get('/sanctum/csrf-cookie').catch((error) => {
    throw handleApiError(error)
  })

  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return api
    .post<UserLoginResponse>(
      `/auth/login`,
      { email, password },
      {
        headers: {
          'X-XSRF-TOKEN': xsrfToken || '',
        },
      },
    )
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function logoutUser() {
  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return await api
    .post(
      `/auth/logout`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken || '',
        },
      },
    )
    .catch((error) => {
      throw handleApiError(error)
    })
}
