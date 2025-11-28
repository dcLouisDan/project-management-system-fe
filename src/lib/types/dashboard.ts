import type { ProgressStatus } from './status'
import type { PriorityLevel } from './priority'
import type { ApiResponse } from './response'
import type { Project } from './project'
import type { Task } from './task'

export interface DashboardStats {
  users: {
    total: number
    active: number
    deleted: number
    by_role: {
      admin: number
      project_manager: number
      team_lead: number
      team_member: number
    }
  }
  teams: {
    total: number
    with_lead: number
    without_lead: number
    active: number
  }
  projects: {
    total: number
    active: number
    completed: number
    cancelled: number
    overdue: number
    by_status: Record<ProgressStatus, number>
  }
  tasks: {
    total: number
    pending: number
    in_progress: number
    awaiting_review: number
    completed: number
    overdue: number
    by_priority: Record<PriorityLevel, number>
    by_status: Record<ProgressStatus, number>
  }
}

export type DashboardStatsResponse = ApiResponse<DashboardStats>
export type DashboardRecentProjectsResponse = ApiResponse<Project[]>
export type DashboardRecentTasksResponse = ApiResponse<Task[]>
