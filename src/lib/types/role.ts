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

export const validateRoleString = (role: string): role is Role => {
  return Roles.includes(role as Role)
}
