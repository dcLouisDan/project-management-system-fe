import { createFileRoute, Link } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import UsersTableFilters from './-table/user-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import { buttonVariants } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'

const PAGE_TITLE = 'Manage Users'
const PAGE_DESCRIPTION = 'Create, view, update or delete user records'
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
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
        <Link to="/users/create" className={buttonVariants()}>
          <UserPlus />
          Add New User
        </Link>
      </PageHeader>
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
