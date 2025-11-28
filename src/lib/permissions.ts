import type { Role } from './types/role'

/**
 * Permission definitions for role-based UI access control.
 * Based on docs/features/ROLE_UI_PERMISSIONS.md
 */

// ============================================================================
// Permission Types
// ============================================================================

export interface UserPermissions {
  canViewAllUsers: boolean
  canViewTeamUsers: boolean
  canViewOwnProfile: boolean
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canAssignRoles: boolean
}

export interface TeamPermissions {
  canViewAllTeams: boolean
  canViewAssignedTeams: boolean
  canCreateTeams: boolean
  canEditTeams: boolean
  canEditManagedTeams: boolean
  canDeleteTeams: boolean
  canManageTeamMembers: boolean
  canManageManagedTeamMembers: boolean
}

export interface ProjectPermissions {
  canViewAllProjects: boolean
  canViewTeamProjects: boolean
  canCreateProjects: boolean
  canEditProjects: boolean
  canEditOwnProjects: boolean
  canDeleteProjects: boolean
  canAssignTeamsToProjects: boolean
  canAssignTeamsToOwnProjects: boolean
}

export interface TaskPermissions {
  canViewAllTasks: boolean
  canViewProjectTasks: boolean
  canViewTeamTasks: boolean
  canViewAssignedTasks: boolean
  canCreateTasks: boolean
  canCreateProjectTasks: boolean
  canEditTasks: boolean
  canEditProjectTasks: boolean
  canEditTeamTasks: boolean
  canEditOwnTasks: boolean
  canDeleteTasks: boolean
  canDeleteOwnTasks: boolean
  canReassignTasks: boolean
  canReassignProjectTasks: boolean
  canReassignTeamTasks: boolean
}

export interface Permissions
  extends UserPermissions,
    TeamPermissions,
    ProjectPermissions,
    TaskPermissions {
  role: Role
}

// ============================================================================
// Permission Definitions by Role
// ============================================================================

const ADMIN_PERMISSIONS: Permissions = {
  role: 'admin',
  // Users
  canViewAllUsers: true,
  canViewTeamUsers: true,
  canViewOwnProfile: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canAssignRoles: true,
  // Teams
  canViewAllTeams: true,
  canViewAssignedTeams: true,
  canCreateTeams: true,
  canEditTeams: true,
  canEditManagedTeams: true,
  canDeleteTeams: true,
  canManageTeamMembers: true,
  canManageManagedTeamMembers: true,
  // Projects
  canViewAllProjects: true,
  canViewTeamProjects: true,
  canCreateProjects: true,
  canEditProjects: true,
  canEditOwnProjects: true,
  canDeleteProjects: true,
  canAssignTeamsToProjects: true,
  canAssignTeamsToOwnProjects: true,
  // Tasks
  canViewAllTasks: true,
  canViewProjectTasks: true,
  canViewTeamTasks: true,
  canViewAssignedTasks: true,
  canCreateTasks: true,
  canCreateProjectTasks: true,
  canEditTasks: true,
  canEditProjectTasks: true,
  canEditTeamTasks: true,
  canEditOwnTasks: true,
  canDeleteTasks: true,
  canDeleteOwnTasks: true,
  canReassignTasks: true,
  canReassignProjectTasks: true,
  canReassignTeamTasks: true,
}

