export interface User {
  id: number
  name: string
  email: string
  roles: string[]
}

export interface UserRegistration {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const DEFAULT_USER_REGISTRATION: UserRegistration = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

export interface UserLogin {
  email: string
  password: string
}

export const DEFAULT_USER_LOGIN: UserLogin = {
  email: '',
  password: '',
}

export interface UserProfileUpdate {
  name?: string
  email?: string
}
