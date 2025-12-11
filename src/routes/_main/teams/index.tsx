import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { teamsQueryOptions } from '@/lib/query-options/teams-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import TeamsTableFilters from './-table/team-table-filters'
import type { SortDirection } from '@/lib/types/ui'
import { buttonVariants } from '@/components/ui/button'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columnsDeleted } from './-table/columns-deleted'
import { usePermissions } from '@/hooks/use-permissions'
import { Trash2, Users } from 'lucide-react'

const PAGE_TITLE = 'Manage Teams'
const PAGE_DESCRIPTION = 'Create, view, update or delete team records'

type TabValues = 'active' | 'deleted'
export interface TeamsIndexSearchParams {
  page?: number
  per_page?: number
  name?: string
  sort?: string
  direction?: SortDirection
  tab?: TabValues
}

export const Route = createFileRoute('/_main/teams/')({
  component: RouteComponent,
  validateSearch: (search) => search as TeamsIndexSearchParams,
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
  const { canCreateTeams, canDeleteTeams } = usePermissions()

  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Teams', href: '/teams' }]}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
        {canCreateTeams && (
          <Link to="/teams/create" className={buttonVariants()}>
            Add New Team
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
          {canDeleteTeams && (
            <TabsTrigger value="deleted">
              <Trash2 /> Deleted
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="active">
          <ActiveTeams />
        </TabsContent>
        {canDeleteTeams && (
          <TabsContent value="deleted">
            <DeletedTeams />
          </TabsContent>
        )}
      </Tabs>
    </MainInsetLayout>
  )
}

function DeletedTeams() {
  const { page, per_page, name, sort, direction } = Route.useSearch()
  const navigate = useNavigate()
  const { data, isFetching } = useQuery(
    teamsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
      delete_status: 'deleted',
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev: TeamsIndexSearchParams) => ({
        ...prev,
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: TeamsIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <>
      <TeamsTableFilters />
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

function ActiveTeams() {
  const { page, per_page, name, sort, direction } = Route.useSearch()
  const navigate = useNavigate()
  const { data, isFetching } = useQuery(
    teamsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev: TeamsIndexSearchParams) => ({
        ...prev,
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: TeamsIndexSearchParams) => ({
    ...prev,
    page,
  })

  return (
    <>
      <TeamsTableFilters />
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
