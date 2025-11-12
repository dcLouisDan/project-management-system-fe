import type { ApiError } from '@/lib/handle-api-error'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import MainInsetLayout from '../../-main-inset-layout'
import { ArchiveRestore, Edit, Trash2, Users } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageProjects from '@/hooks/use-manage-projects'
import { RestoreAlert } from '@/components/restore-alert'
import { showProjectQueryOptions } from '@/lib/query-options/show-project-query-options'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProjectNotFoundComponent from './-not-found-component'

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
              <Link
                to="/projects/$projectId/edit"
                params={{ projectId }}
                className={buttonVariants({ variant: 'secondary' })}
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
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1"></div>
      </div>
    </MainInsetLayout>
  )
}
