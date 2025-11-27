import DebouncedInput from '@/components/debounced-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import useManageTasks from '@/hooks/use-manage-tasks'
import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { type Task } from '@/lib/types/task'
import { DEFAULT_TASK_ASSIGN_TO_USER } from '@/lib/types/task'
import { type User } from '@/lib/types/user'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Check, Save } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import useFormReset from '@/hooks/use-form-reset'

interface AssignToUserDialogProps {
  task: Task
  triggerComponent?: ReactNode
}

export default function AssignToUserDialog({
  task,
  triggerComponent = <Button variant="outline">Show Dialog</Button>,
}: AssignToUserDialogProps) {
  const {
    assignToUser,
    validationErrors,
    requestProgress,
    setRequestProgress,
    error,
  } = useManageTasks()
  const [searchName, setSearchName] = useState('')
  const [userData, setUserData] = useState<User | undefined>()
  const { data: users } = useQuery(
    usersQueryOptions({
      page: 1,
      per_page: 5,
      roles: 'admin,team lead,team member',
      name: searchName,
      project_id: task.project_id,
    }),
  )
  const form = useForm({
    defaultValues: DEFAULT_TASK_ASSIGN_TO_USER,
    onSubmit: async ({ value }) => {
      await assignToUser(task.id, value)
    },
  })
  useEffect(() => {
    if (task.assigned_to) {
      form.setFieldValue('assign_to', task.assigned_to.id)
      setUserData(task.assigned_to)
    }
  }, [task])
  useFormReset({ requestProgress, setRequestProgress })
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task ToUser</DialogTitle>
          <DialogDescription>
            Select a user that will be in charge of completing this task.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-2"
        >
          <Separator />
          <div></div>
          <form.Subscribe selector={(state) => state.values.assign_to}>
            {(assigned_toIdState) => (
              <>
                <div className="border rounded-lg p-3">
                  {!assigned_toIdState ? (
                    <p className="text-sm text-muted-foreground text-center">
                      Search and choose a user from the list below.
                    </p>
                  ) : userData ? (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-muted-foreground">
                        Assign to:
                      </span>
                      <span>{userData.name}</span>
                    </div>
                  ) : (
                    <p>User not found.</p>
                  )}
                </div>

                <Separator />
                <DebouncedInput
                  value={searchName}
                  onChange={(value) => setSearchName(value.toString())}
                  debounce={500}
                  placeholder="Search user..."
                />
                <ul className="space-y-2">
                  {users?.data.map((user) => (
                    <li key={user.id}>
                      <Toggle
                        className="toggle-item-parent w-full justify-between"
                        pressed={user.id == assigned_toIdState}
                        onPressedChange={(pressed) => {
                          if (pressed) {
                            setUserData(user)
                            form.setFieldValue('assign_to', user.id)
                          } else {
                            setUserData(undefined)
                            form.setFieldValue('assign_to', undefined)
                          }
                        }}
                      >
                        {user.name}

                        <Check className="[.toggle-item-parent[data-state=on]_&]:block hidden" />
                      </Toggle>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </form.Subscribe>
          {users?.meta && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground text-right">
                Showing {users.meta.per_page} out of {users.meta.total}{' '}
                qualified users
              </p>
            </>
          )}
          <Separator />
          {validationErrors && requestProgress == 'failed' && (
            <ValidationErrorsAlert
              title="Unable to assign task to user"
              errorList={Object.values(validationErrors)}
              description={error ?? 'Check form details and try again.'}
            />
          )}
          <form.Subscribe
            selector={(state) => [state.values.assign_to, state.isSubmitting]}
            children={([assigned_toId, isSubmitting]) => (
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={'outline'}>Close</Button>
                </DialogClose>

                <Button
                  size="lg"
                  type="submit"
                  className="w-40"
                  disabled={!assigned_toId}
                >
                  <Save />
                  {isSubmitting ? '...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
