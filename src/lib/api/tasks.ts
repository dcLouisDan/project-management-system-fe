import api from './request'
import { handleApiError } from '../handle-api-error'
import type { SortDirection } from '../types/ui'
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  ShowTaskResponse,
  TaskCreateResponse,
  TaskDeleteResponse,
  TaskRestoreResponse,
  TaskUpdateResponse,
  TaskSyncRelations,
  TaskSyncRelationsResponse,
  TaskAssignToUser,
  TaskAssignToUserResponse,
  TaskStartResponse,
  TaskSubmit,
  TaskSubmitResponse,
  TaskReviewSubmit,
  TaskSubmitReviewResponse,
  TaskStartReviewResponse,
} from '../types/task'
import {
  type PaginatedResponse,
  type SoftDeleteStatus,
} from '../types/response'
import type { ProgressStatus } from '../types/status'
import type { PriorityLevel } from '../types/priority'

export interface FetchTasksParams {
  page?: number
  per_page?: number
  title?: string
  due_date?: string
  sort?: string
  status?: ProgressStatus
  priority?: PriorityLevel
  project_id?: number
  assigned_to_id?: number
  assigned_by_id?: number
  direction?: SortDirection
  delete_status?: SoftDeleteStatus
}

export class TaskNotFoundError extends Error {}

export async function fetchTasks(params: FetchTasksParams) {
  return api
    .get<PaginatedResponse<Task>>(`/tasks`, {
      params: params,
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function createTask(projectId: number, data: TaskCreate) {
  return api
    .post<TaskCreateResponse>(`/projects/${projectId}/tasks`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function updateTask(taskId: number, data: TaskUpdate) {
  return api
    .put<TaskUpdateResponse>(`/tasks/${taskId}`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function showTask(taskId: number) {
  return api
    .get<ShowTaskResponse>(`/tasks/${taskId}`)
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function deleteTask(taskId: number) {
  return api.delete<TaskDeleteResponse>(`/tasks/${taskId}`).catch((error) => {
    throw handleApiError(error)
  })
}

export async function restoreTask(taskId: number) {
  return api
    .post<TaskRestoreResponse>(`/tasks/${taskId}/restore`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function syncTeamsTask(taskId: number, data: TaskSyncRelations) {
  return api
    .post<TaskSyncRelationsResponse>(`/tasks/${taskId}/sync-relations`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function assignToUserTask(taskId: number, data: TaskAssignToUser) {
  return api
    .post<TaskAssignToUserResponse>(`/tasks/${taskId}/assign-user`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function startTask(taskId: number) {
  return api
    .post<TaskStartResponse>(`/tasks/${taskId}/start`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function submitTask(taskId: number, data: TaskSubmit) {
  return api
    .post<TaskSubmitResponse>(`/tasks/${taskId}/submit`, data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function startReviewTask(taskId: number, reviewId: number) {
  return api
    .post<TaskStartReviewResponse>(`/tasks/${taskId}/reviews/${reviewId}/start`)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export async function submitReviewTask(
  taskId: number,
  reviewId: number,
  data: TaskReviewSubmit,
) {
  return api
    .post<TaskSubmitReviewResponse>(
      `/tasks/${taskId}/reviews/${reviewId}/submit`,
      data,
    )
    .catch((error) => {
      throw handleApiError(error)
    })
}
