import type { BasicSelectItem } from '@/components/basic-select'
import {
  ContactRound,
  User,
  UserCog,
  UserStar,
  type LucideIcon,
} from 'lucide-react'

export type Role = 'admin' | 'project manager' | 'team lead' | 'team member'

export const Roles: Role[] = [
  'admin',
  'project manager',
  'team lead',
  'team member',
]

export const RoleDisplayNames: Record<Role, string> = {
  admin: 'Administrator',
  'project manager': 'Project Manager',
  'team lead': 'Team Lead',
  'team member': 'Team Member',
}

export const RoleDescriptions: Record<Role, string> = {
  admin: 'Has full system access and manages users, projects, and settings.',
  'project manager': 'Oversees project progress and coordinates team efforts.',
  'team lead': 'Supervises team members and ensures tasks meet project goals.',
  'team member':
    'Contributes to assigned tasks and collaborates within the team.',
}

export const RoleSelectItems: BasicSelectItem[] = Roles.map((role) => ({
  value: role,
  label: RoleDisplayNames[role],
}))

export const RoleLucideIcons: Record<Role, LucideIcon> = {
  admin: UserCog,
  'project manager': ContactRound,
  'team lead': UserStar,
  'team member': User,
}

export const validateRoleString = (role: string): role is Role => {
  return Roles.includes(role as Role)
}
