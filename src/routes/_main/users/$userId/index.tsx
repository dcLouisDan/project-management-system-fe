import { handleRouteError } from '@/lib/handle-api-error'
import { showUserQueryOptions } from '@/lib/query-options/show-user-query-options'
import { createFileRoute, Link } from '@tanstack/react-router'
import MainInsetLayout from '../../-main-inset-layout'
import { ArchiveRestore, Edit, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import UserAvatar from '@/components/user-avatar'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { RoleDisplayNames, type Role } from '@/lib/types/role'
import { Badge } from '@/components/ui/badge'
import UserNotFoundComponent from './-not-found-component'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import useManageUsers from '@/hooks/use-manage-users'
import { RestoreAlert } from '@/components/restore-alert'

const PAGE_TITLE = 'User Details'
const PAGE_DESCRIPTION = 'Show user information and other related data'

export const Route = createFileRoute('/_main/users/$userId/')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    const id = Number(userId)
    return queryClient.ensureQueryData(showUserQueryOptions(id))
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? loaderData.name + ' - ' + APP_NAME
          : PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
  onError: handleRouteError,
  notFoundComponent: UserNotFoundComponent,
})

function RouteComponent() {
  const userId = Route.useParams().userId
  const { destroy, restore } = useManageUsers()
  const { data: user } = useSuspenseQuery(showUserQueryOptions(Number(userId)))
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Users', href: '/users' },
        { label: user.name, href: `/users/${user.id}` },
      ]}
    >
      {user.deleted_at && <RestoreAlert />}
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="flex gap-4 items-center">
        <div className="flex flex-col text-center border rounded-lg p-4 gap-2 w-64">
          <UserAvatar name={user.name} />
          <div>
            <h4>{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Separator />
          {/* <p className="font-bold text-sm">Roles</p> */}
          <div className="flex flex-col gap-2 items-center w-full">
            {user.roles.map((role) => {
              const displayName = RoleDisplayNames[role as Role]
              return <Badge key={role}>{displayName}</Badge>
            })}
          </div>
          <Separator />
          {user.deleted_at ? (
            <ConfirmationDialog
              description="This user will be reactivated and become accessible throughout the system again."
              triggerComponent={
                <Button variant="default">
                  <ArchiveRestore />
                  Restore
                </Button>
              }
              submitButtonVariant={{ variant: 'default' }}
              submitButtonContent={
                <>
                  <ArchiveRestore /> Restore User
                </>
              }
              onSubmit={async () => await restore(user.id)}
            />
          ) : (
            <>
              <Link
                to="/users/$userId/edit"
                params={{ userId }}
                className={buttonVariants({ variant: 'secondary' })}
              >
                <Edit />
                Edit
              </Link>
              <ConfirmationDialog
                description="This will mark the user as deleted. You can restore this user later if you change your mind."
                triggerComponent={
                  <Button variant="outline">
                    <Trash2 />
                    Delete
                  </Button>
                }
                submitButtonVariant={{ variant: 'destructive' }}
                submitButtonContent={
                  <>
                    <Trash2 /> Delete User
                  </>
                }
                onSubmit={async () => await destroy(user.id)}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-2"></div>
      </div>
    </MainInsetLayout>
  )
}
