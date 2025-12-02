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

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  users: {
    total: 0,
    active: 0,
    deleted: 0,
    by_role: {
      admin: 0,
      project_manager: 0,
      team_lead: 0,
      team_member: 0,
    },
  },
  teams: {
    total: 0,
    with_lead: 0,
    without_lead: 0,
    active: 0,
  },
  projects: {
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    by_status: {
      not_started: 0,
      in_progress: 0,
      awaiting_review: 0,
      under_review: 0,
      completed: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      assigned: 0,
      on_hold: 0,
    },
  },
  tasks: {
    total: 0,
    pending: 0,
    in_progress: 0,
    awaiting_review: 0,
    completed: 0,
    overdue: 0,
    by_priority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    },
    by_status: {
      not_started: 0,
      in_progress: 0,
      awaiting_review: 0,
      under_review: 0,
      completed: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      assigned: 0,
      on_hold: 0,
    },
  },
}

export type DashboardStatsResponse = ApiResponse<DashboardStats>
export type DashboardRecentProjectsResponse = ApiResponse<Project[]>
export type DashboardRecentTasksResponse = ApiResponse<Task[]>
