import useAppStore from '@/integrations/zustand/app-store'
import { updateUserProfile } from '@/lib/api/profile.settings'
import type { ApiError } from '@/lib/handle-api-error'
import { type RequestProgress } from '@/lib/types/response'
import type { UserProfileUpdate } from '@/lib/types/user'
import { useState } from 'react'

export default function useProfileSettings() {
  const { user, setUser } = useAppStore((state) => state)
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestProgress, setRequestProgress] =
    useState<RequestProgress>('started')

  const clearError = () => setError(null)

  async function updateProfile(data: UserProfileUpdate): Promise<void> {
    setRequestProgress('in-progress')
    clearError()
    setValidationErrors(null)
    try {
      // Call the API to update the user profile
      await updateUserProfile(data)
      setRequestProgress('completed')
      if (!user) return
      setUser({
        ...user,
        name: data?.name || user.name,
        email: data?.email || user.email,
      })
    } catch (err) {
      const error = err as ApiError
      setError(error.message)
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const key in error.errors) {
          fieldErrors[key] = error.errors[key].join(' ')
        }
        setValidationErrors(fieldErrors)
      }
      setRequestProgress('failed')
    }
  }

  return {
    updateProfile,
    validationErrors,
    error,
    clearError,
    requestProgress,
  }
}
