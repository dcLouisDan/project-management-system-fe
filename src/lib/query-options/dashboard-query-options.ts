import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import {
  fetchDashboardStats,
  fetchRecentProjects,
  fetchRecentTasks,
  type FetchDashboardStatsParams,
  type FetchRecentProjectsParams,
  type FetchRecentTasksParams,
} from '../api/dashboard'
import { DEFAULT_DASHBOARD_STATS } from '../types/dashboard'

export const dashboardStatsQueryOptions = (
  params?: FetchDashboardStatsParams,
) =>
  queryOptions({
    queryKey: [QUERY_KEYS.DASHBOARD, 'stats'].concat(
      Object.values(params ?? {}),
    ),
    queryFn: () => fetchDashboardStats(params),
    placeholderData: DEFAULT_DASHBOARD_STATS,
  })

export const recentProjectsQueryOptions = (
  params?: FetchRecentProjectsParams,
) =>
  queryOptions({
    queryKey: [QUERY_KEYS.DASHBOARD, 'recent-projects'].concat(
      Object.values(params ?? {}),
    ),
    queryFn: () => fetchRecentProjects(params),
  })

export const recentTasksQueryOptions = (params?: FetchRecentTasksParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.DASHBOARD, 'recent-tasks'].concat(
      Object.values(params ?? {}),
    ),
    queryFn: () => fetchRecentTasks(params),
  })
