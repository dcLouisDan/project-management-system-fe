import { createFileRoute } from '@tanstack/react-router'
import { handleRouteError } from '@/lib/handle-api-error'
import MainInsetLayout from '../../-main-inset-layout'
import { Button } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import TeamNotFoundComponent from './-not-found-component'
import useManageTeams from '@/hooks/use-manage-teams'
import { showTeamQueryOptions } from '@/lib/query-options/show-team-query-options'
import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import { BadgePlus } from 'lucide-react'

const PAGE_TITLE = 'Team Details'
const PAGE_DESCRIPTION = 'Show team information and other related data'

export const Route = createFileRoute('/_main/teams/$teamId/edit')({
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
  const { update, validationErrors, requestProgress, setRequestProgress } =
    useManageTeams()
  const teamId = Route.useParams().teamId
  const { data: team } = useSuspenseQuery(showTeamQueryOptions(Number(teamId)))
  const form = useForm({
    defaultValues: {
      name: team.name,
      description: team.description,
    },
    onSubmit: async ({ value }) => {
      await update(team.id, value)
    },
  })

  useEffect(() => {
    if (requestProgress == 'completed') {
      form.reset()
      setRequestProgress('started')
    }
  }, [requestProgress, setRequestProgress])

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Teams', href: '/teams' },
        { label: team.name, href: `/teams/${team.id}` },
        { label: 'Edit', href: `/teams/${team.id}/edit` },
      ]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <Card>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Team information</FieldLegend>
                <FieldDescription>
                  Team name and description of the new team
                </FieldDescription>
                <form.Field
                  validators={{
                    onChange: z.string().min(1),
                  }}
                  name="name"
                >
                  {(field) => (
                    <>
                      <Field>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          placeholder="Development Team"
                          required
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </>
                  )}
                </form.Field>
                <form.Field
                  name="description"
                  validators={{
                    onChange: z.string().optional(),
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        placeholder="Describe the purpose of this team..."
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </FieldSet>

              {validationErrors && requestProgress == 'failed' && (
                <ValidationErrorsAlert
                  title="Unable to update team"
                  errorList={Object.values(validationErrors)}
                />
              )}
              <div>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Field>
                      <div className="flex justify-end">
                        <Button
                          size="lg"
                          type="submit"
                          className="w-40"
                          disabled={!canSubmit}
                        >
                          <BadgePlus />
                          {isSubmitting ? '...' : 'Edit Team'}
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </form>
    </MainInsetLayout>
  )
}
