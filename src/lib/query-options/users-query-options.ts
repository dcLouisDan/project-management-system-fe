import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { checkAdminExists, fetchUsers, type FetchUsersParams } from '../api/users'

export const usersQueryOptions = (params: FetchUsersParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchUsers(params)
      return response.data
    },
    placeholderData: keepPreviousData,
  })

export const checkAdminExistsQueryOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEYS.CHECK_ADMIN_EXISTS],
    queryFn: async () => {
      return await checkAdminExists()
    },
  })
