import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/lib/constants'
import { PasswordInput } from '../ui/password-input'
import { useForm } from '@tanstack/react-form'
import { DEFAULT_USER_REGISTRATION } from '@/lib/types/user'
import z from 'zod'
import useAppStore from '@/integrations/zustand/app-store'
import { useNavigate } from '@tanstack/react-router'

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const registerUser = useAppStore((state) => state.register)
  const error = useAppStore((state) => state.error)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: DEFAULT_USER_REGISTRATION,
    onSubmit: async ({ value }) => {
      try {
        await registerUser(value)
        navigate({ to: '/dashboard' })
      } catch (error) {
        console.error('Error during registration:', error)
        console.error('Store error message:', error)
      }
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to {APP_NAME}</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card"></FieldSeparator>

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
                        onChange={(e) => field.handleChange(e.target.value)}
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
              <form.Field
                name="password"
                validators={{
                  onChange: z
                    .string()
                    .min(8, 'Password must be at least 8 characters'),
                }}
              >
                {(field) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      type="password"
                      required
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
                        }),
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
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Field>
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? '...' : 'Create Admin Account'}
                    </Button>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
