import { createFileRoute, useNavigate } from '@tanstack/react-router'
import MainInsetLayout from '../../-main-inset-layout'
import { tasksQueryOptions } from '@/lib/query-options/tasks-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns, columnsAssignedByMe } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import TaskTableFilters from './-table/task-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import { ClipboardCheck, Send } from 'lucide-react'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProgressStatus } from '@/lib/types/status'
import type { PriorityLevel } from '@/lib/types/priority'
import useAppStore from '@/integrations/zustand/app-store'
import usePermissions from '@/hooks/use-permissions'

const PAGE_TITLE = 'My Tasks'
const PAGE_DESCRIPTION = 'View tasks assigned to you or delegated by you'

type TabValues = 'assigned_to_me' | 'assigned_by_me'
export interface MyTasksIndexSearchParams {
  page?: number
  per_page?: number
  title?: string
  status?: ProgressStatus
  priority?: PriorityLevel
  sort?: string
  direction?: SortDirection
  tab?: TabValues
}

export const Route = createFileRoute('/_main/tasks/my-tasks/')({
  component: RouteComponent,
  validateSearch: (search) => search as MyTasksIndexSearchParams,
  head: () => ({
    meta: [
      {
        title: PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
})

function RouteComponent() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  const { canReassignTasks } = usePermissions()
  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'My Tasks', href: '/tasks/my-tasks' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <Tabs
        defaultValue="assigned_to_me"
        value={tab}
        onValueChange={(value) =>
          navigate({ to: '.', search: { tab: value as TabValues } })
        }
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="assigned_to_me">
            <ClipboardCheck /> Assigned to Me
          </TabsTrigger>
          {canReassignTasks && (
            <TabsTrigger value="assigned_by_me">
              <Send />
              Assigned by Me
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="assigned_to_me">
          <AssignedToMeTasks />
        </TabsContent>
        {canReassignTasks && (
          <TabsContent value="assigned_by_me">
            <AssignedByMeTasks />
          </TabsContent>
        )}
      </Tabs>
    </MainInsetLayout>
  )
}

function AssignedToMeTasks() {
  const { page, per_page, title, status, priority, sort, direction } =
    Route.useSearch()
  const { user } = useAppStore((state) => state)

  const { data, isFetching } = useQuery(
    tasksQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      title: title ?? '',
      status: status,
      priority: priority,
      sort: sort,
      direction: direction,
      assigned_to_id: user?.id,
    }),
  )
  return (
    <>
      <TaskTableFilters />
      <DataTable
        columns={columns}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar className="mt-2" pagination={data?.meta!} />
      )}
    </>
  )
}

function AssignedByMeTasks() {
  const { page, per_page, title, status, priority, sort, direction } =
    Route.useSearch()
  const { user } = useAppStore((state) => state)

  const { data, isFetching } = useQuery(
    tasksQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      title: title ?? '',
      status: status,
      priority: priority,
      sort: sort,
      direction: direction,
      assigned_by_id: user?.id,
    }),
  )
  return (
    <>
      <TaskTableFilters />
      <DataTable
        columns={columnsAssignedByMe}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar className="mt-2" pagination={data?.meta!} />
      )}
    </>
  )
}
