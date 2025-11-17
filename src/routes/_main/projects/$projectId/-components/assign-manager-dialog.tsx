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
import useManageProjects from '@/hooks/use-manage-projects'
import { usersQueryOptions } from '@/lib/query-options/users-query-options'
import { DEFAULT_ASSIGN_MANAGER, type Project } from '@/lib/types/project'
import { type User } from '@/lib/types/user'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Check, Save } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

interface AssignManagerDialogProps {
  project: Project
  triggerComponent?: ReactNode
}

export default function AssignManagerDialog({
  project,
  triggerComponent = <Button variant="outline">Show Dialog</Button>,
}: AssignManagerDialogProps) {
  const {
    assignManager,
    validationErrors,
    requestProgress,
    setRequestProgress,
  } = useManageProjects()
  const [searchName, setSearchName] = useState('')
  const [userData, setUserData] = useState<User | undefined>()
  const { data: users } = useQuery(
    usersQueryOptions({
      page: 1,
      per_page: 5,
      roles: 'project manager,admin',
      name: searchName,
    }),
  )
  const form = useForm({
    defaultValues: DEFAULT_ASSIGN_MANAGER,
    onSubmit: async ({ value }) => {
      await assignManager(project.id, value)
    },
  })
  useEffect(() => {
    if (project.manager) {
      form.setFieldValue('manager_id', project.manager.id)
      setUserData(project.manager)
    }
  }, [project])
  useEffect(() => {
    if (requestProgress == 'completed') {
      setRequestProgress('started')
    }
  }, [requestProgress, setRequestProgress])
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project Manager</DialogTitle>
          <DialogDescription>
            Select a user that will act as the manager for this project. Only
            users with a 'Project Manager' role are qualified.
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
          <form.Subscribe selector={(state) => state.values.manager_id}>
            {(managerIdState) => (
              <>
                <div className="border rounded-lg p-3">
                  {!managerIdState ? (
                    <p className="text-sm text-muted-foreground text-center">
                      Search and choose a user from the list below.
                    </p>
                  ) : userData ? (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-muted-foreground">
                        Project Manager:
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
                        pressed={user.id == managerIdState}
                        onPressedChange={(pressed) => {
                          if (pressed) {
                            setUserData(user)
                            form.setFieldValue('manager_id', user.id)
                          } else {
                            setUserData(undefined)
                            form.setFieldValue('manager_id', undefined)
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
              title="Unable to sync team members"
              errorList={Object.values(validationErrors)}
            />
          )}
          <form.Subscribe
            selector={(state) => [state.values.manager_id, state.isSubmitting]}
            children={([managerId, isSubmitting]) => (
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={'outline'}>Close</Button>
                </DialogClose>

                <Button
                  size="lg"
                  type="submit"
                  className="w-40"
                  disabled={!managerId}
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
