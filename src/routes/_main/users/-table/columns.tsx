import { RoleDisplayNames, validateRoleString } from '@/lib/types/role'
import type { User } from '@/lib/types/user'
import { type ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
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
