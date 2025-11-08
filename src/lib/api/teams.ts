import api from './request'
import { handleApiError } from '../handle-api-error'
import type { SortDirection } from '../types/ui'
import type {
  Team,
  TeamAddMember,
  TeamAddMembersBulk,
  TeamCreate,
  TeamRemoveMembersBulk,
  TeamUpdate,
} from '../types/team'
import {
  type TeamAddMemberReponse,
  type PaginatedResponse,
  type ShowTeamResponse,
  type SoftDeleteStatus,
  type TeamCreateResponse,
  type TeamDeleteResponse,
  type TeamRestoreResponse,
  type TeamUpdateResponse,
  type TeamRemoveMembersBulkResponse,
  type TeamRemoveMemberResponse,
} from '../types/response'

export interface FetchTeamsParams {
  page?: number
  per_page?: number
  name?: string
  has_leader?: boolean
  sort?: string
  direction?: SortDirection
  status?: SoftDeleteStatus
}

export class TeamNotFoundError extends Error {}

export async function fetchTeams(params: FetchTeamsParams) {
  return api
    .get<PaginatedResponse<Team>>(`/teams`, {
      params: params,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function createTeam(data: TeamCreate) {
  return api.post<TeamCreateResponse>('/teams', data).catch((error) => {
    throw handleApiError(error)
  })
}

export async function updateTeam(teamId: number, data: TeamUpdate) {
  return api
    .put<TeamUpdateResponse>(`/teams/${teamId}`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function showTeam(teamId: number) {
  return api
    .get<ShowTeamResponse>(`/teams/${teamId}`)
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function deleteTeam(teamId: number) {
  return api.delete<TeamDeleteResponse>(`/teams/${teamId}`).catch((error) => {
    throw handleApiError(error)
  })
}

export async function restoreTeam(teamId: number) {
  return api
    .post<TeamRestoreResponse>(`/teams/${teamId}/restore`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function addTeamMember(teamId: number, data: TeamAddMember) {
  return api
    .post<TeamAddMemberReponse>(`/teams/${teamId}/members`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function addTeamMembersBulk(
  teamId: number,
  data: TeamAddMembersBulk,
) {
  return api
    .post<TeamAddMemberReponse>(`/teams/${teamId}/members/bulk`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function removeTeamMember(teamId: number, userId: number) {
  return api
    .delete<TeamRemoveMemberResponse>(`/teams/${teamId}/members/${userId}`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function removeTeamMembersBulk(
  teamId: number,
  data: TeamRemoveMembersBulk,
) {
  return api
    .delete<TeamRemoveMembersBulkResponse>(`/teams/${teamId}/members`, {
      data,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}
