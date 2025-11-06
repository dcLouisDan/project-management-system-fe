import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { showUser } from '../api/users'

export const showUserQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS, userId],
    queryFn: () => showUser(userId),
  })
