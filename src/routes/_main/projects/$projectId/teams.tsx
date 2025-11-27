import { APP_NAME } from '@/lib/constants'
import type { SortDirection } from '@/lib/types/ui'
import { createFileRoute, Link } from '@tanstack/react-router'

import { handleRouteError } from '@/lib/handle-api-error'
import { showProjectQueryOptions } from '@/lib/query-options/show-project-query-options'
import useManageProjects from '@/hooks/use-manage-projects'
import { useSuspenseQuery } from '@tanstack/react-query'
import MainInsetLayout from '../../-main-inset-layout'
import PageHeader from '@/components/page-header'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import { useForm } from '@tanstack/react-form'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Team } from '@/lib/types/team'
import useFormReset from '@/hooks/use-form-reset'
import ProjectNotFoundComponent from './-not-found-component'
import { DEFAULT_PROJECT_SYNC_TEAMS } from '@/lib/types/project'
import ProjectTeamsSelectTable from './-components/project-team-select-table'

const PAGE_TITLE = 'Assign Project Projects'
const PAGE_DESCRIPTION = 'Add or remove projects assigned to this project.'

export interface ProjectTeamsSelectSearchParams {
  page?: number
  per_page?: number
  name?: string
  sort?: string
  direction?: SortDirection
}

export const Route = createFileRoute('/_main/projects/$projectId/teams')({
  component: RouteComponent,
  validateSearch: (search) => search as ProjectTeamsSelectSearchParams,
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
  const { syncTeams, validationErrors, requestProgress, setRequestProgress } =
    useManageProjects()
  const projectId = Route.useParams().projectId
  const { data: project } = useSuspenseQuery(
    showProjectQueryOptions(Number(projectId)),
  )
  const form = useForm({
    defaultValues: DEFAULT_PROJECT_SYNC_TEAMS,
    onSubmit: async ({ value }) => {
      await syncTeams(project.id, value)
    },
  })
  const [teamsMap, setTeamsMap] = useState<Record<number, Team>>({})
  const addTeamToTeamsMap = (team: Team) => {
    setTeamsMap((prev) => ({ ...prev, [team.id]: team }))
  }
  const deleteTeamFromTeamsMap = (teamId: number) => {
    setTeamsMap((prev) => {
      const newMap = prev
      delete newMap[teamId]
      return newMap
    })
  }

  useEffect(() => {
    const prevTeamsValue: number[] = []
    const prevTeamsMap: Record<number, Team> = {}
    project.teams.forEach((team) => {
      prevTeamsValue.push(team.id)
      prevTeamsMap[team.id] = team
    })

    form.setFieldValue('team_ids', prevTeamsValue)
    setTeamsMap(prevTeamsMap)
  }, [project])

  useFormReset({ form, requestProgress, setRequestProgress })

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        { label: project.name, href: `/projects/${project.id}` },
        { label: 'Project Teams', href: `/projects/${projectId}/teams` },
      ]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {validationErrors && requestProgress == 'failed' && (
        <ValidationErrorsAlert
          title="Unable to sync project teams"
          errorList={Object.values(validationErrors)}
        />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="team_ids" mode="array">
          {(field) => {
            const selectedIds = field.state.value
            return (
              <div className="grid sm:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Teams</CardTitle>
                  </CardHeader>
                  <div className="flex flex-col px-4 gap-2">
                    {field.state.value.map((val, i) => {
                      const id = val
                      const team = teamsMap[id]
                      return (
                        <div
                          key={i}
                          className="flex justify-between border rounded-lg items-center p-2"
                        >
                          <p className="flex-1 px-4">{team.name}</p>
                          <Button
                            type="button"
                            onClick={() => {
                              field.removeValue(i)
                              deleteTeamFromTeamsMap(val)
                            }}
                          >
                            <X />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectTeamsSelectTable
                      selectedIds={selectedIds}
                      onTeamSelect={(team) => {
                        field.pushValue(team.id)
                        addTeamToTeamsMap(team)
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            )
          }}
        </form.Field>
        <div className="mt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className="flex justify-end gap-2">
                <Link
                  to="/projects/$projectId"
                  params={{ projectId }}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                  })}
                >
                  Cancel
                </Link>
                <Button
                  size="lg"
                  type="submit"
                  className="w-40"
                  disabled={!canSubmit}
                >
                  <Save />
                  {isSubmitting ? '...' : 'Save Changes'}
                </Button>
              </div>
            )}
          />
        </div>
      </form>
    </MainInsetLayout>
  )
}
