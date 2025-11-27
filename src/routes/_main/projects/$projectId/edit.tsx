import { createFileRoute } from '@tanstack/react-router'
import { handleRouteError } from '@/lib/handle-api-error'
import MainInsetLayout from '../../-main-inset-layout'
import { Button } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import ProjectNotFoundComponent from './-not-found-component'
import useManageProjects from '@/hooks/use-manage-projects'
import { showProjectQueryOptions } from '@/lib/query-options/show-project-query-options'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import useFormReset from '@/hooks/use-form-reset'
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
import type { CheckedState } from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { BasicSelect } from '@/components/basic-select'
import {
  getProgressStatusOptions,
  type ProgressStatus,
} from '@/lib/types/status'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { ProjectUpdate } from '@/lib/types/project'

const PAGE_TITLE = 'Project Details'
const PAGE_DESCRIPTION = 'Show project information and other related data'

const statusSelectOptions = getProgressStatusOptions('milestone')

export const Route = createFileRoute('/_main/projects/$projectId/edit')({
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
  const { update, validationErrors, requestProgress, setRequestProgress } =
    useManageProjects()
  const projectId = Route.useParams().projectId
  const { data: project } = useSuspenseQuery(
    showProjectQueryOptions(Number(projectId)),
  )
  const form = useForm({
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: dayjs(project.start_date).format('YYYY-MM-DD'),
      due_date: project.due_date
        ? dayjs(project.due_date).format('YYYY-MM-DD')
        : undefined,
    },
    onSubmit: async ({ value }) => {
      const data: ProjectUpdate = { ...value }
      await update(project.id, data)
    },
  })
  const [noDueDate, setNoDueDate] = useState(!project.due_date)

  const handleNoDueDateCheck = (checked: CheckedState) => {
    if (checked) {
      setNoDueDate(true)
      form.setFieldValue('due_date', undefined)
    } else {
      setNoDueDate(false)
      form.setFieldValue('due_date', dayjs().format('YYYY-MM-DD'))
    }
  }

  useFormReset({ form, requestProgress, setRequestProgress })

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        { label: project.name, href: `/projects/${project.id}` },
        { label: 'Edit', href: `/projects/${project.id}/edit` },
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
                <FieldLegend>Project information</FieldLegend>
                <FieldDescription>
                  Project name and description of the new project
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
                          placeholder="Development Project"
                          required
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </>
                  )}
                </form.Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <form.Field name="status">
                    {(field) => (
                      <>
                        <Field>
                          <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                          <BasicSelect
                            items={statusSelectOptions}
                            label="Status"
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(value as ProgressStatus)
                            }
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      </>
                    )}
                  </form.Field>

                  <form.Field name="start_date">
                    {(field) => (
                      <>
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Start Date
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="date"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      </>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => state.values.due_date}>
                    {(stateValue) => (
                      <form.Field name="due_date">
                        {(field) => (
                          <>
                            <Field>
                              <div className="flex items-center justify-between">
                                <FieldLabel htmlFor={field.name}>
                                  Due Date
                                </FieldLabel>
                                <div className="flex gap-2">
                                  <Checkbox
                                    checked={noDueDate}
                                    onCheckedChange={handleNoDueDateCheck}
                                    id="no-due-date"
                                  />
                                  <Label htmlFor="no-due-date">
                                    No due date
                                  </Label>
                                </div>
                              </div>
                              <Input
                                id={field.name}
                                disabled={noDueDate}
                                type="date"
                                value={stateValue}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              <FieldError errors={field.state.meta.errors} />
                            </Field>
                          </>
                        )}
                      </form.Field>
                    )}
                  </form.Subscribe>
                </div>
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
                        placeholder="Describe the purpose of this project..."
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
                  title="Unable to update project"
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
                          {isSubmitting ? '...' : 'Update Project'}
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
