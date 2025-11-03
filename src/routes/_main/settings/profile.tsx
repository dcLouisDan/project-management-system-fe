import { createFileRoute } from '@tanstack/react-router'
import ProfileInformationForm from './-components/profile-information-form'
import UpdatePasswordForm from './-components/update-password-form'

export const Route = createFileRoute('/_main/settings/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h4>Profile Settings</h4>
        <p className="text-xs text-muted-foreground">
          Manage your profile information and settings here.
        </p>
      </div>
      <ProfileInformationForm />
      <UpdatePasswordForm />
    </div>
  )
}
