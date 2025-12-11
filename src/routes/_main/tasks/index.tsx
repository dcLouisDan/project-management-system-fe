import { createFileRoute, useNavigate } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { tasksQueryOptions } from '@/lib/query-options/tasks-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import TaskTableFilters from './-table/task-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import { ListTodo, Trash2 } from 'lucide-react'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columnsDeleted } from './-table/columns-deleted'
import type { ProgressStatus } from '@/lib/types/status'
import type { PriorityLevel } from '@/lib/types/priority'
import { usePermissions } from '@/hooks/use-permissions'

const PAGE_TITLE = 'Manage Tasks'
const PAGE_DESCRIPTION = 'View and manage all tasks across projects'

type TabValues = 'active' | 'deleted'
export interface TasksIndexSearchParams {
  page?: number
  per_page?: number
  title?: string
  status?: ProgressStatus
  priority?: PriorityLevel
  sort?: string
  direction?: SortDirection
  tab?: TabValues
}

export const Route = createFileRoute('/_main/tasks/')({
  component: RouteComponent,
  validateSearch: (search) => search as TasksIndexSearchParams,
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
  const { canDeleteTasks } = usePermissions()

  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Tasks', href: '/tasks' }]}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <Tabs
        defaultValue="active"
        value={tab}
        onValueChange={(value) =>
          navigate({ to: '.', search: { tab: value as TabValues } })
        }
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="active">
            <ListTodo /> Active
          </TabsTrigger>
          {canDeleteTasks && (
            <TabsTrigger value="deleted">
              <Trash2 />
              Deleted
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="active">
          <ActiveTasks />
        </TabsContent>
        {canDeleteTasks && (
          <TabsContent value="deleted">
            <DeletedTasks />
          </TabsContent>
        )}
      </Tabs>
    </MainInsetLayout>
  )
}

function DeletedTasks() {
  const { page, per_page, title, status, priority, sort, direction } =
    Route.useSearch()
  const navigate = useNavigate()
  const { data, isFetching } = useQuery(
    tasksQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      title: title ?? '',
      status: status,
      priority: priority,
      sort: sort,
      direction: direction,
      delete_status: 'deleted',
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...(prev as TasksIndexSearchParams),
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: TasksIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <>
      <TaskTableFilters />
      <DataTable
        columns={columnsDeleted}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar
          className="mt-2"
          pagination={data?.meta!}
          onPerPageChange={handlePerPageChange}
          getPageSearchParams={getPageSearchParams}
        />
      )}
    </>
  )
}

function ActiveTasks() {
  const { page, per_page, title, status, priority, sort, direction } =
    Route.useSearch()
  const navigate = useNavigate()
  const { data, isFetching } = useQuery(
    tasksQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      title: title ?? '',
      status: status,
      priority: priority,
      sort: sort,
      direction: direction,
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...(prev as TasksIndexSearchParams),
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: TasksIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <>
      <TaskTableFilters />
      <DataTable
        columns={columns}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar
          className="mt-2"
          pagination={data?.meta!}
          onPerPageChange={handlePerPageChange}
          getPageSearchParams={getPageSearchParams}
        />
      )}
    </>
  )
}
