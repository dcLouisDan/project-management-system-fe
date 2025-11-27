import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockRecentTasks } from '@/lib/mock/dashboard-data'
import { Link } from '@tanstack/react-router'
import { AlertCircle, ArrowRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const priorityColors: Record<string, string> = {
  low: 'bg-[oklch(var(--chart-2))]',
  medium: 'bg-[oklch(var(--chart-4))]',
  high: 'bg-[oklch(var(--chart-1))]',
  urgent: 'bg-[oklch(var(--chart-5))]',
}

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const statusColors: Record<string, string> = {
  not_started: 'border-[oklch(var(--chart-3))] text-[oklch(var(--chart-3))]',
  in_progress: 'border-info text-info',
  awaiting_review: 'border-warning text-warning',
  completed: 'border-success text-success',
}

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  awaiting_review: 'Review',
  completed: 'Completed',
}

export function RecentTasks() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Recent Tasks</CardTitle>
        <Link
          to="/projects"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRecentTasks.map((task) => (
          <Link
            key={task.id}
            to="/projects/$projectId/tasks/$taskId"
            params={{
              projectId: task.projectId.toString(),
              taskId: task.id.toString(),
            }}
            className="block"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{task.title}</span>
                  {task.isOverdue && (
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">{task.projectName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <User className="h-3 w-3" />
                    {task.assignedTo || 'Unassigned'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Due: {task.dueDate}
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0 items-end">
                <Badge
                  variant="secondary"
                  className={cn('text-white text-xs', priorityColors[task.priority])}
                >
                  {priorityLabels[task.priority]}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn('text-xs', statusColors[task.status])}
                >
                  {statusLabels[task.status]}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

