import { truncateText } from '@/lib/string-utils'
import type { Project } from '@/lib/types/project'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

export const columns: ColumnDef<Project>[] = [
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
    accessorKey: 'created_at',
    header: 'Created at',
    accessorFn: (row) => {
      return dayjs().to(row.created_at)
    },
  },
]
