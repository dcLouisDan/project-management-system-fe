import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { teamsQueryOptions } from '@/lib/query-options/teams-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import TeamTableFilters from './-table/team-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import useAppStore from '@/integrations/zustand/app-store'

const PAGE_TITLE = 'My Teams'
const PAGE_DESCRIPTION = 'View and manage teams you lead'

export interface MyTeamsIndexSearchParams {
  page?: number
  per_page?: number
  name?: string
  sort?: string
  direction?: SortDirection
}

export const Route = createFileRoute('/_main/my-teams/')({
  component: RouteComponent,
  validateSearch: (search) => search as MyTeamsIndexSearchParams,
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
  const { page, per_page, name, sort, direction } = Route.useSearch()
  const { user } = useAppStore((state) => state)

  const { data, isFetching } = useQuery(
    teamsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
      lead_id: user?.id,
    }),
  )

  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'My Teams', href: '/my-teams' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <TeamTableFilters />
      <DataTable
        columns={columns}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar className="mt-2" pagination={data?.meta!} />
      )}
    </MainInsetLayout>
  )
}
