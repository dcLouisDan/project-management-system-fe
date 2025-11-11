import type { ApiError } from '@/lib/handle-api-error'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import MainInsetLayout from '../../-main-inset-layout'
import { ArchiveRestore, Edit, Trash2, Users } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import TeamNotFoundComponent from './-not-found-component'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageTeams from '@/hooks/use-manage-teams'
import { RestoreAlert } from '@/components/restore-alert'
import { showTeamQueryOptions } from '@/lib/query-options/show-team-query-options'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PAGE_TITLE = 'Team Details'
const PAGE_DESCRIPTION = 'Show team information and other related data'

export const Route = createFileRoute('/_main/teams/$teamId/')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { teamId } }) => {
    const id = Number(teamId)
    try {
      return queryClient.ensureQueryData(showTeamQueryOptions(id))
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
  notFoundComponent: TeamNotFoundComponent,
})

function RouteComponent() {
  const teamId = Route.useParams().teamId
  const { destroy, restore } = useManageTeams()
  const { data: team } = useSuspenseQuery(showTeamQueryOptions(Number(teamId)))
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Teams', href: '/teams' },
        { label: team.name, href: `/teams/${team.id}` },
      ]}
    >
      {team.deleted_at && <RestoreAlert />}
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="flex gap-4">
        <div className="flex flex-col text-left border rounded-xl p-4 gap-2 w-64">
          <h4>{team.name}</h4>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground font-bold mb-1">
              Description
            </p>
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </div>

          <Separator />
          {team.deleted_at ? (
            <ConfirmationDialog
              description="This team will be reactivated and become accessible throughout the system again."
              triggerComponent={
                <Button variant="default">
                  <ArchiveRestore />
                  Restore
                </Button>
              }
              submitButtonVariant={{ variant: 'default' }}
              submitButtonContent={
                <>
                  <ArchiveRestore /> Restore Team
                </>
              }
              onSubmit={async () => await restore(team.id)}
            />
          ) : (
            <>
              <Link
                to="/teams/$teamId/members"
                params={{ teamId }}
                className={buttonVariants({ variant: 'default' })}
              >
                <Users />
                Assign Members
              </Link>
              <Link
                to="/teams/$teamId/edit"
                params={{ teamId }}
                className={buttonVariants({ variant: 'secondary' })}
              >
                <Edit />
                Edit
              </Link>
              <ConfirmationDialog
                description="This will mark the team as deleted. You can restore this team later if you change your mind."
                triggerComponent={
                  <Button variant="outline">
                    <Trash2 />
                    Delete
                  </Button>
                }
                submitButtonVariant={{ variant: 'destructive' }}
                submitButtonContent={
                  <>
                    <Trash2 /> Delete Team
                  </>
                }
                onSubmit={async () => await destroy(team.id)}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <p>Leader</p>
                <p>{team.lead?.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainInsetLayout>
  )
}
