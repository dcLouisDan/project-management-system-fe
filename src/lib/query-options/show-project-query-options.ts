import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'
import { showProject } from '../api/projects'

export const showProjectQueryOptions = (projectId: number) =>
  queryOptions({
    queryKey: [QUERY_KEYS.PROJECTS, projectId],
    queryFn: () => showProject(projectId),
  })
