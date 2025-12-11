import { truncateText } from '@/lib/string-utils'
import type { Project } from '@/lib/types/project'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from '@/lib/dayjs'

export const columnsDeleted: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const project = row.original
      return (
        <Link
          className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
          to="/projects/$projectId"
          params={{ projectId: project.id.toString() }}
        >
          {project.name}
        </Link>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    accessorFn: (project) => truncateText(project.description),
  },
  {
    accessorKey: 'deleted_at',
    header: 'Deleted at',
    accessorFn: (row) => {
      return row.deleted_at ? dayjs().to(row.deleted_at) : null
    },
  },
]