const PROJECT_MANAGER_PERMISSIONS: Permissions = {
  role: 'project manager',
  // Users - View all (read-only)
  canViewAllUsers: true,
  canViewTeamUsers: true,
  canViewOwnProfile: true,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canAssignRoles: false,
  // Teams - View all, manage teams assigned to their projects
  canViewAllTeams: true,
  canViewAssignedTeams: true,
  canCreateTeams: false,
  canEditTeams: false,
  canEditManagedTeams: true,
  canDeleteTeams: false,
  canManageTeamMembers: false,
  canManageManagedTeamMembers: true,
  // Projects - View all, create, edit own, assign teams to own
  canViewAllProjects: true,
  canViewTeamProjects: true,
  canCreateProjects: true,
  canEditProjects: false,
  canEditOwnProjects: true,
  canDeleteProjects: false,
  canAssignTeamsToProjects: false,
  canAssignTeamsToOwnProjects: true,
  // Tasks - Full control within managed projects
  canViewAllTasks: false,
  canViewProjectTasks: true,
  canViewTeamTasks: true,
  canViewAssignedTasks: true,
  canCreateTasks: false,
  canCreateProjectTasks: true,
  canEditTasks: false,
  canEditProjectTasks: true,
  canEditTeamTasks: true,
  canEditOwnTasks: true,
  canDeleteTasks: false,
  canDeleteOwnTasks: true,
  canReassignTasks: true,
  canReassignProjectTasks: true,
  canReassignTeamTasks: true,
}

const TEAM_LEAD_PERMISSIONS: Permissions = {
  role: 'team lead',
  // Users - View team members only
  canViewAllUsers: false,
  canViewTeamUsers: true,
  canViewOwnProfile: true,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canAssignRoles: false,
  // Teams - View assigned teams only
  canViewAllTeams: false,
  canViewAssignedTeams: true,
  canCreateTeams: false,
  canEditTeams: false,
  canEditManagedTeams: false,
  canDeleteTeams: false,
  canManageTeamMembers: false,
  canManageManagedTeamMembers: false,
  // Projects - View team projects only
  canViewAllProjects: false,
  canViewTeamProjects: true,
  canCreateProjects: false,
  canEditProjects: false,
  canEditOwnProjects: false,
  canDeleteProjects: false,
  canAssignTeamsToProjects: false,
  canAssignTeamsToOwnProjects: false,
  // Tasks - Create in assigned projects, edit team/own tasks, reassign within team
  canViewAllTasks: false,
  canViewProjectTasks: false,
  canViewTeamTasks: true,
  canViewAssignedTasks: true,
  canCreateTasks: false,
  canCreateProjectTasks: true,
  canEditTasks: false,
  canEditProjectTasks: false,
  canEditTeamTasks: true,
  canEditOwnTasks: true,
  canDeleteTasks: false,
  canDeleteOwnTasks: false,
  canReassignTasks: true,
  canReassignProjectTasks: false,
  canReassignTeamTasks: true,
}

const TEAM_MEMBER_PERMISSIONS: Permissions = {
  role: 'team member',
  // Users - View own profile only
  canViewAllUsers: false,
  canViewTeamUsers: false,
  canViewOwnProfile: true,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canAssignRoles: false,
  // Teams - View assigned teams only
  canViewAllTeams: false,
  canViewAssignedTeams: true,
  canCreateTeams: false,
  canEditTeams: false,
  canEditManagedTeams: false,
  canDeleteTeams: false,
  canManageTeamMembers: false,
  canManageManagedTeamMembers: false,
  // Projects - View team projects only
  canViewAllProjects: false,
  canViewTeamProjects: true,
  canCreateProjects: false,
  canEditProjects: false,
  canEditOwnProjects: false,
  canDeleteProjects: false,
  canAssignTeamsToProjects: false,
  canAssignTeamsToOwnProjects: false,
  // Tasks - View assigned, create if allowed, edit own only
  canViewAllTasks: false,
  canViewProjectTasks: false,
  canViewTeamTasks: false,
  canViewAssignedTasks: true,
  canCreateTasks: false,
  canCreateProjectTasks: false, // Depends on project settings
  canEditTasks: false,
  canEditProjectTasks: false,
  canEditTeamTasks: false,
  canEditOwnTasks: true,
  canDeleteTasks: false,
  canDeleteOwnTasks: false,
  canReassignTasks: false,
  canReassignProjectTasks: false,
  canReassignTeamTasks: false,
}

// ============================================================================
// Permission Lookup
// ============================================================================

const PERMISSIONS_BY_ROLE: Record<Role, Permissions> = {
  admin: ADMIN_PERMISSIONS,
  'project manager': PROJECT_MANAGER_PERMISSIONS,
  'team lead': TEAM_LEAD_PERMISSIONS,
  'team member': TEAM_MEMBER_PERMISSIONS,
}

