import { Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArchiveRestore, Edit, Trash2, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
// TeamNotFoundComponent is not needed here as it's handled by the route
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageTeams from '@/hooks/use-manage-teams'
import { RestoreAlert } from '@/components/restore-alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePermissions } from '@/hooks/use-permissions'
import PageHeader from '@/components/page-header'
import type { Team } from '@/lib/types/team'

interface TeamDetailContentProps {
  team: Team
  teamId: string
  breadcrumbItems: Array<{ label: string; href: string }>
}

export default function TeamDetailContent({
  team,
  teamId,
  breadcrumbItems,
}: TeamDetailContentProps) {
  const { destroy, restore } = useManageTeams()
  const { canEditTeams, canDeleteTeams, canManageTeamMembers } = usePermissions()

  // Check if any actions are available
  const hasActions = canEditTeams || canDeleteTeams || canManageTeamMembers

  return (
    <>
      {team.deleted_at && canDeleteTeams && <RestoreAlert />}
      <PageHeader title="Team Details" description="Show team information and other related data" />
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

          {hasActions && (
            <>
              <Separator />
              {team.deleted_at ? (
                canDeleteTeams && (
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
                )
              ) : (
                <>
                  {canManageTeamMembers && (
                    <Link
                      to="/teams/$teamId/members"
                      params={{ teamId }}
                      className={buttonVariants({ variant: 'default' })}
                    >
                      <Users />
                      Assign Members
                    </Link>
                  )}
                  {canEditTeams && (
                    <Link
                      to="/teams/$teamId/edit"
                      params={{ teamId }}
                      className={buttonVariants({ variant: 'secondary' })}
                    >
                      <Edit />
                      Edit
                    </Link>
                  )}
                  {canDeleteTeams && (
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
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="font-bold">Leader:</span> {team.lead?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">Members</p>
              <ul className="list-disc px-4">
                {team.members.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

