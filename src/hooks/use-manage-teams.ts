import {
  addTeamMembersBulk,
  createTeam,
  deleteTeam,
  removeTeamMembersBulk,
  restoreTeam,
  updateTeam,
} from '@/lib/api/teams'
import { QUERY_KEYS } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import type { RequestProgress } from '@/lib/types/response'
import type {
  TeamAddMember,
  TeamAddMembersBulk,
  TeamCreate,
  TeamRemoveMembersBulk,
  TeamUpdate,
} from '@/lib/types/team'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export default function useManageTeams() {
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
    resource: string = 'Team',
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

  async function create(data: TeamCreate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await createTeam(data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      toast.success('Team Created', {
        description: `New team record created for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'create')
    }
  }

  async function update(teamId: number, data: TeamUpdate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await updateTeam(teamId, data)
      const body = response.data

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      navigate({
        to: '/teams/$teamId',
        params: { teamId: teamId.toString() },
      })
      toast.success('Team Updated', {
        description: `Team record updated for ${body.data.name}`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'update')
    }
  }

  async function destroy(teamId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await deleteTeam(teamId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      navigate({
        to: '/teams',
      })
      toast.success('Team Deleted', {
        description: `Successfully deleted team.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'delete')
    }
  }

  async function restore(teamId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await restoreTeam(teamId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      toast.success('Team Restored', {
        description: `Successfully restored team.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'restore')
    }
  }

  async function addMember(teamId: number, data: TeamAddMember) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await addMember(teamId, data)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      toast.success('Team Restored', {
        description: `Successfully restored team.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'add', 'Team Member')
    }
  }

  async function addMembersBulk(teamId: number, data: TeamAddMembersBulk) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await addTeamMembersBulk(teamId, data)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      toast.success('Team Restored', {
        description: `Successfully restored team.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'add', 'Team members')
    }
  }

  async function removeMember(teamId: number, userId: number) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await removeMember(teamId, userId)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      toast.success('Team Restored', {
        description: `Successfully restored team.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'remove', 'Team Member')
    }
  }

  async function removeMembersBulk(
    teamId: number,
    data: TeamRemoveMembersBulk,
  ) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      await removeTeamMembersBulk(teamId, data)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS],
      })
      toast.success('Team Restored', {
        description: `Successfully restored team.`,
      })
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'remove', 'Team members')
    }
  }

  return {
    create,
    update,
    destroy,
    restore,
    addMember,
    addMembersBulk,
    removeMember,
    removeMembersBulk,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