/**
 * Get all permissions for a given role.
 */
export function getPermissionsForRole(role: Role): Permissions {
  return PERMISSIONS_BY_ROLE[role] ?? TEAM_MEMBER_PERMISSIONS
}

/**
 * Check if a role has a specific permission.
 */
export function hasPermission<K extends keyof Permissions>(
  role: Role,
  permission: K,
): Permissions[K] {
  const permissions = getPermissionsForRole(role)
  return permissions[permission]
}

// ============================================================================
// Contextual Permission Checks
// ============================================================================

export interface OwnershipContext {
  currentUserId?: number
  ownerId?: number
  managerId?: number
  assignedToId?: number
  createdById?: number
}

/**
 * Check if user can edit a specific resource based on role and ownership.
 */
export function canEditResource(
  role: Role,
  resourceType: 'user' | 'team' | 'project' | 'task',
  context: OwnershipContext = {},
): boolean {
  const permissions = getPermissionsForRole(role)
  const { currentUserId, ownerId, managerId, createdById } = context

  switch (resourceType) {
    case 'user':
      return permissions.canEditUsers

    case 'team':
      if (permissions.canEditTeams) return true
      if (
        permissions.canEditManagedTeams &&
        currentUserId &&
        managerId === currentUserId
      ) {
        return true
      }
      return false

    case 'project':
      if (permissions.canEditProjects) return true
      if (
        permissions.canEditOwnProjects &&
        currentUserId &&
        managerId === currentUserId
      ) {
        return true
      }
      return false

    case 'task':
      if (permissions.canEditTasks) return true
      if (permissions.canEditProjectTasks) return true
      if (permissions.canEditTeamTasks) return true
      if (
        permissions.canEditOwnTasks &&
        currentUserId &&
        createdById === currentUserId
      ) {
        return true
      }
      return false

    default:
      return false
  }
}

/**
 * Check if user can delete a specific resource based on role and ownership.
 */
export function canDeleteResource(
  role: Role,
  resourceType: 'user' | 'team' | 'project' | 'task',
  context: OwnershipContext = {},
): boolean {
  const permissions = getPermissionsForRole(role)
  const { currentUserId, createdById } = context

  switch (resourceType) {
    case 'user':
      return permissions.canDeleteUsers

    case 'team':
      return permissions.canDeleteTeams

    case 'project':
      return permissions.canDeleteProjects

    case 'task':
      if (permissions.canDeleteTasks) return true
      if (
        permissions.canDeleteOwnTasks &&
        currentUserId &&
        createdById === currentUserId
      ) {
        return true
      }
      return false

    default:
      return false
  }
}

// ============================================================================
// Navigation Visibility Helpers
// ============================================================================

export type NavSection = 'dashboard' | 'users' | 'teams' | 'projects' | 'tasks'

/**
 * Check if a navigation section should be visible for a role.
 */
export function canAccessNavSection(role: Role, section: NavSection): boolean {
  const permissions = getPermissionsForRole(role)

  switch (section) {
    case 'dashboard':
      return true // All roles can access dashboard

    case 'users':
      return (
        permissions.canViewAllUsers ||
        permissions.canViewTeamUsers ||
        permissions.canViewOwnProfile
      )

    case 'teams':
      return permissions.canViewAllTeams || permissions.canViewAssignedTeams

    case 'projects':
      return permissions.canViewAllProjects || permissions.canViewTeamProjects

    case 'tasks':
      return (
        permissions.canViewAllTasks ||
        permissions.canViewProjectTasks ||
        permissions.canViewTeamTasks ||
        permissions.canViewAssignedTasks
      )

    default:
      return false
  }
}

/**
 * Get the allowed roles for a navigation section.
 */
export function getAllowedRolesForSection(section: NavSection): Role[] {
  const roles: Role[] = ['admin', 'project manager', 'team lead', 'team member']
  return roles.filter((role) => canAccessNavSection(role, section))
}

