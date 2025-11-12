import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { DEFAULT_PROJECT_CREATE } from '@/lib/types/project'
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
import { useEffect, useState } from 'react'
import useManageProjects from '@/hooks/use-manage-projects'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import { Textarea } from '@/components/ui/textarea'
import {
  getProgressStatusOptions,
  type ProgressStatus,
} from '@/lib/types/status'
import { BasicSelect } from '@/components/basic-select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { CheckedState } from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'

const PAGE_TITLE = 'Add New Project'
const PAGE_DESCRIPTION = "Add a new project and describe what it's all about."

export const Route = createFileRoute('/_main/projects/create')({
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

const statusSelectOptions = getProgressStatusOptions('milestone')

function RouteComponent() {
  const { create, validationErrors, requestProgress, setRequestProgress } =
    useManageProjects()
  const form = useForm({
    defaultValues: DEFAULT_PROJECT_CREATE,
    onSubmit: async ({ value }) => {
      await create(value)
    },
  })
  const [noDueDate, setNoDueDate] = useState(true)

  const handleNoDueDateCheck = (checked: CheckedState) => {
    if (checked) {
      setNoDueDate(true)
      form.setFieldValue('due_date', undefined)
    } else {
      setNoDueDate(false)
      form.setFieldValue('due_date', dayjs().format('YYYY-MM-DD'))
    }
  }

  useEffect(() => {
    if (requestProgress == 'completed') {
      form.reset()
      setRequestProgress('started')
    }
  }, [requestProgress, setRequestProgress])

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        { label: 'Add', href: '/projects/create' },
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
                  title="Unable to create project"
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
                          {isSubmitting ? '...' : 'Add Project'}
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
