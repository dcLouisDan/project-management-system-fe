import { ClipboardList, LayoutDashboard, Settings2, Users } from 'lucide-react'
import type { SidebarNavItem, SidebarNavSubItem } from './types/ui'
import type { Role } from './types/role'

/**
 * Setting links - visible to all authenticated users
 */
export const SETTING_LINKS: SidebarNavSubItem[] = [
  {
    title: 'Profile',
    url: '/settings/profile',
  },
]

/**
 * Main navigation links with role-based visibility.
 *
 * Based on docs/features/ROLE_UI_PERMISSIONS.md:
 * - Dashboard: All roles
 * - Projects: All roles (filtered by backend based on access)
 * - Users: Admin only for full access, others have limited/no access
 * - Teams: Admin and Project Manager for full list, others see assigned only
 * - Settings: All roles
 */
export const NAV_MAIN_LINKS: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    // All roles can access dashboard
  },
  {
    title: 'Projects',
    url: '#',
    icon: ClipboardList,
    // All roles can access projects (backend filters based on access)
    items: [
      {
        title: 'Projects List',
        url: '/projects',
      },
    ],
  },
  {
    title: 'Users and Teams',
    url: '#',
    icon: Users,
    // This section has mixed permissions
    items: [
      {
        title: 'Users',
        url: '/users',
        // Admin: full access
        // Project Manager: read-only access
        // Team Lead: team members only
        // Team Member: no access (redirected to profile)
        allowedRoles: ['admin', 'project manager'],
      },
      {
        title: 'Teams',
        url: '/teams',
        // Admin and Project Manager can see all teams
        // Team Lead and Team Member can only see assigned teams
        // We show the link to all but data is filtered by backend
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: SETTING_LINKS,
  },
]

/**
 * Filter navigation items based on user role.
 * Returns a filtered copy of the navigation structure.
 */
export function getNavLinksForRole(role: Role): SidebarNavItem[] {
  return NAV_MAIN_LINKS.map((item) => {
    // Check if the top-level item is allowed for this role
    if (item.allowedRoles && !item.allowedRoles.includes(role)) {
      return null
    }

    // Filter sub-items if present
    if (item.items && item.items.length > 0) {
      const filteredItems = item.items.filter((subItem) => {
        // If no allowedRoles specified, show to all
        if (!subItem.allowedRoles) return true
        return subItem.allowedRoles.includes(role)
      })

      // If no sub-items left after filtering, check if we should hide the parent
      if (filteredItems.length === 0 && item.items.length > 0) {
        // Parent had items but none are visible - hide the parent too
        return null
      }

      return {
        ...item,
        items: filteredItems,
      }
    }

    return item
  }).filter((item): item is SidebarNavItem => item !== null)
}

/**
 * Check if a specific nav item is visible for a role.
 */
export function isNavItemVisibleForRole(
  itemTitle: string,
  role: Role,
): boolean {
  const filteredLinks = getNavLinksForRole(role)

  // Check top-level items
  for (const item of filteredLinks) {
    if (item.title === itemTitle) return true

    // Check sub-items
    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.title === itemTitle) return true
      }
    }
  }

  return false
}
