export interface ActivityLog {
  id: number
  user_id: number
  user_name: string
  action: string
  auditable_type: string
  auditable_id: number
  description: string
  metadata: Record<string, any>
  created_at: string
}

export const SORTABLE_ACTIVITY_LOG_FIELDS: string[] = [
  'id',
  'action',
  'auditable_type',
  'auditable_id',
  'created_at',
]
