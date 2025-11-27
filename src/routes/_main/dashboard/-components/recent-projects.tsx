import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockRecentProjects } from '@/lib/mock/dashboard-data'
import { Link } from '@tanstack/react-router'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  not_started: 'bg-[oklch(var(--chart-3))]',
  in_progress: 'bg-info',
  completed: 'bg-success',
  cancelled: 'bg-[oklch(var(--chart-5))]',
}

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function RecentProjects() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Recent Projects</CardTitle>
        <Link
          to="/projects"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecentProjects.map((project) => {
          const progress =
            project.tasksCount > 0
              ? Math.round((project.completedTasks / project.tasksCount) * 100)
              : 0

          return (
            <Link
              key={project.id}
              to="/projects/$projectId"
              params={{ projectId: project.id.toString() }}
              className="block"
            >
              <div className="flex flex-col gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{project.name}</span>
                      {project.isOverdue && (
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.manager ? `Manager: ${project.manager}` : 'No manager assigned'}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'shrink-0 text-white',
                      statusColors[project.status]
                    )}
                  >
                    {statusLabels[project.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground shrink-0">
                    {project.completedTasks}/{project.tasksCount} tasks
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Due: {project.dueDate}
                </p>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}

