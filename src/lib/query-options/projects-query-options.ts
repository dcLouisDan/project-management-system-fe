import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { fetchProjects, type FetchProjectsParams } from '../api/projects'

export const projectsQueryOptions = (params: FetchProjectsParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.PROJECTS].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchProjects(params)
      return response.data
    },
    placeholderData: keepPreviousData,
  })
