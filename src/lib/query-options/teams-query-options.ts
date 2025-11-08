import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { fetchTeams, type FetchTeamsParams } from '../api/teams'

export const teamsQueryOptions = (params: FetchTeamsParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchTeams(params)
      return response.data
    },
    placeholderData: keepPreviousData,
  })
