import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import UsersTableFilters from './-table/user-table-filters'
import type { SortDirection } from '@/lib/types/ui'

export interface UsersIndexSearchParams {
  page?: number
  per_page?: number
  name?: string
  role?: string
  roles?: string[]
  sort?: string
  direction?: SortDirection
}

export const Route = createFileRoute('/_main/users/')({
  component: RouteComponent,
  validateSearch: (search) => search as UsersIndexSearchParams,
})

function RouteComponent() {
  const { page, per_page, name, role, roles, sort, direction } =
    Route.useSearch()
  const { data, isFetching } = useQuery(
    usersQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      role: role ?? '',
      roles: roles ? roles.join(',') : '',
      sort: sort,
      direction: direction,
    }),
  )

  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Users', href: '/users' }]}>
      <h3>Manage Users</h3>
      <UsersTableFilters />
      <DataTable
        columns={columns}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && <PaginationBar pagination={data?.meta!} />}
    </MainInsetLayout>
  )
}
