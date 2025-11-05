import api from './request'
import { handleApiError } from '../handle-api-error'
import type { SortDirection } from '../types/ui'
import type { UserCreate } from '../types/user'

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
  return api
    .get(`/users`, {
      params: params,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function createUser(data: UserCreate) {
  return api.post('/users', data).catch((error) => {
    throw handleApiError(error)
  })
}
