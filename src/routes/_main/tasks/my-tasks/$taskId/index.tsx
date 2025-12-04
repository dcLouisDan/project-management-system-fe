import { APP_NAME } from '@/lib/constants'
import { handleRouteError } from '@/lib/handle-api-error'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import TaskDetailContent from '../../-components/task-detail-content'
import TaskNotFoundComponent from './-not-found-component'

const PAGE_TITLE = 'Task Details'
const PAGE_DESCRIPTION = 'Show task information and other related data'

export const Route = createFileRoute('/_main/tasks/my-tasks/$taskId/')({
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
  const { taskId } = Route.useParams()
  const { data: task } = useSuspenseQuery(showTaskQueryOptions(Number(taskId)))

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'My Tasks', href: '/tasks/my-tasks' },
        {
          label: task.title,
          href: `/tasks/my-tasks/${task.id}`,
        },
      ]}
    >
      <TaskDetailContent
        task={task}
        projectId={task.project_id.toString()}
        taskId={taskId}
        breadcrumbItems={[
          { label: 'My Tasks', href: '/tasks/my-tasks' },
          {
            label: task.title,
            href: `/tasks/my-tasks/${task.id}`,
          },
        ]}
      />
    </MainInsetLayout>
  )
}
