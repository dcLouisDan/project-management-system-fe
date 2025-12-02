import { handleApiError } from '../handle-api-error'
import type { ActivityLog } from '../types/activity-log'
import type { PaginatedResponse } from '../types/response'
import type { SortDirection } from '../types/ui'
import api from './request'

export interface FetchActivityLogsParams {
  page?: number
  per_page?: number
  user_id?: number
  action?: string
  auditable_type?: string
  auditable_id?: number
  description?: string
  sort?: string
  direction?: SortDirection
  date_from?: string
  date_to?: string
}

export async function fetchActivityLogs(params: FetchActivityLogsParams) {
  return api
    .get<PaginatedResponse<ActivityLog>>('/activity-logs', { params })
    .catch((error) => {
      throw handleApiError(error)
    })
}
