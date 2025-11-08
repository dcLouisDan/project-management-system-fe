import type { Project } from './project'
import type { User } from './user'

export type TeamRole = 'team_lead' | 'team_member'

export const SORTABLE_TEAM_FIELDS: string[] = ['id', 'name', 'created_at']
export interface Team {
  id: number
  name: string
  description?: string
  lead?: User
  members: User[]
  projects: Project[]
  created_at: string
  updated_at?: string
  deleted_at?: string
}

export interface TeamCreate {
  name: string
  description?: string
}

export interface TeamUpdate extends TeamCreate {}

export const DEFAULT_TEAM_CREATE: TeamCreate = {
  name: '',
  description: '',
}

export interface TeamAddMember {
  id: number
  role: TeamRole
}
export interface TeamAddMembersBulkItem {
  user_id: number
  role: TeamRole
}

export interface TeamSetLeader {
  user_id: number
}

export interface TeamAddMembersBulk {
  members: TeamAddMembersBulkItem[]
}

export interface TeamRemoveMembersBulk {
  user_ids: number[]
}

export type InvalidTeamMembers = Record<
  number,
  {
    role: string
    reason: string
  }
>
