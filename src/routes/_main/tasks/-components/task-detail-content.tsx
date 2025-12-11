import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/page-header'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  AlertTriangle,
  Calendar,
  Clock,
  Edit,
  Flag,
  History,
  SquareUser,
  Trash2,
  User,
  UserCheck,
} from 'lucide-react'
import AssignToUserDialog from '../../projects/$projectId/tasks/$taskId/-components/assign-to-user-dialog'
import StatusBadge from '@/components/status-badge'
import { statusColorMap } from '@/lib/types/status'
import { priorityColorMap } from '@/lib/types/priority'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageTasks from '@/hooks/use-manage-tasks'
import { Separator } from '@/components/ui/separator'
import TaskAssigneeDialog from '../../projects/$projectId/tasks/$taskId/-components/task-assignee-dialog'
import TaskReviewerDialog from '../../projects/$projectId/tasks/$taskId/-components/task-reviewer-dialog'
import { usePermissions } from '@/hooks/use-permissions'
import dayjs from '@/lib/dayjs'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/user-avatar'
import type { Task } from '@/lib/types/task'

interface TaskDetailContentProps {
  task: Task
  projectId: string
  taskId: string
  breadcrumbItems: Array<{ label: string; href: string }>
}

export default function TaskDetailContent({
  task,
  projectId,
  taskId,
  breadcrumbItems: _breadcrumbItems,
}: TaskDetailContentProps) {
  const { destroy } = useManageTasks()
  const { canEditTasks, canDeleteTasks, canReassignTasks, canEdit, canDelete } =
    usePermissions()

  // Check if user can edit this specific task
  // Admin/PM can edit any task, Team Lead can edit team tasks, Team Member can edit own tasks
  const canEditThisTask =
    canEditTasks || canEdit('task', { createdById: task.assigned_by?.id })

  // Check if user can delete this task
  const canDeleteThisTask =
    canDeleteTasks || canDelete('task', { createdById: task.assigned_by?.id })

  // Check if user can reassign this task
  const canReassignThisTask = canReassignTasks

  return (
    <>
      <PageHeader title={task.title}>
        {canReassignThisTask && (
          <AssignToUserDialog
            task={task}
            triggerComponent={
              <Button disabled={task.status === 'completed'}>
                <SquareUser /> Assign To User
              </Button>
            }
          />
        )}
        {canEditThisTask && (
          <Link
            to="/projects/$projectId/tasks/$taskId/edit"
            params={{ projectId, taskId }}
            className={buttonVariants({ variant: 'outline' })}
          >
            <Edit />
            Edit
          </Link>
        )}
        {canDeleteThisTask && (
          <ConfirmationDialog
            description="This will permanently delete this record from the database. This action cannot be undone."
            triggerComponent={
              <Button variant="outline">
                <Trash2 />
                Delete
              </Button>
            }
            submitButtonVariant={{ variant: 'destructive' }}
            submitButtonContent={
              <>
                <Trash2 /> Delete Task
              </>
            }
            onSubmit={async () => await destroy(task.id, task.project_id)}
          />
        )}
      </PageHeader>

      {/* Status & Priority Badges Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <StatusBadge
          label={task.status}
          colors={statusColorMap[task.status]}
          className="text-sm"
        />
        <StatusBadge
          label={task.priority}
          colors={priorityColorMap[task.priority]}
          className="text-sm"
        />
        {task.is_overdue && task.status !== 'completed' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
            <AlertTriangle className="size-4" />
            Overdue
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Task Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <TaskAssigneeDialog taskId={task.id} />
              <TaskReviewerDialog taskId={task.id} />
            </CardContent>
          </Card>

          {/* People Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="size-4" />
                People
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCheck className="size-4" />
                  Assignee
                </div>
                {task.assigned_to ? (
                  <Link
                    to="/users/$userId"
                    params={{ userId: task.assigned_to.id.toString() }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <UserAvatar
                      name={task.assigned_to.name}
                      className="size-6"
                      textClassName="text-xs"
                    />
                    <span className="text-sm font-medium">
                      {task.assigned_to.name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="size-4" />
                  Assigned by
                </div>
                {task.assigned_by ? (
                  <Link
                    to="/users/$userId"
                    params={{ userId: task.assigned_by.id.toString() }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <UserAvatar
                      name={task.assigned_by.name}
                      className="size-6"
                      textClassName="text-xs"
                    />
                    <span className="text-sm font-medium">
                      {task.assigned_by.name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="size-4" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {task.due_date && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Flag className="size-4" />
                    Due date
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      task.is_overdue &&
                        task.status !== 'completed' &&
                        'text-destructive',
                    )}
                  >
                    {dayjs(task.due_date).format('MMM D, YYYY')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Created
                </div>
                <span
                  className="text-sm"
                  title={dayjs(task.created_at).format('MMM D, YYYY h:mm A')}
                >
                  {dayjs(task.created_at).fromNow()}
                </span>
              </div>
              {task.updated_at && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="size-4" />
                    Updated
                  </div>
                  <span
                    className="text-sm"
                    title={dayjs(task.updated_at).format('MMM D, YYYY h:mm A')}
                  >
                    {dayjs(task.updated_at).fromNow()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Summary Card */}
          {task.reviews.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Review History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.reviews.slice(0, 3).map((review, index) => (
                    <div
                      key={review.id}
                      className={cn(
                        'flex items-center justify-between text-sm',
                        index !== 0 && 'pt-3 border-t',
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground text-xs">
                          {review.reviewed_at
                            ? dayjs(review.reviewed_at).format('MMM D, YYYY')
                            : 'Pending'}
                        </span>
                        {review.reviewed_by && (
                          <span className="text-xs">
                            by {review.reviewed_by.name}
                          </span>
                        )}
                      </div>
                      <StatusBadge
                        label={review.status}
                        colors={statusColorMap[review.status]}
                        className="text-xs"
                      />
                    </div>
                  ))}
                  {task.reviews.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{task.reviews.length - 3} more review
                      {task.reviews.length - 3 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - Description */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided for this task.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
