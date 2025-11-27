import useAppStore from '@/integrations/zustand/app-store'
import {
  getPermissionsForRole,
  canEditResource,
  canDeleteResource,
  canAccessNavSection,
  type Permissions,
  type OwnershipContext,
  type NavSection,
} from '@/lib/permissions'

/**
 * Hook to access role-based permissions in components.
 *
 * @example
 * ```tsx
 * function UserActions({ user }: { user: User }) {
 *   const { canEditUsers, canDeleteUsers, canEdit, canDelete } = usePermissions()
 *
 *   // Simple permission check
 *   if (!canEditUsers) return null
 *
 *   // Contextual permission check (ownership-aware)
 *   const canEditThisUser = canEdit('user', { ownerId: user.id })
 *
 *   return (
 *     <>
 *       {canEditThisUser && <EditButton />}
 *       {canDeleteUsers && <DeleteButton />}
 *     </>
 *   )
 * }
 * ```
 */
export function usePermissions() {
  const uiMode = useAppStore((state) => state.uiMode)
  const currentUser = useAppStore((state) => state.user)

  const permissions = getPermissionsForRole(uiMode)

  /**
   * Check if user can edit a resource with optional ownership context.
   */
  function canEdit(
    resourceType: 'user' | 'team' | 'project' | 'task',
    context: Omit<OwnershipContext, 'currentUserId'> = {},
  ): boolean {
    return canEditResource(uiMode, resourceType, {
      ...context,
      currentUserId: currentUser?.id,
    })
  }

  /**
   * Check if user can delete a resource with optional ownership context.
   */
  function canDelete(
    resourceType: 'user' | 'team' | 'project' | 'task',
    context: Omit<OwnershipContext, 'currentUserId'> = {},
  ): boolean {
    return canDeleteResource(uiMode, resourceType, {
      ...context,
      currentUserId: currentUser?.id,
    })
  }

  /**
   * Check if user can access a navigation section.
   */
  function canAccessNav(section: NavSection): boolean {
    return canAccessNavSection(uiMode, section)
  }

  /**
   * Check if current user is the owner of a resource.
   */
  function isOwner(ownerId?: number): boolean {
    return currentUser?.id === ownerId
  }

  /**
   * Check if current user is the manager of a resource.
   */
  function isManager(managerId?: number): boolean {
    return currentUser?.id === managerId
  }

  /**
   * Check if current user is assigned to a task.
   */
  function isAssignedTo(assignedToId?: number): boolean {
    return currentUser?.id === assignedToId
  }

  return {
    // Current role
    role: uiMode,
    currentUserId: currentUser?.id,

    // All permissions spread
    ...permissions,

    // Contextual permission functions
    canEdit,
    canDelete,
    canAccessNav,

    // Ownership helpers
    isOwner,
    isManager,
    isAssignedTo,
  }
}

/**
 * Convenience type for the return value of usePermissions.
 */
export type UsePermissionsReturn = Permissions & {
  role: string
  currentUserId: number | undefined
  canEdit: (
    resourceType: 'user' | 'team' | 'project' | 'task',
    context?: Omit<OwnershipContext, 'currentUserId'>,
  ) => boolean
  canDelete: (
    resourceType: 'user' | 'team' | 'project' | 'task',
    context?: Omit<OwnershipContext, 'currentUserId'>,
  ) => boolean
  canAccessNav: (section: NavSection) => boolean
  isOwner: (ownerId?: number) => boolean
  isManager: (managerId?: number) => boolean
  isAssignedTo: (assignedToId?: number) => boolean
}

export default usePermissions

