import type { Role } from './role'

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  created_at: string
}

export interface UserRegistration {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UserCreate {
  name: string
  email: string
  password: string
  password_confirmation: string
  roles: Role[]
}

export interface UserUpdate {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  roles: Role[]
}

export const DEFAULT_USER_REGISTRATION: UserRegistration = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

export const DEFAULT_USER_CREATE: UserCreate = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  roles: ['team member'],
}

export const SORTABLE_USER_FIELDS: string[] = ['id', 'name', 'created_at']

export interface UserLogin {
  email: string
  password: string
  remember?: boolean
}

export const DEFAULT_USER_LOGIN: UserLogin = {
  email: '',
  password: '',
  remember: false,
}

export interface UserProfileUpdate {
  name?: string
  email?: string
}

export interface UserPasswordUpdate {
  current_password: string
  password: string
  password_confirmation: string
}
