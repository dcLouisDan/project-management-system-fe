import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { DEFAULT_TEAM_CREATE } from '@/lib/types/team'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
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
import z from 'zod'
import { Input } from '@/components/ui/input'
import { BadgePlus } from 'lucide-react'
import useManageTeams from '@/hooks/use-manage-teams'
import useFormReset from '@/hooks/use-form-reset'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import { Textarea } from '@/components/ui/textarea'

const PAGE_TITLE = 'Add New Team'
const PAGE_DESCRIPTION =
  'Add a new team and describe its role within the company.'

export const Route = createFileRoute('/_main/teams/create')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
})

function RouteComponent() {
  const { create, validationErrors, requestProgress, setRequestProgress } =
    useManageTeams()
  const form = useForm({
    defaultValues: DEFAULT_TEAM_CREATE,
    onSubmit: async ({ value }) => {
      await create(value)
    },
  })

  useFormReset({ form, requestProgress, setRequestProgress })

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Teams', href: '/teams' },
        { label: 'Add', href: '/teams/create' },
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
                  title="Unable to create team"
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
                          {isSubmitting ? '...' : 'Add Team'}
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
