import { handleRouteError } from '@/lib/handle-api-error'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import TaskNotFoundComponent from './-not-found-component'
import { APP_NAME } from '@/lib/constants'
import PageHeader from '@/components/page-header'
import useManageTasks from '@/hooks/use-manage-tasks'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import useFormReset from '@/hooks/use-form-reset'
import dayjs from 'dayjs'
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
import { BasicSelect } from '@/components/basic-select'
import { priorityLevelOptions, type PriorityLevel } from '@/lib/types/priority'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import { Button } from '@/components/ui/button'
import { NotepadText } from 'lucide-react'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'

const PAGE_TITLE = 'Edit Task'
const PAGE_DESCRIPTION = 'Add a new task that can be assigned to your team.'

export const Route = createFileRoute(
  '/_main/projects/$projectId/tasks/$taskId/edit',
)({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    const id = Number(taskId)
    return queryClient.ensureQueryData(showTaskQueryOptions(id))
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? loaderData.title + ' - Edit Task' + ' - ' + APP_NAME
          : PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
  onError: handleRouteError,
  notFoundComponent: TaskNotFoundComponent,
})

function RouteComponent() {
  const { projectId, taskId } = Route.useParams()
  const { data: task } = useSuspenseQuery(showTaskQueryOptions(Number(taskId)))

  const { update, validationErrors, requestProgress, setRequestProgress } =
    useManageTasks()

  const form = useForm({
    defaultValues: {
      title: task.title,
      priority: task.priority,
      due_date: task.due_date,
      description: task.description,
      project_id: task.project_id,
    },
    onSubmit: async ({ value }) => {
      await update(task.id, value)
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

  useFormReset({ form, requestProgress, setRequestProgress })
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        {
          label: task.project ? task.project.name : 'Project',
          href: `/projects/${projectId}`,
        },
        {
          label: 'Edit Task',
          href: `/projects/${projectId}/tasks/${taskId}/edit`,
        },
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
                <FieldLegend>Task information</FieldLegend>
                <FieldDescription>
                  Task title and other related details of the new task
                </FieldDescription>
                <form.Field
                  validators={{
                    onChange: z.string().min(1),
                  }}
                  name="title"
                >
                  {(field) => (
                    <>
                      <Field>
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          placeholder="Task Title"
                          required
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </>
                  )}
                </form.Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="priority">
                    {(field) => (
                      <>
                        <Field>
                          <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                          <BasicSelect
                            items={priorityLevelOptions}
                            label="Priority"
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(value as PriorityLevel)
                            }
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
                        placeholder="Describe the specifics of this task..."
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
                  title="Unable to update task"
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
                          <NotepadText />
                          {isSubmitting ? '...' : 'Edit Task'}
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
