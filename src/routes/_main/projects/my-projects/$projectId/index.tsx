import { APP_NAME } from '@/lib/constants'
import { handleRouteError } from '@/lib/handle-api-error'
import { showProjectQueryOptions } from '@/lib/query-options/show-project-query-options'
import { createFileRoute } from '@tanstack/react-router'
import ProjectNotFoundComponent from './-not-found-component'
import { useSuspenseQuery } from '@tanstack/react-query'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import ProjectDetailContent from '../../-components/project-detail-content'

const PAGE_TITLE = 'Project Details'
const PAGE_DESCRIPTION = 'Show project information and other related data'

export const Route = createFileRoute('/_main/projects/my-projects/$projectId/')({
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
  const { projectId } = Route.useParams()
  const { data: project } = useSuspenseQuery(
    showProjectQueryOptions(Number(projectId)),
  )

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'My Projects', href: '/projects/my-projects' },
        { label: project.name, href: `/projects/my-projects/${project.id}` },
      ]}
    >
      <ProjectDetailContent
        project={project}
        projectId={projectId}
        breadcrumbItems={[
          { label: 'My Projects', href: '/projects/my-projects' },
          { label: project.name, href: `/projects/my-projects/${project.id}` },
        ]}
      />
    </MainInsetLayout>
  )
}
