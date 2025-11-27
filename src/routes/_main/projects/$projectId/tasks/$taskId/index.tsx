import { APP_NAME } from '@/lib/constants'
import { handleRouteError } from '@/lib/handle-api-error'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import { createFileRoute, Link } from '@tanstack/react-router'
import TaskNotFoundComponent from './-not-found-component'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import PageHeader from '@/components/page-header'
import { Button, buttonVariants } from '@/components/ui/button'
import { Edit, SquareUser, Trash2 } from 'lucide-react'
import AssignToUserDialog from './-components/assign-to-user-dialog'
import { Label } from '@/components/ui/label'
import StatusBadge from '@/components/status-badge'
import { statusColorMap } from '@/lib/types/status'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageTasks from '@/hooks/use-manage-tasks'
import { Separator } from '@/components/ui/separator'
import TaskAssigneeDialog from './-components/task-assignee-dialog'
import useAppStore from '@/integrations/zustand/app-store'
import TaskReviewerDialog from './-components/task-reviewer-dialog'

const PAGE_TITLE = 'Task Details'
const PAGE_DESCRIPTION = 'Show task information and other related data'

export const Route = createFileRoute(
  '/_main/projects/$projectId/tasks/$taskId/',
)({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    const id = Number(taskId)
    return queryClient.ensureQueryData(showTaskQueryOptions(id))
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? loaderData.title + ' - ' + APP_NAME
          : PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
  onError: handleRouteError,
  notFoundComponent: TaskNotFoundComponent,
})

function RouteComponent() {
  const { taskId, projectId } = Route.useParams()
  const { user } = useAppStore((state) => state)
  const { destroy } = useManageTasks()
  const { data: task } = useSuspenseQuery(showTaskQueryOptions(Number(taskId)))
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        {
          label: task.project?.name ?? 'Project',
          href: `/projects/${task.project_id}`,
        },
        {
          label: task.title,
          href: `/projects/${task.project_id}/tasks/${task.id}`,
        },
      ]}
    >
      <PageHeader title={task.title}>
        <AssignToUserDialog
          task={task}
          triggerComponent={
            <Button disabled={task.status == 'completed'}>
              <SquareUser /> Assign To User
            </Button>
          }
        />
        <Link
          to="/projects/$projectId/tasks/$taskId/edit"
          params={{ projectId, taskId }}
          className={buttonVariants({ variant: 'outline' })}
        >
          <Edit />
          Edit
        </Link>
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
      </PageHeader>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="w-full sm:max-w-64">
          <CardContent className="grid gap-4 items-start">
            <TaskAssigneeDialog />
            {task.assigned_to && <Separator />}
            <TaskReviewerDialog />
            {task.assigned_by?.id == user?.id && <Separator />}
            <div className="grid gap-1">
              <Label>Status</Label>
              <StatusBadge
                label={task.status}
                colors={statusColorMap[task.status]}
              />
            </div>
            <div className="grid gap-1">
              <Label>Assigned to</Label>
              <span className="font-bold">
                {task.assigned_to ? (
                  <Link
                    to={'/users/$userId'}
                    params={{ userId: task.assigned_to.id.toString() }}
                    className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
                  >
                    {task.assigned_to.name}
                  </Link>
                ) : (
                  'None'
                )}
              </span>
            </div>
            <div className="grid gap-1">
              <Label>Assigned by:</Label>
              <span className="font-bold">
                {task.assigned_by ? (
                  <Link
                    to={'/users/$userId'}
                    params={{ userId: task.assigned_by.id.toString() }}
                    className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
                  >
                    {task.assigned_by.name}
                  </Link>
                ) : (
                  'None'
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        {/* <div className="grid grid-cols-2">
          <Button>Start Task</Button>
        </div> */}
        <div className="sm:flex-1">
          <Card className="w-full">
            <CardContent>
              <Label className="mb-2">Description</Label>
              <p>{task.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainInsetLayout>
  )
}
