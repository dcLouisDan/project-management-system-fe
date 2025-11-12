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
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/lib/constants'
import { useForm } from '@tanstack/react-form'
import { DEFAULT_USER_LOGIN } from '@/lib/types/user'
import { PasswordInput } from '../ui/password-input'
import z from 'zod'
import useAuth from '@/hooks/use-auth'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { login, logout, validationErrors } = useAuth()

  const form = useForm({
    defaultValues: DEFAULT_USER_LOGIN,
    onSubmit: async ({ value }) => {
      await logout()
      await login(value.email, value.password, value.remember)
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your {APP_NAME} account</CardDescription>
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
                name="email"
                validators={{
                  onChange: z.email(),
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    </div>
                    <PasswordInput
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="remember">
                {(field) => (
                  <Field>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked ? true : false)
                          }
                          id={field.name}
                        />
                        <Label htmlFor={field.name}>Remember me</Label>
                      </div>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </Field>
                )}
              </form.Field>
              {validationErrors && (
                <div className="text-sm text-red-600">
                  {Object.values(validationErrors).map((msg) => (
                    <div key={msg}>{msg}</div>
                  ))}
                </div>
              )}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Field>
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? '...' : 'Login'}
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
