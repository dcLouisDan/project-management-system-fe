import { APP_NAME } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import TaskNotFoundComponent from './-not-found-component'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import PageHeader from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { SquareUser } from 'lucide-react'
import AssignToUserDialog from './-components/assign-to-user-dialog'

const PAGE_TITLE = 'Task Details'
const PAGE_DESCRIPTION = 'Show task information and other related data'

export const Route = createFileRoute(
  '/_main/projects/$projectId/tasks/$taskId/',
)({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    const id = Number(taskId)
    try {
      return queryClient.ensureQueryData(showTaskQueryOptions(id))
    } catch (error) {
      console.log('Loader error:', error)
    }
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
  onError: (err) => {
    const error = err as ApiError
    console.log('Index error', error)
    if (error.status == 404) {
      throw notFound()
    }
  },
  notFoundComponent: TaskNotFoundComponent,
})

function RouteComponent() {
  const { taskId } = Route.useParams()
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
            <Button>
              <SquareUser /> Assign To User
            </Button>
          }
        />
      </PageHeader>
      <div className="grid grid-cols-2">
        <div className="grid gap-1">
          <p>
            Assigned to:{' '}
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
          </p>
          <p>
            Assigned by:{' '}
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
          </p>
        </div>
        <div></div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{task.description}</p>
        </CardContent>
      </Card>
    </MainInsetLayout>
  )
}
