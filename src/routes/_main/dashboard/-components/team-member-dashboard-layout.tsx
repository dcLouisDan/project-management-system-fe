import { StatCard } from './stat-card'
import { ProjectsStatusChart } from './projects-status-chart'
import { TasksPriorityChart } from './tasks-priority-chart'
import { TasksStatusChart } from './tasks-status-chart'
import { RecentProjects } from './recent-projects'
import { RecentTasks } from './recent-tasks'
import {
  StatCardSkeleton,
  ChartSkeleton,
  RecentItemsSkeleton,
} from './dashboard-skeletons'
import { FolderKanban, CheckSquare } from 'lucide-react'
import type { DashboardStats } from '@/lib/types/dashboard'
import type { Project } from '@/lib/types/project'
import type { Task } from '@/lib/types/task'

interface TeamMemberDashboardLayoutProps {
  stats: DashboardStats | undefined
  recentProjects: Project[] | undefined
  recentTasks: Task[] | undefined
  isLoadingStats: boolean
  isLoadingProjects: boolean
  isLoadingTasks: boolean
}

export function TeamMemberDashboardLayout({
  stats,
  recentProjects,
  recentTasks,
  isLoadingStats,
  isLoadingProjects,
  isLoadingTasks,
}: TeamMemberDashboardLayoutProps) {
  return (
    <>
      {/* Summary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6 lg:grid-cols-2">
        {isLoadingStats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
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
    </>
  )
}
