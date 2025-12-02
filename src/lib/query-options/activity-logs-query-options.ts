import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import {
  fetchActivityLogs,
  type FetchActivityLogsParams,
} from '../api/activity-logs'

export const activityLogsQueryOptions = (params: FetchActivityLogsParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.ACTIVITY_LOGS].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchActivityLogs(params)
      return response.data
    },
    placeholderData: keepPreviousData,
  })
