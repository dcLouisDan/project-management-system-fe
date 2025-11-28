'use client'

import * as React from 'react'
import { Frame, Map, PieChart } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import useAppStore from '@/integrations/zustand/app-store'
import { getNavLinksForRole } from '@/lib/nav-main-links'

// This is sample data for projects sidebar section.
// TODO: Replace with real data from API (Issue #6 in DEVELOPMENT_PLAN.md)
const sampleProjects = [
  {
    name: 'Design Engineering',
    url: '#',
    icon: Frame,
  },
  {
    name: 'Sales & Marketing',
    url: '#',
    icon: PieChart,
  },
  {
    name: 'Travel',
    url: '#',
    icon: Map,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppStore((state) => state.user)
  const uiMode = useAppStore((state) => state.uiMode)

  if (!user) {
    return null
  }

  // Filter navigation links based on user's role
  const navLinks = getNavLinksForRole(uiMode)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navLinks} />
        <NavProjects projects={sampleProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
