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
