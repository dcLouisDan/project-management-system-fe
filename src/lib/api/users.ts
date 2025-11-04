import api from './request'
import { handleApiError } from '../handle-api-error'
import Cookies from 'js-cookie'

export interface FetchUsersParams {
  page: number
  per_page?: number
  name?: string
  role?: string
  roles?: string
}

export async function fetchUsers(params: FetchUsersParams) {
  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return api
    .get(`/users`, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
      params: params,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}
