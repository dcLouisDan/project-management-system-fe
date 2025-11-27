import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from './-main-inset-layout'
import { StatCard } from './dashboard/-components/stat-card'
import { ProjectsStatusChart } from './dashboard/-components/projects-status-chart'
import { TasksPriorityChart } from './dashboard/-components/tasks-priority-chart'
import { TasksStatusChart } from './dashboard/-components/tasks-status-chart'
import { RecentProjects } from './dashboard/-components/recent-projects'
import { RecentTasks } from './dashboard/-components/recent-tasks'
import { mockDashboardStats } from '@/lib/mock/dashboard-data'
import { Users, FolderKanban, CheckSquare, UsersRound } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import PageHeader from '@/components/page-header'

const PAGE_TITLE = 'Dashboard'
const PAGE_DESCRIPTION = 'Overview of your project management system'

export const Route = createFileRoute('/_main/dashboard')({
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

function RouteComponent() {
  const stats = mockDashboardStats

  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'Dashboard', href: '/dashboard' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      {/* Summary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          description={`${stats.users.active} active`}
          trend={stats.users.trend}
          icon={Users}
        />
        <StatCard
          title="Total Teams"
          value={stats.teams.total}
          description={`${stats.teams.withLead} with leads`}
          trend={stats.teams.trend}
          icon={UsersRound}
        />
        <StatCard
          title="Total Projects"
          value={stats.projects.total}
          description={`${stats.projects.overdue} overdue`}
          trend={stats.projects.trend}
          icon={FolderKanban}
        />
        <StatCard
          title="Total Tasks"
          value={stats.tasks.total}
          description={`${stats.tasks.overdue} overdue`}
          trend={stats.tasks.trend}
          icon={CheckSquare}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <ProjectsStatusChart />
        <TasksPriorityChart />
        <TasksStatusChart />
      </div>

      {/* Recent Items Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentProjects />
        <RecentTasks />
      </div>
    </MainInsetLayout>
  )
}
