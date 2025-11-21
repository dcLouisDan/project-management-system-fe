import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { showTeam } from '../api/teams'

export const showTeamQueryOptions = (teamId: number) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TEAMS, teamId],
    queryFn: () => showTeam(teamId),
  })
