import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { showTask } from '../api/tasks'

export const showTaskQueryOptions = (taskId: number) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TASKS, taskId],
    queryFn: () => showTask(taskId),
  })
