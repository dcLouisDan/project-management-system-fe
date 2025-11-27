import api from './request'
import { handleApiError } from '../handle-api-error'
import type { SortDirection } from '../types/ui'
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ShowProjectResponse,
  ProjectCreateResponse,
  ProjectDeleteResponse,
  ProjectRestoreResponse,
  ProjectUpdateResponse,
  ProjectSyncTeams,
  ProjectSyncTeamsResponse,
  ProjectAssignManagerResponse,
  ProjectAssignManager,
} from '../types/project'
import {
  type PaginatedResponse,
  type SoftDeleteStatus,
} from '../types/response'
import type { ProgressStatus } from '../types/status'

export interface FetchProjectsParams {
  page?: number
  per_page?: number
  name?: string
  start_date?: string
  due_date?: string
  sort?: string
  direction?: SortDirection
  delete_status?: SoftDeleteStatus
  manager_id?: number
  start_date_from?: string
  start_date_to?: string
  due_date_from?: string
  due_date_to?: string
  member_id?: number
  team_id?: number
  status?: ProgressStatus
}

export class ProjectNotFoundError extends Error {}

export async function fetchProjects(params: FetchProjectsParams) {
  return api
    .get<PaginatedResponse<Project>>(`/projects`, {
      params: params,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function createProject(data: ProjectCreate) {
  return api.post<ProjectCreateResponse>('/projects', data).catch((error) => {
    throw handleApiError(error)
  })
}

export async function updateProject(projectId: number, data: ProjectUpdate) {
  return api
    .put<ProjectUpdateResponse>(`/projects/${projectId}`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function showProject(projectId: number) {
  return api
    .get<ShowProjectResponse>(`/projects/${projectId}`)
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function deleteProject(projectId: number) {
  return api
    .delete<ProjectDeleteResponse>(`/projects/${projectId}`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function restoreProject(projectId: number) {
  return api
    .post<ProjectRestoreResponse>(`/projects/${projectId}/restore`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function syncTeamsProject(
  projectId: number,
  data: ProjectSyncTeams,
) {
  return api
    .post<ProjectSyncTeamsResponse>(`/projects/${projectId}/teams/sync`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function assignManagerProject(
  projectId: number,
  data: ProjectAssignManager,
) {
  return api
    .post<ProjectAssignManagerResponse>(`/projects/${projectId}/manager`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}
