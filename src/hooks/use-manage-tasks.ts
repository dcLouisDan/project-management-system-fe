import {
  assignToUserTask,
  createTask,
  deleteTask,
  restoreTask,
  syncTeamsTask,
  updateTask,
} from '@/lib/api/tasks'
import { QUERY_KEYS } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import type { RequestProgress } from '@/lib/types/response'
import type {
  TaskAssignToUser,
  TaskCreate,
  TaskSyncRelations,
  TaskUpdate,
} from '@/lib/types/task'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export default function useManageTasks() {
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
    resource: string = 'Task',
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

  async function create(projectId: number, data: TaskCreate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await createTask(projectId, data)
      const body = response.data

      navigate({
        to: '/projects/$projectId',
        params: { projectId: projectId.toString() },
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS],
      })
      toast.success('Task Created', {
        description: `New task record created for ${body.data.title}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'create')
    }
  }

  async function update(taskId: number, data: TaskUpdate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await updateTask(taskId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS],
      })

      toast.success('Task Updated', {
        description: `Task record updated for ${body.data.title}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'update')
    }
  }

  async function destroy(taskId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await deleteTask(taskId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS],
      })

      toast.success('Task Deleted', {
        description: `Successfully deleted task.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'delete')
    }
  }

  async function restore(taskId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await restoreTask(taskId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS],
      })
      toast.success('Task Restored', {
        description: `Successfully restored task.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'restore')
    }
  }

  async function syncTeams(taskId: number, data: TaskSyncRelations) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await syncTeamsTask(taskId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS, taskId],
      })

      toast.success('Task Updated', {
        description: `Task teams synced for ${body.data.title}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'sync teams')
    }
  }

  async function assignToUser(taskId: number, data: TaskAssignToUser) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await assignToUserTask(taskId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS, taskId],
      })

      toast.success('Task Updated', {
        description: `Task in-charge assigned for ${body.data.title}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'assign assignee')
    }
  }

  return {
    create,
    update,
    destroy,
    restore,
    syncTeams,
    assignToUser,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
