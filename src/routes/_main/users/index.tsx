import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import UsersTableFilters from './-table/user-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import { buttonVariants } from '@/components/ui/button'
import { UserPlus, Users, UserX } from 'lucide-react'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columnsDeleted } from './-table/columns-deleted'
import { usePermissions } from '@/hooks/use-permissions'

const PAGE_TITLE = 'Manage Users'
const PAGE_DESCRIPTION = 'Create, view, update or delete user records'

type TabValues = 'active' | 'deleted'
export interface UsersIndexSearchParams {
  page?: number
  per_page?: number
  name?: string
  role?: string
  roles?: string[]
  sort?: string
  direction?: SortDirection
  tab?: TabValues
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
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  const { canCreateUsers, canDeleteUsers } = usePermissions()

  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Users', href: '/users' }]}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
        {canCreateUsers && (
          <Link to="/users/create" className={buttonVariants()}>
            <UserPlus />
            Add New User
          </Link>
        )}
      </PageHeader>
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
            <Users /> Active
          </TabsTrigger>
          {canDeleteUsers && (
            <TabsTrigger value="deleted">
              <UserX />
              Deleted
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="active">
          <ActiveUsers />
        </TabsContent>
        {canDeleteUsers && (
          <TabsContent value="deleted">
            <DeletedUsers />
          </TabsContent>
        )}
      </Tabs>
    </MainInsetLayout>
  )
}

function DeletedUsers() {
  const { page, per_page, name, role, roles, sort, direction } =
    Route.useSearch()
  const navigate = useNavigate()
  const { data, isFetching } = useQuery(
    usersQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      role: role ?? '',
      roles: roles ? roles.join(',') : '',
      sort: sort,
      direction: direction,
      delete_status: 'deleted',
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...(prev as UsersIndexSearchParams),
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: UsersIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <>
      <UsersTableFilters />
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

function ActiveUsers() {
  const { page, per_page, name, role, roles, sort, direction } =
    Route.useSearch()
  const navigate = useNavigate()
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

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...(prev as UsersIndexSearchParams),
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: UsersIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <>
      <UsersTableFilters />
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
