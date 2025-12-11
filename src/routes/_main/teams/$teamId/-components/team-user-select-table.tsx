import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { RoleDisplayNames, validateRoleString } from '@/lib/types/role'
import type { User } from '@/lib/types/user'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import PaginationBar from '@/components/pagination-bar'
import TeamUsersTableFilters from './team-user-table-filters'
import { Button } from '@/components/ui/button'
import { Check, Plus } from 'lucide-react'
import { useMemo } from 'react'
import type { TeamUsersSelectSearchParams } from '../members'

interface TeamUserSelectTableProps {
  selectedIds?: number[]
  onUserSelect?: (user: User) => void
}

export default function TeamUserSelectTable({
  selectedIds = [],
  onUserSelect = () => {},
}: TeamUserSelectTableProps) {
  const { page, per_page, name, role, roles, sort, direction } = useSearch({
    from: '/_main/teams/$teamId/members' as any,
  })
  const navigate = useNavigate({ from: '/_main/teams/$teamId/members' as any })
  const { data, isFetching } = useQuery(
    usersQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      role: role ?? '',
      roles: roles ? roles.join(',') : 'team lead,team member,admin',
      sort: sort,
      direction: direction,
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev) => {
        const params = prev as TeamUsersSelectSearchParams
        return {
          ...params,
          per_page: perPage,
          page: 1,
        } as TeamUsersSelectSearchParams
      },
    })
  }

  const getPageSearchParams = (page: number) => (prev: TeamUsersSelectSearchParams) => ({
    ...prev,
    page,
  })

  const columns: ColumnDef<User>[] = useMemo(() => {
    return [
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const user = row.original

          const selected = selectedIds.includes(user.id)

          return (
            <Button
              disabled={selected}
              size="icon-sm"
              onClick={() => {
                onUserSelect(user)
              }}
            >
              {selected ? <Check /> : <Plus />}
            </Button>
          )
        },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const user = row.original
          return (
            <Link
              className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
              to="/users/$userId"
              params={{ userId: user.id.toString() }}
            >
              {user.name}
            </Link>
          )
        },
      },
      {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) =>
          row.original.roles
            .map((role) =>
              validateRoleString(role) ? RoleDisplayNames[role] : '',
            )
            .join(', '),
      },
    ]
  }, [selectedIds, onUserSelect])
  return (
    <div>
      {' '}
      <TeamUsersTableFilters />
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
    </div>
  )
}
