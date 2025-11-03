import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { fetchUsers } from '../api/users'
import type { PaginatedResponse } from '../types/response'
import type { User } from '../types/user'

export const usersQueryOptions = (page: number, per_page: number = 10) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS, page, per_page],
    queryFn: async () => {
      const response = await fetchUsers(page, per_page)
      return response.data as PaginatedResponse<User>
    },
  })
