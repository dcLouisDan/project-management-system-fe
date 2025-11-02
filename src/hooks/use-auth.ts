import useAppStore from '@/integrations/zustand/app-store'
import { loginUser, logoutUser, registerUser } from '@/lib/api/auth'
import type { ApiError } from '@/lib/handle-api-error'
import type {
  UserLoginResponse,
  UserRegistrationResponse,
} from '@/lib/types/response'
import { useState } from 'react'
import { Navigate, useNavigate } from '@tanstack/react-router'
import type { UserRegistration } from '@/lib/types/user'

export default function useAuth() {
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)
  const navigate = useNavigate()

  const {
    setUser,
    unsetUser,
    setLoading,
    loading: isLoading,
  } = useAppStore((state) => state)

  async function login(email: string, password: string): Promise<void> {
    setLoading(true)
    setValidationErrors(null)
    clearError()
    try {
      const response = await loginUser(email, password)

      const body = response.data as UserLoginResponse

      setUser(body.data.user)
      setLoading(false)

      navigate({ to: '/dashboard' })
    } catch (err) {
      setLoading(false)
      console.log('Login error:', err)
      const error = err as ApiError
      setError(error.message || 'Login failed')
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const key in error.errors) {
          fieldErrors[key] = error.errors[key].join(' ')
        }
        setValidationErrors(fieldErrors)
      }
    }
  }

  async function logout() {
    setLoading(true)
    clearError()
    try {
      const response = await logoutUser()
      if (response.status == 204) {
        unsetUser()
        setLoading(false)
        navigate({ to: '/auth/login' })
      }
    } catch (err) {
      setLoading(false)
      const error = err as ApiError
      setError(error.message || 'Logout failed')
    }
  }

  async function register(registrationData: UserRegistration) {
    setLoading(true)
    clearError()
    setValidationErrors(null)
    try {
      const response = await registerUser(registrationData)

      const body = response.data as UserRegistrationResponse

      setUser(body.data.user)
      setLoading(false)

      navigate({ to: '/dashboard' })
    } catch (err) {
      setLoading(false)
      const error = err as ApiError
      setError(error.message || 'Registration failed')
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const key in error.errors) {
          fieldErrors[key] = error.errors[key].join(' ')
        }
        setValidationErrors(fieldErrors)
      }
    }
  }

  return { login, logout, register, isLoading, error, validationErrors }
}
