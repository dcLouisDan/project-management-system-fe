import { BadgeQuestionMark } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'

export default function TaskNotFoundComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'My Tasks', href: '/tasks/my-tasks' },
        { label: 'Task Not Found', href: '/tasks/my-tasks' },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <BadgeQuestionMark className="size-40" />
        <h1>Task not Found</h1>
        <p className="max-w-lg text-center">
          We couldn't find the page you're looking for.
        </p>
        <Link className={buttonVariants({ size: 'lg' })} to="/tasks/my-tasks">
          Back to My Tasks
        </Link>
      </div>
    </MainInsetLayout>
  )
}
