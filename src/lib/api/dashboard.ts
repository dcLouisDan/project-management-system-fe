import api from './request'
import { handleApiError } from '../handle-api-error'
import type {
  DashboardStatsResponse,
  DashboardRecentProjectsResponse,
  DashboardRecentTasksResponse,
} from '../types/dashboard'

export async function fetchDashboardStats() {
  return api
    .get<DashboardStatsResponse>('/dashboard/stats')
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export interface FetchRecentProjectsParams {
  limit?: number
}

export async function fetchRecentProjects(params?: FetchRecentProjectsParams) {
  return api
    .get<DashboardRecentProjectsResponse>('/dashboard/recent-projects', {
      params,
    })
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}

export interface FetchRecentTasksParams {
  limit?: number
}

export async function fetchRecentTasks(params?: FetchRecentTasksParams) {
  return api
    .get<DashboardRecentTasksResponse>('/dashboard/recent-tasks', {
      params,
    })
    .then((response) => response.data.data)
    .catch((error) => {
      throw handleApiError(error)
    })
}
