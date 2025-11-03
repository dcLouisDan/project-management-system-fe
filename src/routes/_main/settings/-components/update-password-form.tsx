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
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import useProfileSettings from '@/hooks/use-profile-settings'
import { useForm } from '@tanstack/react-form'
import z from 'zod'

export default function UpdatePasswordForm() {
  const { changePassword, validationErrors, error, requestProgress } =
    useProfileSettings()

  const form = useForm({
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
    onSubmit: async ({ value }) => {
      // Call the updateProfile function from the hook
      await changePassword(value)
    },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
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
            <form.Field
              name="current_password"
              validators={{
                onChange: z
                  .string()
                  .min(8, 'Password must be at least 8 characters'),
              }}
            >
              {(field) => (
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor={field.name}>
                      Current Password
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    type="password"
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
                  const passwordValue = fieldApi.form.getFieldValue('password')
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
            {validationErrors && (
              <div className="text-sm text-red-600">
                {Object.values(validationErrors).map((msg) => (
                  <div key={msg}>{msg}</div>
                ))}
              </div>
            )}
            {!validationErrors && error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {requestProgress === 'completed' && (
              <div className="text-sm text-green-600">
                Password updated successfully.
              </div>
            )}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit} className="w-fit">
                  {isSubmitting ? '...' : 'Save Changes'}
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
