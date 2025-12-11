import { Badge } from '@/components/ui/badge'
import { snakeCaseToTitleCase } from '@/lib/string-utils'
import { priorityColorMap } from '@/lib/types/priority'
import type { Task } from '@/lib/types/task'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from '@/lib/dayjs'

export const columnsDeleted: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const task = row.original
      return (
        <Link
          className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
          to="/projects/$projectId/tasks/$taskId"
          params={{
            taskId: task.id.toString(),
            projectId: task.project_id.toString(),
          }}
        >
          {task.title}
        </Link>
      )
    },
  },
  {
    accessorKey: 'project',
    header: 'Project',
    cell: ({ row }) => {
      const task = row.original
      return task.project ? (
        <span>{task.project.name}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const task = row.original
      const { background, foreground } = priorityColorMap[task.priority]
      return (
        <Badge className={cn(background, foreground, 'w-20')}>
          {task.priority.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    accessorFn: (task) =>
      task.status ? snakeCaseToTitleCase(task.status) : '',
  },
  {
    accessorKey: 'deleted_at',
    header: 'Deleted At',
    accessorFn: (task) => {
      return task.deleted_at ? dayjs().to(task.deleted_at) : null
    },
  },
]
