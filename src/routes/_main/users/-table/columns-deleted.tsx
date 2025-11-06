import { RoleDisplayNames, validateRoleString } from '@/lib/types/role'
import type { User } from '@/lib/types/user'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

export const columnsDeleted: ColumnDef<User>[] = [
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
  {
    accessorKey: 'deleted_at',
    header: 'Deleted at',
    accessorFn: (row) => {
      return row.deleted_at ? dayjs().to(row.deleted_at) : null
    },
  },
]
