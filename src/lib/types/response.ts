import { type User } from './user'

export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode: number
  meta?: Record<string, any>
  errors?: Record<string, string>
}

export type UserRegistrationResponse = ApiResponse<{ user: User }>

export type UserLoginResponse = ApiResponse<{ two_factor: boolean; user: User }>

export type RequestProgress = 'started' | 'in-progress' | 'completed' | 'failed'
