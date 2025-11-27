import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { Button } from '@/components/ui/button'
import useManageTasks from '@/hooks/use-manage-tasks'
import useAppStore from '@/integrations/zustand/app-store'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Play, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from '@tanstack/react-form'
import { DEFAULT_TASK_SUBMIT, type TaskReview } from '@/lib/types/task'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { type ProgressStatus } from '@/lib/types/status'
import { useMemo } from 'react'
import TaskReviewDialog from './task-review-dialog'
import useFormReset from '@/hooks/use-form-reset'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'

interface TaskAssigneeDialogProps {}

export default function TaskAssigneeDialog({}: TaskAssigneeDialogProps) {
  const { user } = useAppStore((state) => state)
  const { taskId } = useParams({
    from: '/_main/projects/$projectId/tasks/$taskId/',
  })
  const { data: task } = useQuery(showTaskQueryOptions(Number(taskId)))
  const review: TaskReview | null = useMemo(() => {
    if (!task) return null

    if (task.reviews.length == 0) return null

    return task.reviews[0]
  }, [task?.reviews])
  const {
    start,
    submit,
    requestProgress,
    setRequestProgress,
    validationErrors,
  } = useManageTasks()
  const form = useForm({
    defaultValues: DEFAULT_TASK_SUBMIT,
    onSubmit: async ({ value }) => {
      if (!task) return
      await submit(task?.id, value)
    },
  })
  const reviewStatusArr: ProgressStatus[] = [
    'awaiting_review',
    'under_review',
    'completed',
  ]

  useFormReset({ form, requestProgress, setRequestProgress })

  if (!task || !task.assigned_to || task.assigned_to?.id !== user?.id) {
    return null
  }

  if (task.status == 'not_started') {
    return (
      <ConfirmationDialog
        description="This action will mark the task as 'In Progress'. This action cannot be undone."
        triggerComponent={
          <Button variant="default">
            <Play />
            Start Task
          </Button>
        }
        submitButtonVariant={{ variant: 'default' }}
        submitButtonContent={
          <>
            <Play /> Start
          </>
        }
        onSubmit={async () => await start(task.id)}
      />
    )
  }

  if (review && reviewStatusArr.includes(task.status)) {
    return <TaskReviewDialog prefix="Submission" task={task} />
  }

  return (
    <>
      {review && <TaskReviewDialog prefix="Submission" task={task} />}
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Send />
            Submit Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Task</DialogTitle>
            <DialogDescription>
              Write a note that describes how you completed the task. By
              submitting this form, the task will be submitted to your
              supervisor for review.
            </DialogDescription>
          </DialogHeader>

          {validationErrors && requestProgress == 'failed' && (
            <ValidationErrorsAlert
              title="Unable to assign user"
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
            <FieldGroup>
              <form.Field name="notes">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Submission Notes
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="Write notes..."
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-64"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
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
                          <Send />
                          {isSubmitting ? '...' : 'Submit Task'}
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
