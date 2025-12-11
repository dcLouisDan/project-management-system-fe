import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { activityLogsQueryOptions } from '@/lib/query-options/activity-logs-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import ActivityLogTableFilters from './-table/activity-log-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import useAppStore from '@/integrations/zustand/app-store'

const PAGE_TITLE = 'Activity Logs'
const PAGE_DESCRIPTION = 'View system activity and audit logs'

export interface ActivityLogsIndexSearchParams {
  page?: number
  per_page?: number
  user_id?: number
  action?: string
  auditable_type?: string
  auditable_id?: number
  description?: string
  sort?: string
  direction?: SortDirection
}

export const Route = createFileRoute('/_main/activity-logs/')({
  component: RouteComponent,
  validateSearch: (search) => search as ActivityLogsIndexSearchParams,
  beforeLoad: async () => {
    const { uiMode } = useAppStore.getState()
    if (uiMode !== 'admin') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
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
  const { page, per_page, user_id, action, auditable_type, auditable_id, description, sort, direction } =
    Route.useSearch()
  const navigate = useNavigate()

  const { data, isFetching } = useQuery(
    activityLogsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      user_id: user_id,
      action: action ?? '',
      autitable_type: auditable_type ?? '',
      autitable_id: auditable_id,
      description: description ?? '',
      sort: sort,
      direction: direction,
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev: ActivityLogsIndexSearchParams) => ({
        ...prev,
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: ActivityLogsIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Activity Logs', href: '/activity-logs' }]}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <ActivityLogTableFilters />
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
    </MainInsetLayout>
  )
}

