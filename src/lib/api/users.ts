import api from './request'
import { handleApiError } from '../handle-api-error'
import Cookies from 'js-cookie'
import type { SortDirection } from '../types/ui'

export interface FetchUsersParams {
  page: number
  per_page?: number
  name?: string
  role?: string
  roles?: string
  sort?: string
  direction?: SortDirection
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
