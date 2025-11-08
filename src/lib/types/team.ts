import type { Project } from './project'
import type { User } from './user'

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

export type InvalidTeamMembers = Record<
  number,
  {
    role: string
    reason: string
  }
>
