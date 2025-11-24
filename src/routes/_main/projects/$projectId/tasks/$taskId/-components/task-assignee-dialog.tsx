import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { Button } from '@/components/ui/button'
import useManageTasks from '@/hooks/use-manage-tasks'
import useAppStore from '@/integrations/zustand/app-store'
import { showTaskQueryOptions } from '@/lib/query-options/show-task-query-options'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Check, Hourglass, Play, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from '@tanstack/react-form'
import { DEFAULT_TASK_SUBMIT } from '@/lib/types/task'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import type { ProgressStatus } from '@/lib/types/status'
import { snakeCaseToTitleCase } from '@/lib/string-utils'

interface TaskAssigneeDialogProps {}

export default function TaskAssigneeDialog({}: TaskAssigneeDialogProps) {
  const { user } = useAppStore((state) => state)
  const { taskId } = useParams({
    from: '/_main/projects/$projectId/tasks/$taskId/',
  })
  const { data: task } = useQuery(showTaskQueryOptions(Number(taskId)))
  const { start, submit } = useManageTasks()
  const form = useForm({
    defaultValues: DEFAULT_TASK_SUBMIT,
    onSubmit: async ({ value }) => {
      console.log('Submit click')
      if (!task) return
      await submit(task?.id, value)
    },
  })
  const reviewStatusArr: ProgressStatus[] = ['awaiting_review', 'under_review']

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
            Start
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

  if (reviewStatusArr.includes(task.status)) {
    return (
      <Button disabled>
        <Hourglass /> {snakeCaseToTitleCase(task.status)}
      </Button>
    )
  }

  if (task.status == 'completed') {
    return (
      <Button variant="success" disabled>
        <Check /> {snakeCaseToTitleCase(task.status)}
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send /> Submit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
          <DialogDescription>
            Write a note that describes how you completed the task. By
            submitting this form, the task will be submitted to your supervisor
            for review.
          </DialogDescription>
        </DialogHeader>
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
                  <FieldLabel htmlFor={field.name}>Submission Notes</FieldLabel>
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
  )
}
