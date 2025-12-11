import type { ActivityLog } from '@/lib/types/activity-log'
import { type ColumnDef } from '@tanstack/react-table'
import dayjs from '@/lib/dayjs'

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'user_name',
    header: 'User',
  },
  {
    accessorKey: 'action',
    header: 'Action',
  },
  {
    accessorKey: 'auditable_type',
    header: 'Resource Type',
  },
  {
    accessorKey: 'auditable_id',
    header: 'Resource ID',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    accessorFn: (row) => {
      return dayjs(row.created_at).format('MMM D, YYYY h:mm A')
    },
  },
]
