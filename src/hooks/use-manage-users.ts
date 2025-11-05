import { createUser } from '@/lib/api/users'
import { QUERY_KEYS } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import type { RequestProgress, UserCreateResponse } from '@/lib/types/response'
import type { UserCreate } from '@/lib/types/user'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function useManageUsers() {
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const [requestProgress, setRequestProgress] =
    useState<RequestProgress>('started')

  const clearErrors = () => {
    setError(null)
    setValidationErrors({})
  }

  async function create(data: UserCreate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await createUser(data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      })
      toast.success('User Created', {
        description: `New user record created for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      setRequestProgress('failed')
      const error = err as ApiError
      setError(error.message || 'Login failed')
      toast.error('Failed to create user', {
        description: error.message,
      })
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const key in error.errors) {
          fieldErrors[key] = error.errors[key].join(' ')
        }
        setValidationErrors(fieldErrors)
      }
    }
  }

  return {
    create,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
