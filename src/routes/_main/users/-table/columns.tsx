import { RoleDisplayNames, validateRoleString } from '@/lib/types/role'
import type { User } from '@/lib/types/user'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original
      return (
        <Link
          className="underline hover:font-bold"
          to="/users/$userId"
          params={{ userId: user.id.toString() }}
        >
          {user.name}
        </Link>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) =>
      row.original.roles
        .map((role) => (validateRoleString(role) ? RoleDisplayNames[role] : ''))
        .join(', '),
  },
]
