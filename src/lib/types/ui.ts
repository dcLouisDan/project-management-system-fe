import { type BasicSelectItem } from '@/components/basic-select'
import type { Role } from './role'

export interface BreadcrumbLinkItem {
  href: string
  label: string
}

export interface SidebarNavItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  items?: SidebarNavSubItem[]
  isActive?: boolean
  /** Roles allowed to see this nav item. If undefined, visible to all roles. */
  allowedRoles?: Role[]
}

export interface SidebarNavSubItem {
  title: string
  url: string
  /** Roles allowed to see this sub-item. If undefined, inherits from parent. */
  allowedRoles?: Role[]
}

export type SortDirection = 'asc' | 'desc'

export const SortDirectionSelectItems: BasicSelectItem[] = [
  {
    value: 'asc',
    label: 'Ascending',
  },
  {
    value: 'desc',
    label: 'Descending',
  },
]

export interface UiColorConfig {
  background: string
  foreground: string
}
