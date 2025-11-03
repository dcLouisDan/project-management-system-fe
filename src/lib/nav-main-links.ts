import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react'
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
  {
    title: 'Billing',
    url: '#',
  },
  {
    title: 'Limits',
    url: '#',
  },
]

export const NAV_MAIN_LINKS: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: SquareTerminal,
  },
  {
    title: 'Models',
    url: '#',
    icon: Bot,
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
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
