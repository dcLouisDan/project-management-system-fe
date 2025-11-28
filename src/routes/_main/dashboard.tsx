import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import MainInsetLayout from './-main-inset-layout'
import { StatCard } from './dashboard/-components/stat-card'
import { ProjectsStatusChart } from './dashboard/-components/projects-status-chart'
import { TasksPriorityChart } from './dashboard/-components/tasks-priority-chart'
import { TasksStatusChart } from './dashboard/-components/tasks-status-chart'
import { RecentProjects } from './dashboard/-components/recent-projects'
import { RecentTasks } from './dashboard/-components/recent-tasks'
import { Users, FolderKanban, CheckSquare, UsersRound } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import PageHeader from '@/components/page-header'
import {
  dashboardStatsQueryOptions,
  recentProjectsQueryOptions,
  recentTasksQueryOptions,
} from '@/lib/query-options/dashboard-query-options'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

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

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  )
}

function RecentItemsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

function RouteComponent() {
  const { data: stats, isLoading: isLoadingStats } = useQuery(
    dashboardStatsQueryOptions(),
  )
  const { data: recentProjects, isLoading: isLoadingProjects } = useQuery(
    recentProjectsQueryOptions({ limit: 5 }),
  )
  const { data: recentTasks, isLoading: isLoadingTasks } = useQuery(
    recentTasksQueryOptions({ limit: 5 }),
  )

  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'Dashboard', href: '/dashboard' }]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      {/* Summary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {isLoadingStats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Total Users"
              value={stats.users.total}
              description={`${stats.users.active} active`}
              icon={Users}
            />
            <StatCard
              title="Total Teams"
              value={stats.teams.total}
              description={`${stats.teams.with_lead} with leads`}
              icon={UsersRound}
            />
            <StatCard
              title="Total Projects"
              value={stats.projects.total}
              description={`${stats.projects.overdue} overdue`}
              icon={FolderKanban}
            />
            <StatCard
              title="Total Tasks"
              value={stats.tasks.total}
              description={`${stats.tasks.overdue} overdue`}
              icon={CheckSquare}
            />
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {isLoadingStats ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : stats ? (
          <>
            <ProjectsStatusChart data={stats.projects.by_status} />
            <TasksPriorityChart data={stats.tasks.by_priority} />
            <TasksStatusChart data={stats.tasks.by_status} />
          </>
        ) : null}
      </div>

      {/* Recent Items Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoadingProjects ? (
          <RecentItemsSkeleton />
        ) : (
          <RecentProjects projects={recentProjects ?? []} />
        )}
        {isLoadingTasks ? (
          <RecentItemsSkeleton />
        ) : (
          <RecentTasks tasks={recentTasks ?? []} />
        )}
      </div>
    </MainInsetLayout>
  )
}
