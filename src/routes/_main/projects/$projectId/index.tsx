import { handleRouteError } from '@/lib/handle-api-error'
import { createFileRoute, Link } from '@tanstack/react-router'
import MainInsetLayout from '../../-main-inset-layout'
import { ArchiveRestore, Contact, Edit, Trash2, Users } from 'lucide-react'
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
import ProjectTasksCard from './-components/project-tasks-card'
import { usePermissions } from '@/hooks/use-permissions'

const PAGE_TITLE = 'Project Details'
const PAGE_DESCRIPTION = 'Show project information and other related data'

export const Route = createFileRoute('/_main/projects/$projectId/')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { projectId } }) => {
    const id = Number(projectId)
    return queryClient.ensureQueryData(showProjectQueryOptions(id))
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
  onError: handleRouteError,
  notFoundComponent: ProjectNotFoundComponent,
})

function RouteComponent() {
  const projectId = Route.useParams().projectId
  const { destroy, restore } = useManageProjects()
  const { data: project } = useSuspenseQuery(
    showProjectQueryOptions(Number(projectId)),
  )
  const {
    canEditProjects,
    canDeleteProjects,
    canAssignTeamsToProjects,
    canEdit,
    isManager,
  } = usePermissions()

  // Check if user can edit this specific project (admin or project manager of this project)
  const canEditThisProject =
    canEditProjects || canEdit('project', { managerId: project.manager?.id })

  // Check if user can assign teams to this project
  const canAssignTeamsToThisProject =
    canAssignTeamsToProjects ||
    (isManager(project.manager?.id) && canEditThisProject)

  // Check if any actions are available
  const hasActions =
    canEditThisProject || canDeleteProjects || canAssignTeamsToThisProject

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        { label: project.name, href: `/projects/${project.id}` },
      ]}
    >
      {project.deleted_at && canDeleteProjects && <RestoreAlert />}
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="flex gap-4">
        <div className="flex flex-col text-left border rounded-xl p-4 gap-2 w-64">
          <h4>{project.name}</h4>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground font-bold mb-1">
              Description
            </p>
            <p className="text-sm">{project.description}</p>
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

          {hasActions && (
            <>
              <Separator />
              {project.deleted_at ? (
                canDeleteProjects && (
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
                )
              ) : (
                <>
                  {canEditThisProject && (
                    <AssignManagerDialog
                      project={project}
                      triggerComponent={
                        <Button variant={'default'}>
                          <Contact /> Assign Manager
                        </Button>
                      }
                    />
                  )}
                  {canAssignTeamsToThisProject && (
                    <Link
                      to="/projects/$projectId/teams"
                      params={{ projectId }}
                      className={buttonVariants({ variant: 'secondary' })}
                    >
                      <Users />
                      Assign Teams
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {canEditThisProject && (
                      <Link
                        to="/projects/$projectId/edit"
                        params={{ projectId }}
                        className={buttonVariants({ variant: 'outline' })}
                      >
                        <Edit />
                        Edit
                      </Link>
                    )}
                    {canDeleteProjects && (
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
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <ProjectTasksCard projectId={projectId} />
        </div>
      </div>
    </MainInsetLayout>
  )
}
