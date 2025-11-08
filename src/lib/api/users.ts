import api from './request'
import { handleApiError } from '../handle-api-error'
import type { SortDirection } from '../types/ui'
import type { User, UserCreate, UserUpdate } from '../types/user'
import {
  type PaginatedResponse,
  type ShowUserResponse,
  type SoftDeleteStatus,
  type UserCreateResponse,
  type UserDeleteResponse,
  type UserRestoreResponse,
  type UserUpdateResponse,
} from '../types/response'

export interface FetchUsersParams {
  page: number
  per_page?: number
  name?: string
  role?: string
  roles?: string
  sort?: string
  direction?: SortDirection
  status?: SoftDeleteStatus
}

export class UserNotFoundError extends Error {}

export async function fetchUsers(params: FetchUsersParams) {
  return api
    .get<PaginatedResponse<User>>(`/users`, {
      params: params,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function createUser(data: UserCreate) {
  return api.post<UserCreateResponse>('/users', data).catch((error) => {
    throw handleApiError(error)
  })
}

export async function updateUser(userId: number, data: UserUpdate) {
  return api
    .put<UserUpdateResponse>(`/users/${userId}`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function showUser(userId: number) {
  return api
    .get<ShowUserResponse>(`/users/${userId}`)
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function deleteUser(userId: number) {
  return api.delete<UserDeleteResponse>(`/users/${userId}`).catch((error) => {
    throw handleApiError(error)
  })
}

export async function restoreUser(userId: number) {
  return api
    .post<UserRestoreResponse>(`/users/${userId}/restore`)
    .catch((error) => {
      throw handleApiError(error)
    })
}
