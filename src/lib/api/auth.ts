import { handleApiError, type ApiError } from '../handle-api-error'
import type { UserLoginResponse, GetAuthUserResponse } from '../types/response'
import type { User, UserRegistration } from '../types/user'
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
    .get<GetAuthUserResponse>(`/user`, {
      headers: {
        'X-XSRF-TOKEN': XSRFToken || '',
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function checkAuthSession(): Promise<{
  success: boolean
  error?: string
  user?: User | null
}> {
  try {
    const response = await fetchCurrentUser()
    const user = response.data.data.user
    return { success: true, user: user }
  } catch (err) {
    const error = err as ApiError
    return { success: false, error: error.message, user: null }
  }
}

export async function loginUser(
  email: string,
  password: string,
  remember: boolean = false,
) {
  await api.get('/sanctum/csrf-cookie').catch((error) => {
    throw handleApiError(error)
  })

  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return api
    .post<UserLoginResponse>(
      `/auth/login`,
      { email, password, remember },
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
