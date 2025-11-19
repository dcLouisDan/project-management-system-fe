import type { PriorityLevel } from './priority'
import type { ProjectRelation } from './project-relations'
import type { ApiResponse } from './response'
import type { ProgressStatus } from './status'
import type { User } from './user'

export interface Task {
  id: number
  project_id: number
  assigned_to?: User
  assigned_by?: User
  title: string
  description: string
  status: ProgressStatus
  priority: PriorityLevel
  due_date?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface TaskCreate {
  title: string
  description?: string
  priority: PriorityLevel
  due_date?: string
}

export const DEFAULT_TASK_CREATE: TaskCreate = {
  title: '',
  description: '',
  priority: 'low',
  due_date: undefined,
}

export interface TaskUpdate extends TaskCreate {}

export interface TaskSyncRelationItem {
  id: number
  relation_type: ProjectRelation
}

export interface TaskSyncRelations {
  tasks?: TaskSyncRelationItem[]
  milestones?: TaskSyncRelationItem[]
}

export const DEFAULT_TASK_SYNC_RELATIONS: TaskSyncRelations = {
  tasks: [],
  milestones: [],
}

export interface TaskAssignToUser {
  assign_to?: number
}

export const DEFAULT_TASK_ASSIGN_TO_USER: TaskAssignToUser = {
  assign_to: undefined,
}

export type ShowTaskResponse = { data: Task }
export type TaskCreateResponse = ApiResponse<Task>
export type TaskRestoreResponse = ApiResponse<Task>
export type TaskUpdateResponse = ApiResponse<Task>
export type TaskDeleteResponse = ApiResponse<null>
export type TaskSyncRelationsResponse = ApiResponse<Task>
export type TaskAssignToUserResponse = ApiResponse<Task>
