import type { ApiError } from '@/lib/handle-api-error'
import { showUserQueryOptions } from '@/lib/query-options/show-user-query-options'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { Edit, Trash2, UserX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import UserAvatar from '@/components/user-avatar'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { RoleDisplayNames, type Role } from '@/lib/types/role'
import { Badge } from '@/components/ui/badge'

const PAGE_TITLE = 'User Details'
const PAGE_DESCRIPTION = 'Show user information and other related data'

export const Route = createFileRoute('/_main/users/$userId')({
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
  onError: (err) => {
    const error = err as ApiError
    if (error.status == 404) {
      throw notFound()
    }
  },
  notFoundComponent: () => {
    return (
      <MainInsetLayout
        breadcrumbItems={[
          { label: 'Users', href: '/users' },
          { label: 'Not Found', href: '/users' },
        ]}
      >
        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <UserX className="size-40" />
          <h1>User not Found</h1>
          <p className="max-w-lg text-center">
            We couldn't find the page you're looking for.
          </p>
          <Link className={buttonVariants({ size: 'lg' })} to="/users">
            Back to Users List
          </Link>
        </div>
      </MainInsetLayout>
    )
  },
})

function RouteComponent() {
  const userId = Number(Route.useParams().userId)
  const { data: user } = useSuspenseQuery(showUserQueryOptions(userId))
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Users', href: '/users' },
        { label: user.name, href: `/users/${user.id}` },
      ]}
    >
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
          <div className="flex flex-col items-center w-full">
            {user.roles.map((role) => {
              const displayName = RoleDisplayNames[role as Role]
              return <Badge key={role}>{displayName}</Badge>
            })}
          </div>
          <Separator />
          <Link to="." className={buttonVariants({ variant: 'secondary' })}>
            <Edit />
            Edit
          </Link>
          <Link
            to="."
            className={buttonVariants({
              variant: 'outline',
            })}
          >
            <Trash2 />
            Delete
          </Link>
        </div>
        <div className="flex flex-col gap-2"></div>
      </div>
    </MainInsetLayout>
  )
}
