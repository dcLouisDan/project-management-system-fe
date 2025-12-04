import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArchiveRestore,
  Calendar,
  Clock,
  Contact,
  Edit,
  History,
  Trash2,
  Users,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import PageHeader from '@/components/page-header'
import { Separator } from '@/components/ui/separator'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageProjects from '@/hooks/use-manage-projects'
import { RestoreAlert } from '@/components/restore-alert'
import AssignManagerDialog from '../../projects/$projectId/-components/assign-manager-dialog'
import UserAvatar from '@/components/user-avatar'
import ProjectTasksCard from '../../projects/$projectId/-components/project-tasks-card'
import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatusBadge from '@/components/status-badge'
import { statusColorMap } from '@/lib/types/status'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import type { Project } from '@/lib/types/project'

interface ProjectDetailContentProps {
  project: Project
  projectId: string
  breadcrumbItems: Array<{ label: string; href: string }>
}

export default function ProjectDetailContent({
  project,
  projectId,
  breadcrumbItems,
}: ProjectDetailContentProps) {
  const { destroy, restore } = useManageProjects()
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

  const completionPercentage =
    project.tasks_count > 0
      ? Math.round((project.completed_tasks_count / project.tasks_count) * 100)
      : 0

  return (
    <>
      {project.deleted_at && canDeleteProjects && <RestoreAlert />}
      <PageHeader title={project.name} description="Show project information and other related data">
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
      </PageHeader>

      {/* Status Badge Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <StatusBadge
          label={project.status}
          colors={statusColorMap[project.status]}
          className="text-sm"
        />
        {project.is_overdue && project.status !== 'completed' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
            <AlertTriangle className="size-4" />
            Overdue
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Project Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Project Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Task Completion
                  </span>
                  <span className="text-sm font-medium">
                    {project.completed_tasks_count} / {project.tasks_count}
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {completionPercentage}% complete
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{project.tasks_count}</p>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{project.teams_count}</p>
                  <p className="text-xs text-muted-foreground">Teams</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Contact className="size-4" />
                  Manager
                </div>
                {project.manager ? (
                  <Link
                    to="/users/$userId"
                    params={{ userId: project.manager.id.toString() }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <UserAvatar
                      name={project.manager.name}
                      className="size-6"
                      textClassName="text-xs"
                    />
                    <span className="text-sm font-medium">
                      {project.manager.name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </div>
              {canEditThisProject && (
                <>
                  <Separator />
                  <AssignManagerDialog
                    project={project}
                    triggerComponent={
                      <Button variant="outline" size="sm" className="w-full">
                        <Contact className="size-4" />
                        Assign Manager
                      </Button>
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Teams Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="size-4" />
                Assigned Teams
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {project.teams.length > 0 ? (
                <div className="space-y-2">
                  {project.teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <span className="text-sm font-medium">{team.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No teams assigned yet
                </p>
              )}
              {canAssignTeamsToThisProject && (
                <>
                  <Separator />
                  <Link
                    to="/projects/$projectId/teams"
                    params={{ projectId }}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                      className: 'w-full',
                    })}
                  >
                    <Users className="size-4" />
                    Manage Teams
                  </Link>
                </>
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
                  <Calendar className="size-4" />
                  Start date
                </div>
                <span className="text-sm font-medium">
                  {dayjs(project.start_date).format('MMM D, YYYY')}
                </span>
              </div>
              {project.due_date && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="size-4" />
                    Due date
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      project.is_overdue &&
                        project.status !== 'completed' &&
                        'text-destructive',
                    )}
                  >
                    {dayjs(project.due_date).format('MMM D, YYYY')}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Created
                </div>
                <span
                  className="text-sm"
                  title={dayjs(project.created_at).format('MMM D, YYYY h:mm A')}
                >
                  {dayjs(project.created_at).fromNow()}
                </span>
              </div>
              {project.updated_at && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="size-4" />
                    Updated
                  </div>
                  <span
                    className="text-sm"
                    title={dayjs(project.updated_at).format(
                      'MMM D, YYYY h:mm A',
                    )}
                  >
                    {dayjs(project.updated_at).fromNow()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          {hasActions && project.deleted_at && canDeleteProjects && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfirmationDialog
                  description="This project will be reactivated and become accessible throughout the system again."
                  triggerComponent={
                    <Button variant="default" className="w-full">
                      <ArchiveRestore />
                      Restore Project
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - Description & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided for this project.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <ProjectTasksCard projectId={projectId} />
        </div>
      </div>
    </>
  )
}

