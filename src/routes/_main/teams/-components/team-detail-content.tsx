import { Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  ArchiveRestore,
  Calendar,
  Clock,
  Edit,
  FolderKanban,
  History,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageTeams from '@/hooks/use-manage-teams'
import { RestoreAlert } from '@/components/restore-alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePermissions } from '@/hooks/use-permissions'
import PageHeader from '@/components/page-header'
import UserAvatar from '@/components/user-avatar'
import dayjs from '@/lib/dayjs'
import type { Team } from '@/lib/types/team'

interface TeamDetailContentProps {
  team: Team
  teamId: string
  breadcrumbItems: Array<{ label: string; href: string }>
}

export default function TeamDetailContent({
  team,
  teamId,
}: TeamDetailContentProps) {
  const { destroy, restore } = useManageTeams()
  const { canEditTeams, canDeleteTeams, canManageTeamMembers } =
    usePermissions()

  return (
    <>
      {team.deleted_at && canDeleteTeams && <RestoreAlert />}
      <PageHeader
        title={team.name}
        description="Show team information and other related data"
      >
        {!team.deleted_at && (
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
                className={buttonVariants({ variant: 'outline' })}
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
        {team.deleted_at && canDeleteTeams && (
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
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Team Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* People Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="size-4" />
                People
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="size-4" />
                  Team Lead
                </div>
                {team.lead ? (
                  <Link
                    to="/users/$userId"
                    params={{ userId: team.lead.id.toString() }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <UserAvatar
                      name={team.lead.name}
                      className="size-6"
                      textClassName="text-xs"
                    />
                    <span className="text-sm font-medium">
                      {team.lead.name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No leader assigned
                  </span>
                )}
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Users className="size-4" />
                  Members ({team.members.length})
                </div>
                {team.members.length > 0 ? (
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <Link
                        key={member.id}
                        to="/users/$userId"
                        params={{ userId: member.id.toString() }}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <UserAvatar
                          name={member.name}
                          className="size-6"
                          textClassName="text-xs"
                        />
                        <p className="text-sm font-medium text-right w-full">
                          {member.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No members assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FolderKanban className="size-4" />
                Projects ({team.projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {team.projects.length > 0 ? (
                <div className="space-y-2">
                  {team.projects.map((project) => (
                    <Link
                      key={project.id}
                      to="/projects/$projectId"
                      params={{ projectId: project.id.toString() }}
                      className="block p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {project.name}
                      </span>
                      {project.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {project.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No projects assigned
                </p>
              )}
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="size-4" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Created
                </div>
                <span
                  className="text-sm"
                  title={dayjs(team.created_at).format('MMM D, YYYY h:mm A')}
                >
                  {dayjs(team.created_at).fromNow()}
                </span>
              </div>
              {team.updated_at && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="size-4" />
                    Updated
                  </div>
                  <span
                    className="text-sm"
                    title={dayjs(team.updated_at).format('MMM D, YYYY h:mm A')}
                  >
                    {dayjs(team.updated_at).fromNow()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Description */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {team.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided for this team.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
