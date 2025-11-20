import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { fetchTasks, type FetchTasksParams } from '../api/tasks'

export const tasksQueryOptions = (params: FetchTasksParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchTasks(params)
      return response.data
    },
    placeholderData: keepPreviousData,
  })
