import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { columns } from './-table/columns'
import PaginationBar from '@/components/pagination-bar'
import DebouncedInput from '@/components/debounced-input'

export const Route = createFileRoute('/_main/users')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      page?: number
      per_page?: number
      name?: string
    },
  loaderDeps: ({ search: { page, per_page } }) => ({
    page,
    per_page,
  }),
  loader: async ({ deps: { page, per_page }, context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions(page ?? 1, per_page ?? 10)),
})

function RouteComponent() {
  const { page, per_page, name } = Route.useSearch()
  const { data } = useSuspenseQuery(
    usersQueryOptions(page ?? 1, per_page ?? 10, name ?? ''),
  )
  const navigate = Route.useNavigate()
  const setName = (newName: string | number) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        name: newName.toString(),
        page: 1, // Reset to first page when name filter changes
      }),
    })
  }
  console.log('Users data:', data)
  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Users', href: '/users' }]}>
      <h3>Manage Users</h3>
      <div>
        <DebouncedInput
          value={name ?? ''}
          onChange={setName}
          placeholder="Search users..."
          debounce={1000}
        />
      </div>
      <DataTable columns={columns} data={data?.data || []} />
      <PaginationBar pagination={data?.meta!} />
    </MainInsetLayout>
  )
}
