import { APP_NAME } from '@/lib/constants'
import { handleRouteError } from '@/lib/handle-api-error'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import { createFileRoute } from '@tanstack/react-router'
import TaskNotFoundComponent from './-not-found-component'
import { useSuspenseQuery } from '@tanstack/react-query'
import PageHeader from '@/components/page-header'
import { Separator } from '@/components/ui/separator'
import TaskSelectDialog from '@/components/dialogs/task-select-dialog'
import { useForm } from '@tanstack/react-form'
import { DEFAULT_TASK_SYNC_RELATIONS } from '@/lib/types/task'
import { projectRelationOptions } from '@/lib/types/project-relations'
import { BasicSelect } from '@/components/basic-select'

const PAGE_TITLE = 'Task Relations'
const PAGE_DESCRIPTION = 'Manage task relations and other related data'

export const Route = createFileRoute('/_main/tasks/my-tasks/$taskId/relations')(
  {
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
  },
)

function RouteComponent() {
  const { taskId } = Route.useParams()
  const { data: task } = useSuspenseQuery(showTaskQueryOptions(Number(taskId)))


  const form = useForm({
    defaultValues: DEFAULT_TASK_SYNC_RELATIONS,
    onSubmit: (value) => {
      console.log("Submit: ", value)
    }
  })

  return <MainInsetLayout
    breadcrumbItems={[
      { label: 'My Tasks', href: '/tasks/my-tasks' },
      {
        label: task.title,
        href: `/tasks/my-tasks/${task.id}`,
      },
      {
        label: 'Project Relations',
        href: `/tasks/my-tasks/${task.id}/relations`,
      }
    ]}
  >
    <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
    <Separator />
    <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }}>
      <div className="flex justify-between items-center">
        <h1 className='text-2xl font-bold'>
          {task.title}
        </h1>
        <form.Field name='tasks' mode='array'>
          {
            (field) => (
              <>
                <TaskSelectDialog task={task} />
              </>
            )
          }
        </form.Field>
      </div>
    </form>
  </MainInsetLayout>
}
