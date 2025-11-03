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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import useProfileSettings from '@/hooks/use-profile-settings'
import useAppStore from '@/integrations/zustand/app-store'
import { useForm } from '@tanstack/react-form'
import z from 'zod'

export default function ProfileInformationForm() {
  const { user } = useAppStore((state) => state)
  const { updateProfile, validationErrors, error, requestProgress } =
    useProfileSettings()

  if (!user) return null

  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    onSubmit: async ({ value }) => {
      // Call the updateProfile function from the hook
      await updateProfile(value)
    },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
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
                Profile updated successfully.
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
