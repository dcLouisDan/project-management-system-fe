import { UserX } from 'lucide-react'
import MainInsetLayout from '../../-main-inset-layout'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export default function UserNotFoundComponent() {
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
}
