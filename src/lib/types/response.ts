import { type User } from './user'

export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode: number
  meta?: Record<string, any>
  errors?: Record<string, string>
}

export type GetAuthUserResponse = ApiResponse<{ user: User }>
export type ShowUserResponse = { data: User }
export type UserCreateResponse = ApiResponse<User>
export type UserUpdateResponse = ApiResponse<User>

export type UserLoginResponse = ApiResponse<{ two_factor: boolean; user: User }>

export type RequestProgress = 'started' | 'in-progress' | 'completed' | 'failed'

export interface PaginatedResponseMetaLinkItem {
  active: boolean
  label: string
  url: string | null
  page: number | null
}

export interface PaginatedResponseMetaData {
  current_page: number
  from: number
  last_page: number
  links: PaginatedResponseMetaLinkItem[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev?: string
    next?: string
  }
  meta: PaginatedResponseMetaData
}
