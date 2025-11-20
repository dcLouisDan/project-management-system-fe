import { Badge } from '@/components/ui/badge'
import { snakeCaseToTitleCase } from '@/lib/string-utils'
import { priorityColorMap } from '@/lib/types/priority'
import type { Task } from '@/lib/types/task'
import { cn } from '@/lib/utils'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
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
    accessorKey: 'due_date',
    header: 'Due Date',
    accessorFn: (task) =>
      task.due_date
        ? dayjs(task.due_date).format('MMM D, YYYY')
        : 'No Due Date',
  },
]
