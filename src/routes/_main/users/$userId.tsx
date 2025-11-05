import type { ApiError } from '@/lib/handle-api-error'
import { showUserQueryOptions } from '@/lib/query-options/show-user-query-options'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { UserX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_main/users/$userId')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    const id = Number(userId)
    return queryClient.ensureQueryData(showUserQueryOptions(id))
  },
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
      <div className="flex gap-2">{user.name}</div>
    </MainInsetLayout>
  )
}
