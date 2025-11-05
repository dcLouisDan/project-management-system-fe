import useAppStore from '@/integrations/zustand/app-store'
import { loginUser, logoutUser, registerUser } from '@/lib/api/auth'
import type { ApiError } from '@/lib/handle-api-error'
import { useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import type { UserRegistration } from '@/lib/types/user'
import { validateRoleString } from '@/lib/types/role'

export default function useAuth() {
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)
  const navigate = useNavigate()
  const router = useRouter()

  const {
    setUser,
    unsetUser,
    setLoading,
    loading: isLoading,
    setUiMode,
  } = useAppStore((state) => state)

  async function login(email: string, password: string): Promise<void> {
    setLoading(true)
    setValidationErrors(null)
    clearError()
    try {
      const response = await loginUser(email, password)

      const body = response.data
      const user = body.data.user
      const mainRole: string | null =
        user.roles.length > 0 ? user.roles[0] : null

      if (!mainRole || !validateRoleString(mainRole)) {
        setUiMode('team member')
      } else {
        setUiMode(mainRole)
      }

      setUser(user)
      setLoading(false)
      router.invalidate()

      navigate({ to: '/dashboard' })
    } catch (err) {
      setLoading(false)
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
        router.invalidate()
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

      const body = response.data

      setUser(body.data.user)
      setLoading(false)
      router.invalidate()
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
