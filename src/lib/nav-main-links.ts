import { ClipboardList, LayoutDashboard, Settings2, Users } from 'lucide-react'
import type { SidebarNavItem, SidebarNavSubItem } from './types/ui'

export const SETTING_LINKS: SidebarNavSubItem[] = [
  {
    title: 'Profile',
    url: '/settings/profile',
  },
  {
    title: 'Team',
    url: '/settings/team',
  },
]

export const NAV_MAIN_LINKS: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    url: '#',
    icon: ClipboardList,
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
    items: [
      {
        title: 'Users',
        url: '/users',
      },
      {
        title: 'Teams',
        url: '/teams',
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
