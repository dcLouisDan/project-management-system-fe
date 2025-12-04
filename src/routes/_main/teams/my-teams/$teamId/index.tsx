import { APP_NAME } from '@/lib/constants'
import { handleRouteError } from '@/lib/handle-api-error'
import { showTeamQueryOptions } from '@/lib/query-options/show-team-query-options'
import { createFileRoute } from '@tanstack/react-router'
import TeamNotFoundComponent from './-not-found-component'
import { useSuspenseQuery } from '@tanstack/react-query'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import TeamDetailContent from '../../-components/team-detail-content'

const PAGE_TITLE = 'Team Details'
const PAGE_DESCRIPTION = 'Show team information and other related data'

export const Route = createFileRoute('/_main/teams/my-teams/$teamId/')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { teamId } }) => {
    const id = Number(teamId)
    return queryClient.ensureQueryData(showTeamQueryOptions(id))
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
  notFoundComponent: TeamNotFoundComponent,
})

function RouteComponent() {
  const { teamId } = Route.useParams()
  const { data: team } = useSuspenseQuery(showTeamQueryOptions(Number(teamId)))

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'My Teams', href: '/teams/my-teams' },
        { label: team.name, href: `/teams/my-teams/${team.id}` },
      ]}
    >
      <TeamDetailContent
        team={team}
        teamId={teamId}
        breadcrumbItems={[
          { label: 'My Teams', href: '/teams/my-teams' },
          { label: team.name, href: `/teams/my-teams/${team.id}` },
        ]}
      />
    </MainInsetLayout>
  )
}
