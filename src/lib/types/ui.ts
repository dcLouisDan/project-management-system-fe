import { type BasicSelectItem } from '@/components/basic-select'

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
}

export interface SidebarNavSubItem {
  title: string
  url: string
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
