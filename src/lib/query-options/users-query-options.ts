import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { fetchUsers, type FetchUsersParams } from '../api/users'
import type { PaginatedResponse } from '../types/response'
import type { User } from '../types/user'

export const usersQueryOptions = (params: FetchUsersParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchUsers(params)
      return response.data as PaginatedResponse<User>
    },
    placeholderData: keepPreviousData,
  })
