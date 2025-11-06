import type { ApiError } from '@/lib/handle-api-error'
import { showUserQueryOptions } from '@/lib/query-options/show-user-query-options'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import UserNotFoundComponent from './-not-found-component'
import { APP_NAME } from '@/lib/constants'

import PageHeader from '@/components/page-header'
import { generatePassword } from '@/lib/string-utils'
import { type UserUpdate } from '@/lib/types/user'
import { useForm } from '@tanstack/react-form'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import z from 'zod'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import RolesToggleSelect from '@/components/roles-toggle-select'
import { UserPen, UserPlus } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import type { Role } from '@/lib/types/role'
import useManageUsers from '@/hooks/use-manage-users'
import { ValidationErrorsAlert } from '@/components/validation-errors-alert'
import UserAvatar from '@/components/user-avatar'
import MainInsetLayout from '../../-main-inset-layout'
import { useSuspenseQuery } from '@tanstack/react-query'

const PAGE_TITLE = 'Edit User'
const PAGE_DESCRIPTION = 'Edit user information and other related data'

export const Route = createFileRoute('/_main/users/$userId/edit')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    const id = Number(userId)
    try {
      return queryClient.ensureQueryData(showUserQueryOptions(id))
    } catch (error) {
      console.log('Loader error:', error)
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? PAGE_TITLE + ' - ' + loaderData.name + ' - ' + APP_NAME
          : PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
  onError: (err) => {
    const error = err as ApiError
    if (error.status == 404) {
      throw notFound()
    }
  },
  notFoundComponent: UserNotFoundComponent,
})

function RouteComponent() {
  const userId = Route.useParams().userId
  const { data: user } = useSuspenseQuery(showUserQueryOptions(Number(userId)))
  const { update, validationErrors, requestProgress, setRequestProgress } =
    useManageUsers()
  const form = useForm({
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
      roles: user.roles ?? [],
    } as UserUpdate,
    onSubmit: async ({ value }) => {
      await update(Number(userId), value)
    },
  })

  useEffect(() => {
    if (requestProgress == 'completed') {
      form.reset()
      setRequestProgress('started')
    }
  }, [requestProgress, setRequestProgress])

  const handleGeneratePasswordClick = useCallback(() => {
    const newPassword = generatePassword({
      useSymbols: false,
    })

    form.setFieldValue('password', newPassword)
    form.setFieldValue('password_confirmation', newPassword)
  }, [form])
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Users', href: '/users' },
        { label: user.name, href: `/users/${user.id}` },
        { label: 'Edit', href: `/users/${user.id}/edit` },
      ]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="flex flex-col sm:flex-row align-top gap-8">
        <div className="flex flex-col gap-4">
          <form.Subscribe
            selector={(state) => state.values.name}
            children={(name) => <UserAvatar name={name} />}
          />
        </div>
        <div className="flex-1">
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
                    <FieldLegend>Account information</FieldLegend>
                    <FieldDescription>
                      User details and login credentials of the new user
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
                              placeholder="John Doe"
                              required
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        </>
                      )}
                    </form.Field>
                    <form.Field
                      name="email"
                      validators={{
                        onChange: z.email('Invalid email address'),
                      }}
                    >
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            id={field.name}
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                  </FieldSet>
                  <FieldSeparator />
                  <FieldSet>
                    <FieldLegend>Reset Password (optional)</FieldLegend>
                    <FieldDescription>
                      Enter a new password or leave blank to keep the current
                      one.
                    </FieldDescription>
                    <form.Field
                      name="password"
                      validators={{
                        onChange: z
                          .string()
                          .min(8, 'Password must be at least 8 characters')
                          .optional(),
                      }}
                    >
                      {(field) => (
                        <Field>
                          <div className="flex items-center justify-between">
                            <FieldLabel htmlFor={field.name}>
                              Password
                            </FieldLabel>
                            <Button
                              type="button"
                              variant="link"
                              onClick={handleGeneratePasswordClick}
                            >
                              Generate
                            </Button>
                          </div>
                          <PasswordInput
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldDescription className="ml-auto">
                            Must be at least 8 characters
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                    <form.Field
                      name="password_confirmation"
                      validators={{
                        onChangeListenTo: ['password'],
                        onChange: ({ fieldApi }) => {
                          const passwordValue =
                            fieldApi.form.getFieldValue('password')
                          return fieldApi.parseValueWithSchema(
                            z
                              .string()
                              .min(8, 'Password must be at least 8 characters')
                              .refine((val) => val === passwordValue, {
                                message: 'Passwords do not match',
                              })
                              .optional(),
                          )
                        },
                      }}
                    >
                      {(field) => (
                        <Field>
                          <div className="flex items-center">
                            <FieldLabel htmlFor={field.name}>
                              Confirm Password
                            </FieldLabel>
                          </div>
                          <PasswordInput
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                  </FieldSet>

                  <FieldSeparator />
                  <FieldSet>
                    <FieldLegend>Roles</FieldLegend>
                    <FieldDescription>
                      Assign one or more roles to the new user
                    </FieldDescription>
                    <form.Field name="roles">
                      {(field) => (
                        <>
                          <Field>
                            <RolesToggleSelect
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value as Role[])
                              }
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        </>
                      )}
                    </form.Field>
                  </FieldSet>
                  <FieldSeparator />
                  {validationErrors && requestProgress == 'failed' && (
                    <ValidationErrorsAlert
                      title="Unable to create user"
                      errorList={Object.values(validationErrors)}
                    />
                  )}
                  <div>
                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                      children={([canSubmit, isSubmitting]) => (
                        <Field>
                          <div className="flex gap-2 justify-end">
                            <Link
                              to="/users/$userId"
                              params={{ userId }}
                              className={buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                              })}
                            >
                              Cancel
                            </Link>
                            <Button
                              size="lg"
                              type="submit"
                              className="w-40"
                              disabled={!canSubmit}
                            >
                              <UserPen />
                              {isSubmitting ? '...' : 'Update User'}
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
        </div>
      </div>
    </MainInsetLayout>
  )
}
