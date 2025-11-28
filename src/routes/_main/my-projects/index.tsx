import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { projectsQueryOptions } from '@/lib/query-options/projects-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import ProjectTableFilters from './-table/project-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import useAppStore from '@/integrations/zustand/app-store'

const PAGE_TITLE = 'My Projects'
const PAGE_DESCRIPTION = 'View and manage projects you are managing'

export interface MyProjectsIndexSearchParams {
  page?: number
  per_page?: number
  name?: string
  sort?: string
  direction?: SortDirection
}

export const Route = createFileRoute('/_main/my-projects/')({
  component: RouteComponent,
  validateSearch: (search) => search as MyProjectsIndexSearchParams,
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
    projectsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
      manager_id: user?.id,
    }),
  )

  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'My Projects', href: '/my-projects' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <ProjectTableFilters />
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
