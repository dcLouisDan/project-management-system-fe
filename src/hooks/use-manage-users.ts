import { createUser, updateUser } from '@/lib/api/users'
import { QUERY_KEYS } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import type { RequestProgress } from '@/lib/types/response'
import type { UserCreate, UserUpdate } from '@/lib/types/user'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()

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
      setError(error.message || 'User creation failed')
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

  async function update(userId: number, data: UserUpdate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await updateUser(userId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      })
      navigate({
        to: '/users/$userId',
        params: { userId: userId.toString() },
      })
      toast.success('User Updated', {
        description: `User record updated for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      setRequestProgress('failed')
      const error = err as ApiError
      setError(error.message || 'User update failed')
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
    update,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
