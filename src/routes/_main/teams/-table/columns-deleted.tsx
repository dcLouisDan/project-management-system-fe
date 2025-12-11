import { truncateText } from '@/lib/string-utils'
import type { Team } from '@/lib/types/team'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from '@/lib/dayjs'

export const columnsDeleted: ColumnDef<Team>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const team = row.original
      return (
        <Link
          className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
          to="/teams/$teamId"
          params={{ teamId: team.id.toString() }}
        >
          {team.name}
        </Link>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    accessorFn: (team) => truncateText(team.description),
  },
  {
    accessorKey: 'deleted_at',
    header: 'Deleted at',
    accessorFn: (row) => {
      return row.deleted_at ? dayjs().to(row.deleted_at) : null
    },
  },
]
