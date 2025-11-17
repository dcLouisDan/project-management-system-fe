import {
  assignManagerProject,
  createProject,
  deleteProject,
  restoreProject,
  syncTeamsProject,
  updateProject,
} from '@/lib/api/projects'
import { QUERY_KEYS } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import type { RequestProgress } from '@/lib/types/response'
import type {
  ProjectAssignManager,
  ProjectCreate,
  ProjectSyncTeams,
  ProjectUpdate,
} from '@/lib/types/project'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export default function useManageProjects() {
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
    resource: string = 'Project',
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

  async function create(data: ProjectCreate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await createProject(data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      })
      toast.success('Project Created', {
        description: `New project record created for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'create')
    }
  }

  async function update(projectId: number, data: ProjectUpdate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await updateProject(projectId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      })
      navigate({
        to: '/projects/$projectId',
        params: { projectId: projectId.toString() },
      })
      toast.success('Project Updated', {
        description: `Project record updated for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'update')
    }
  }

  async function destroy(projectId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await deleteProject(projectId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      })
      navigate({
        to: '/projects',
      })
      toast.success('Project Deleted', {
        description: `Successfully deleted project.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'delete')
    }
  }

  async function restore(projectId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await restoreProject(projectId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      })
      toast.success('Project Restored', {
        description: `Successfully restored project.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'restore')
    }
  }

  async function syncTeams(projectId: number, data: ProjectSyncTeams) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await syncTeamsProject(projectId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS, projectId],
      })
      navigate({
        to: '/projects/$projectId',
        params: { projectId: projectId.toString() },
      })
      toast.success('Project Updated', {
        description: `Project teams synced for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'sync teams')
    }
  }

  async function assignManager(projectId: number, data: ProjectAssignManager) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await assignManagerProject(projectId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS, projectId],
      })
      navigate({
        to: '/projects/$projectId',
        params: { projectId: projectId.toString() },
      })
      toast.success('Project Updated', {
        description: `Project manager assigned for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'assign manager')
    }
  }

  return {
    create,
    update,
    destroy,
    restore,
    syncTeams,
    assignManager,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
