import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { Button } from '@/components/ui/button'
import useManageTasks from '@/hooks/use-manage-tasks'
import useAppStore from '@/integrations/zustand/app-store'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import {
  Hourglass,
  NotebookPen,
  Play,
  Send,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from '@tanstack/react-form'
import { DEFAULT_TASK_REVIEW_SUBMIT, type TaskReview } from '@/lib/types/task'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { type ProgressStatus } from '@/lib/types/status'
import { snakeCaseToTitleCase } from '@/lib/string-utils'
import { useMemo } from 'react'
import useFormReset from '@/hooks/use-form-reset'
import IconRadioGroup, {
  type IconSelectItem,
} from '@/components/icon-radio-group'
import dayjs from 'dayjs'
import { Separator } from '@/components/ui/separator'
import TaskReviewDialog from './task-review-dialog'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'

const reviewStatusOptions: IconSelectItem[] = [
  {
    value: 'approved',
    label: 'Approve',
    icon: ThumbsUp,
  },
  {
    value: 'rejected',
    label: 'Reject',
    icon: ThumbsDown,
    colors: {
      background: 'bg-destructive',
      foreground: 'text-white/80',
    },
  },
]

interface TaskReviewerDialogProps {}

export default function TaskReviewerDialog({}: TaskReviewerDialogProps) {
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
    startReview,
    submitReview,
    validationErrors,
    requestProgress,
    setRequestProgress,
  } = useManageTasks()
  const form = useForm({
    defaultValues: DEFAULT_TASK_REVIEW_SUBMIT,
    onSubmit: async ({ value }) => {
      if (!task || !review) return
      await submitReview(task.id, review.id, value)
    },
  })
  const reviewStatusArr: ProgressStatus[] = ['awaiting_review', 'under_review']

  if (!task || !task.assigned_by || task.assigned_by?.id !== user?.id) {
    return null
  }

  if (
    review &&
    (task.status == 'completed' || !reviewStatusArr.includes(review.status))
  ) {
    return <TaskReviewDialog prefix="Review" task={task} />
  }

  if (!reviewStatusArr.includes(task.status) || !review) {
    return (
      <Button disabled>
        <Hourglass /> {snakeCaseToTitleCase(task.status)}
      </Button>
    )
  }

  useFormReset({ form, requestProgress, setRequestProgress })

  if (task.status == 'awaiting_review') {
    return (
      <ConfirmationDialog
        description="This action will mark the task as 'Under Review'. This action cannot be undone."
        triggerComponent={
          <Button variant="default">
            <NotebookPen />
            Start Review
          </Button>
        }
        submitButtonVariant={{ variant: 'default' }}
        submitButtonContent={
          <>
            <Play /> Start
          </>
        }
        onSubmit={async () => await startReview(task.id, review.id)}
      />
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send /> Review Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Submit Task Review</DialogTitle>
          <DialogDescription>
            Accept or Reject the submitted task. Write a feedback that supports
            your decision. By submitting this form, the review will be visible
            to the assignee.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid sm:grid-cols-2 sm:divide-x-2">
          <div className="flex flex-col sm:pe-2">
            <p className="font-bold">{task.title}</p>
            <div className="text-xs text-muted-foreground flex gap-2">
              <p className="">{dayjs(review.created_at).fromNow()}</p>|
              <p className="">{task.assigned_to?.name}</p>
            </div>
            <div className="p-2 mt-2 border rounded-lg h-full overflow-y-auto text-sm">
              <p>{review.submission_notes}</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="sm:ps-2 pt-4 sm:pt-0"
          >
            {validationErrors && requestProgress == 'failed' && (
              <ValidationErrorsAlert
                title="Unable to assign reviewer"
                errorList={Object.values(validationErrors)}
              />
            )}
            <FieldGroup>
              <form.Field name="status">
                {(field) => (
                  <Field>
                    <IconRadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as ProgressStatus)
                      }
                      items={reviewStatusOptions}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="feedback">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Feedback</FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="Write a feedback regarding the submitted task..."
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
                          {isSubmitting ? '...' : 'Submit Review'}
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
