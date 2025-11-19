import type { ApiError } from '@/lib/handle-api-error'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import MainInsetLayout from '../../-main-inset-layout'
import {
  ArchiveRestore,
  Contact,
  Edit,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageProjects from '@/hooks/use-manage-projects'
import { RestoreAlert } from '@/components/restore-alert'
import { showProjectQueryOptions } from '@/lib/query-options/show-project-query-options'
import ProjectNotFoundComponent from './-not-found-component'
import AssignManagerDialog from './-components/assign-manager-dialog'
import UserAvatar from '@/components/user-avatar'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const PAGE_TITLE = 'Project Details'
const PAGE_DESCRIPTION = 'Show project information and other related data'

export const Route = createFileRoute('/_main/projects/$projectId/')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { projectId } }) => {
    const id = Number(projectId)
    try {
      return queryClient.ensureQueryData(showProjectQueryOptions(id))
    } catch (error) {
      console.log('Loader error:', error)
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? loaderData.name + ' - ' + APP_NAME
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
  notFoundComponent: ProjectNotFoundComponent,
})

function RouteComponent() {
  const projectId = Route.useParams().projectId
  const { destroy, restore } = useManageProjects()
  const { data: project } = useSuspenseQuery(
    showProjectQueryOptions(Number(projectId)),
  )
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        { label: project.name, href: `/projects/${project.id}` },
      ]}
    >
      {project.deleted_at && <RestoreAlert />}
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="flex gap-4">
        <div className="flex flex-col text-left border rounded-xl p-4 gap-2 w-64">
          <h4>{project.name}</h4>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground font-bold mb-1">
              Description
            </p>
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>

          <Separator />
          <p className="font-bold text-muted-foreground text-sm">
            Project Manager
          </p>
          <div className="text-sm space-y-2 border p-2 rounded-lg flex items-center justify-between">
            {project.manager ? (
              <>
                <UserAvatar
                  name={project.manager.name}
                  className="size-8 mx-0 my-auto"
                  textClassName="text-sm"
                />
                <Link
                  className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
                  to="/users/$userId"
                  params={{ userId: project.manager.id.toString() }}
                >
                  {project.manager.name}
                </Link>
              </>
            ) : (
              <div>
                <p>No manager assigned yet</p>
              </div>
            )}
          </div>
          <Separator />
          <p className="font-bold text-muted-foreground text-sm">
            Assigned Teams
          </p>
          {project.teams.length > 0 ? (
            <ul className="list-disc ps-4">
              {project.teams.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No Teams are assigned to this project yet.
            </p>
          )}

          <Separator />
          {project.deleted_at ? (
            <ConfirmationDialog
              description="This project will be reactivated and become accessible throughout the system again."
              triggerComponent={
                <Button variant="default">
                  <ArchiveRestore />
                  Restore
                </Button>
              }
              submitButtonVariant={{ variant: 'default' }}
              submitButtonContent={
                <>
                  <ArchiveRestore /> Restore Project
                </>
              }
              onSubmit={async () => await restore(project.id)}
            />
          ) : (
            <>
              <AssignManagerDialog
                project={project}
                triggerComponent={
                  <Button variant={'default'}>
                    <Contact /> Assign Manager
                  </Button>
                }
              />
              <Link
                to="/projects/$projectId/teams"
                params={{ projectId }}
                className={buttonVariants({ variant: 'secondary' })}
              >
                <Users />
                Assign Teams
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/projects/$projectId/edit"
                  params={{ projectId }}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  <Edit />
                  Edit
                </Link>
                <ConfirmationDialog
                  description="This will mark the project as deleted. You can restore this project later if you change your mind."
                  triggerComponent={
                    <Button variant="outline">
                      <Trash2 />
                      Delete
                    </Button>
                  }
                  submitButtonVariant={{ variant: 'destructive' }}
                  submitButtonContent={
                    <>
                      <Trash2 /> Delete Project
                    </>
                  }
                  onSubmit={async () => await destroy(project.id)}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Manage tasks required to finish this project.
              </CardDescription>
              <CardAction>
                <Link
                  to="/projects/$projectId/tasks/create"
                  params={{ projectId }}
                  className={buttonVariants()}
                >
                  <Plus /> Create Task
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2"></div>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainInsetLayout>
  )
}
