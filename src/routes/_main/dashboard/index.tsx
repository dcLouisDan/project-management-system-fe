import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import MainInsetLayout from '../-main-inset-layout'
import { AdminDashboardLayout } from './-components/admin-dashboard-layout'
import { ProjectManagerDashboardLayout } from './-components/project-manager-dashboard-layout'
import { TeamLeadDashboardLayout } from './-components/team-lead-dashboard-layout'
import { TeamMemberDashboardLayout } from './-components/team-member-dashboard-layout'
import { APP_NAME, QUERY_KEYS } from '@/lib/constants'
import PageHeader from '@/components/page-header'
import {
  dashboardStatsQueryOptions,
  recentProjectsQueryOptions,
  recentTasksQueryOptions,
} from '@/lib/query-options/dashboard-query-options'
import useAppStore from '@/integrations/zustand/app-store'
import { useEffect } from 'react'
import type { Role } from '@/lib/types/role'
import type { DashboardStats } from '@/lib/types/dashboard'
import type { Project } from '@/lib/types/project'
import type { Task } from '@/lib/types/task'

const PAGE_TITLE = 'Dashboard'
const PAGE_DESCRIPTION = 'Overview of your project management system'

export const Route = createFileRoute('/_main/dashboard/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
})

function renderDashboardLayout(
  uiMode: Role,
  props: {
    stats: DashboardStats | undefined
    recentProjects: Project[] | undefined
    recentTasks: Task[] | undefined
    isLoadingStats: boolean
    isLoadingProjects: boolean
    isLoadingTasks: boolean
  },
) {
  const layoutProps = {
    stats: props.stats,
    recentProjects: props.recentProjects,
    recentTasks: props.recentTasks,
    isLoadingStats: props.isLoadingStats,
    isLoadingProjects: props.isLoadingProjects,
    isLoadingTasks: props.isLoadingTasks,
  }

  switch (uiMode) {
    case 'admin':
      return <AdminDashboardLayout {...layoutProps} />
    case 'project manager':
      return <ProjectManagerDashboardLayout {...layoutProps} />
    case 'team lead':
      return <TeamLeadDashboardLayout {...layoutProps} />
    case 'team member':
      return <TeamMemberDashboardLayout {...layoutProps} />
    default:
      return <TeamMemberDashboardLayout {...layoutProps} />
  }
}

function RouteComponent() {
  const queryClient = useQueryClient()
  const { uiMode } = useAppStore((state) => state)
  const { data: stats, isLoading: isLoadingStats } = useQuery(
    dashboardStatsQueryOptions({ force_role: uiMode }),
  )
  const { data: recentProjects, isLoading: isLoadingProjects } = useQuery(
    recentProjectsQueryOptions({ limit: 5, force_role: uiMode }),
  )
  const { data: recentTasks, isLoading: isLoadingTasks } = useQuery(
    recentTasksQueryOptions({ limit: 5, force_role: uiMode }),
  )

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
  }, [uiMode, queryClient])

  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'Dashboard', href: '/dashboard' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      {renderDashboardLayout(uiMode, {
        stats,
        recentProjects,
        recentTasks,
        isLoadingStats,
        isLoadingProjects,
        isLoadingTasks,
      })}
    </MainInsetLayout>
  )
}
