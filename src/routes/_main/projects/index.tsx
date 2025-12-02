import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { projectsQueryOptions } from '@/lib/query-options/projects-query-options'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import type { SortDirection } from '@/lib/types/ui'
import { buttonVariants } from '@/components/ui/button'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columnsDeleted } from './-table/columns-deleted'
import ProjectsTableFilters from './-table/project-table-filters'
import { usePermissions } from '@/hooks/use-permissions'
import { ClipboardList, Trash2 } from 'lucide-react'

const PAGE_TITLE = 'Manage Projects'
const PAGE_DESCRIPTION = 'Create, view, update or delete project records'

type TabValues = 'active' | 'deleted'
export interface ProjectsIndexSearchParams {
  page?: number
  per_page?: number
  name?: string
  sort?: string
  direction?: SortDirection
  tab?: TabValues
}

export const Route = createFileRoute('/_main/projects/')({
  component: RouteComponent,
  validateSearch: (search) => search as ProjectsIndexSearchParams,
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
  const { canCreateProjects, canDeleteProjects } = usePermissions()

  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'Projects', href: '/projects' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
        {canCreateProjects && (
          <Link to="/projects/create" className={buttonVariants()}>
            Add New Project
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
            <ClipboardList /> Active
          </TabsTrigger>
          {canDeleteProjects && (
            <TabsTrigger value="deleted">
              <Trash2 /> Deleted
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="active">
          <ActiveProjects />
        </TabsContent>
        {canDeleteProjects && (
          <TabsContent value="deleted">
            <DeletedProjects />
          </TabsContent>
        )}
      </Tabs>
    </MainInsetLayout>
  )
}

function DeletedProjects() {
  const { page, per_page, name, sort, direction } = Route.useSearch()
  const { data, isFetching } = useQuery(
    projectsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
      delete_status: 'deleted',
    }),
  )
  return (
    <>
      <ProjectsTableFilters />
      <DataTable
        columns={columnsDeleted}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar className="mt-2" pagination={data?.meta!} />
      )}
    </>
  )
}

function ActiveProjects() {
  const { page, per_page, name, sort, direction } = Route.useSearch()
  const { data, isFetching } = useQuery(
    projectsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
    }),
  )
  return (
    <>
      <ProjectsTableFilters />
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
