import { APP_NAME } from '@/lib/constants'
import { handleRouteError } from '@/lib/handle-api-error'
import { showTeamQueryOptions } from '@/lib/query-options/show-team-query-options'
import { createFileRoute, Link } from '@tanstack/react-router'
import TeamNotFoundComponent from './-not-found-component'
import useManageTeams from '@/hooks/use-manage-teams'
import { useSuspenseQuery } from '@tanstack/react-query'
import MainInsetLayout from '../../-main-inset-layout'
import PageHeader from '@/components/page-header'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import { useForm } from '@tanstack/react-form'
import {
  DEFAULT_TEAM_ADD_MEMBERS_BULK,
  type TeamAddMembersBulkItem,
} from '@/lib/types/team'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import TeamUserSelectTable from './-components/team-user-select-table'
import type { SortDirection } from '@/lib/types/ui'
import { Button, buttonVariants } from '@/components/ui/button'
import { Crown, Save, User as UserIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User } from '@/lib/types/user'
import useFormReset from '@/hooks/use-form-reset'
import { Toggle } from '@/components/ui/toggle'
import { snakeCaseToTitleCase } from '@/lib/string-utils'

const PAGE_TITLE = 'Assign Team Members'
const PAGE_DESCRIPTION = 'Add or remove members and assign team roles.'

export interface TeamUsersSelectSearchParams {
  page?: number
  per_page?: number
  name?: string
  role?: string
  roles?: string[]
  sort?: string
  direction?: SortDirection
}

export const Route = createFileRoute('/_main/teams/$teamId/members')({
  component: RouteComponent,
  validateSearch: (search) => search as TeamUsersSelectSearchParams,
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
  const { syncMembers, validationErrors, requestProgress, setRequestProgress } =
    useManageTeams()
  const teamId = Route.useParams().teamId
  const { data: team } = useSuspenseQuery(showTeamQueryOptions(Number(teamId)))
  const form = useForm({
    defaultValues: DEFAULT_TEAM_ADD_MEMBERS_BULK,
    onSubmit: async ({ value }) => {
      await syncMembers(team.id, value)
    },
  })
  const [usersMap, setUsersMap] = useState<Record<number, User>>({})
  const addUserToUsersMap = (user: User) => {
    setUsersMap((prev) => ({ ...prev, [user.id]: user }))
  }
  const deleteUserFromUsersMap = (userId: number) => {
    setUsersMap((prev) => {
      const newMap = prev
      delete newMap[userId]
      return newMap
    })
  }

  const [hasLead, setHasLead] = useState(false)

  useEffect(() => {
    const prevMembersValue: TeamAddMembersBulkItem[] = []
    const prevUsersMap: Record<number, User> = {}
    if (team.lead) {
      prevMembersValue.push({ user_id: team.lead.id, role: 'team lead' })
      prevUsersMap[team.lead.id] = team.lead
    }
    team.members.forEach((member) => {
      prevMembersValue.push({ user_id: member.id, role: 'team member' })
      prevUsersMap[member.id] = member
    })

    form.setFieldValue('members', prevMembersValue)
    setUsersMap(prevUsersMap)
  }, [team])

  useFormReset({ form, requestProgress, setRequestProgress })

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Teams', href: '/teams' },
        { label: team.name, href: `/teams/${team.id}` },
        { label: 'Assign Members', href: `/teams/${team.id}/members` },
      ]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {validationErrors && requestProgress == 'failed' && (
        <ValidationErrorsAlert
          title="Unable to sync team members"
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
        <form.Field name="members" mode="array">
          {(field) => {
            const selectedIds = field.state.value.map((u) => u.user_id)
            return (
              <div className="grid sm:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>
                      Click on the 'Set as Lead' toggle to promote to or demote
                      from being a Leader of the team.
                      <br /> Only users with the 'Team Lead' Role can be
                      assigned as Leader.
                    </CardDescription>
                  </CardHeader>
                  <div className="flex flex-col px-4 gap-2">
                    {field.state.value.map((val, i) => {
                      const id = val.user_id
                      const member = usersMap[id]
                      return (
                        <div
                          key={i}
                          className="flex justify-between border rounded-lg items-center p-2"
                        >
                          <form.Subscribe
                            selector={(state) => state.values.members[i].role}
                          >
                            {(roleState) => (
                              <form.Field name={`members[${i}].role`}>
                                {(rolefield) => (
                                  <Toggle
                                    variant="outline"
                                    pressed={roleState == 'team lead'}
                                    disabled={
                                      (roleState !== 'team lead' && hasLead) ||
                                      !member.roles.includes('team lead')
                                    }
                                    onPressedChange={(pressed) => {
                                      if (pressed) {
                                        rolefield.handleChange('team lead')
                                        setHasLead(true)
                                      } else {
                                        rolefield.handleChange('team member')
                                        setHasLead(false)
                                      }
                                    }}
                                  >
                                    {!hasLead || roleState == 'team lead' ? (
                                      <Crown />
                                    ) : (
                                      <UserIcon />
                                    )}
                                    <span className="hidden sm:inline">
                                      {!hasLead
                                        ? 'Set as Leader'
                                        : snakeCaseToTitleCase(roleState)}
                                    </span>
                                  </Toggle>
                                )}
                              </form.Field>
                            )}
                          </form.Subscribe>
                          <p className="flex-1 px-4">{member.name}</p>
                          <Button
                            type="button"
                            onClick={() => {
                              field.removeValue(i)
                              deleteUserFromUsersMap(val.user_id)
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
                    <CardTitle>Select Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TeamUserSelectTable
                      selectedIds={selectedIds}
                      onUserSelect={(user) => {
                        field.pushValue({
                          user_id: user.id,
                          role: 'team member',
                        })
                        addUserToUsersMap(user)
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
                  to="/teams/$teamId"
                  params={{ teamId }}
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
