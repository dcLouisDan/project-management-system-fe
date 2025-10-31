import { type User } from './user'

export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode: number
  meta?: Record<string, any>
  errors?: Record<string, string>
}

export type UserRegistrationResponse = ApiResponse<{ user: User }>
