import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import {
  fetchDashboardStats,
  fetchRecentProjects,
  fetchRecentTasks,
  type FetchRecentProjectsParams,
  type FetchRecentTasksParams,
} from '../api/dashboard'

export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEYS.DASHBOARD, 'stats'],
    queryFn: fetchDashboardStats,
  })

export const recentProjectsQueryOptions = (params?: FetchRecentProjectsParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.DASHBOARD, 'recent-projects', params?.limit ?? 5],
    queryFn: () => fetchRecentProjects(params),
  })

export const recentTasksQueryOptions = (params?: FetchRecentTasksParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.DASHBOARD, 'recent-tasks', params?.limit ?? 5],
    queryFn: () => fetchRecentTasks(params),
  })

