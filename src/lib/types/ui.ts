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
