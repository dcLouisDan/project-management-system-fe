import dayjs from '@/lib/dayjs'
import type { ApiResponse } from './response'
import type { ProgressStatus } from './status'
import type { Team } from './team'
import type { User } from './user'

export interface Project {
  id: number
  name: string
  description?: string
  manager?: User
  teams: Team[]
  status: ProgressStatus
  start_date: string
  due_date?: string | null
  is_overdue: boolean
  tasks_count: number
  completed_tasks_count: number
  teams_count: number
  created_at: string
  updated_at?: string
  deleted_at?: string | null
}
export const SORTABLE_PROJECT_FIELDS: string[] = [
  'id',
  'name',
  'start_date',
  'due_date',
  'created_at',
]

export interface ProjectCreate {
  name: string
  description?: string
  status: ProgressStatus
  start_date: string
  due_date?: string
}

export interface ProjectUpdate extends ProjectCreate {}

export interface ProjectSyncTeams {
  team_ids: number[]
}

export interface ProjectAssignManager {
  manager_id?: number
}

export const DEFAULT_PROJECT_SYNC_TEAMS: ProjectSyncTeams = {
  team_ids: [],
}

export const DEFAULT_PROJECT_CREATE: ProjectCreate = {
  name: '',
  description: '',
  status: 'not_started',
  start_date: dayjs().format('YYYY-MM-DD'),
}

export const DEFAULT_ASSIGN_MANAGER: ProjectAssignManager = {
  manager_id: undefined,
}

export type ShowProjectResponse = { data: Project }
export type ProjectCreateResponse = ApiResponse<Project>
export type ProjectRestoreResponse = ApiResponse<Project>
export type ProjectUpdateResponse = ApiResponse<Project>
export type ProjectDeleteResponse = ApiResponse<null>
export type ProjectSyncTeamsResponse = ApiResponse<Project>
export type ProjectAssignManagerResponse = ApiResponse<Project>
