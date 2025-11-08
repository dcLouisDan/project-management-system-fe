import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { showTeam } from '../api/teams'

export const showTeamQueryOptions = (teamId: number) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USERS, teamId],
    queryFn: () => showTeam(teamId),
  })
