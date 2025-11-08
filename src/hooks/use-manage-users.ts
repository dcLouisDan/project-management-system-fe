import {
  createUser,
  deleteUser,
  restoreUser,
  updateUser,
} from '@/lib/api/users'
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

  function handleError(
    error: ApiError,
    action: string,
    resource: string = 'User',
  ) {
    setRequestProgress('failed')
    setError(error.message || `${resource} ${action} failed`)
    toast.error(`Failed to ${action} ${resource}`, {
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
      handleError(err as ApiError, 'create')
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
      handleError(err as ApiError, 'update')
    }
  }

  async function destroy(userId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await deleteUser(userId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      })
      navigate({
        to: '/users',
      })
      toast.success('User Deleted', {
        description: `Successfully deleted user.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'delete')
    }
  }

  async function restore(userId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await restoreUser(userId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      })
      toast.success('User Restored', {
        description: `Successfully restored user.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'restore')
    }
  }

  return {
    create,
    update,
    destroy,
    restore,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
