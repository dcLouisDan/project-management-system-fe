import { DataTable } from '@/components/data-table'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { FetchTasksParams } from '@/lib/api/tasks'
import { tasksQueryOptions } from '@/lib/query-options/tasks-query-options'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { taskColumns } from './task-columns'
import { myProjectTaskColumns } from '@/routes/_main/projects/my-projects/-table/my-project-task-columns'
import StatePaginationBar from '@/components/state-pagination-bar'
import ProjectTasksTableFilters from './project-tasks-table-filters'
import usePermissions from '@/hooks/use-permissions'

interface ProjectTasksCardProps {
  projectId: string
}

export default function ProjectTasksCard({ projectId }: ProjectTasksCardProps) {
  const [fetchParams, setFetchParams] = useState<FetchTasksParams>({
    project_id: Number(projectId),
    page: 1,
    per_page: 10,
  })
  const { data: tasks, isFetching } = useQuery(tasksQueryOptions(fetchParams))
  const { canCreateTasks } = usePermissions()
  const currentPath = useLocation().pathname
  const columnsDef = useMemo(() => {
    if (currentPath.includes('/my-projects/')) {
      return myProjectTaskColumns
    }
    return taskColumns
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          Manage tasks required to finish this project.
        </CardDescription>
        {canCreateTasks && (
          <CardAction>
            <Link
              to="/projects/$projectId/tasks/create"
              params={{ projectId }}
              className={buttonVariants()}
            >
              <Plus /> Create Task
            </Link>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ProjectTasksTableFilters
          params={fetchParams}
          setParams={setFetchParams}
        />
        <DataTable
          data={tasks?.data || []}
          columns={columnsDef}
          isFetching={isFetching}
        />
      </CardContent>
      <CardFooter>
        {tasks && (
          <StatePaginationBar
            pagination={tasks.meta}
            onPageChange={(page) =>
              setFetchParams((params) => ({ ...params, page }))
            }
          />
        )}
      </CardFooter>
    </Card>
  )
}
