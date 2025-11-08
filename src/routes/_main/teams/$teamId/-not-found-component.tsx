import { BadgeQuestionMark } from 'lucide-react'
import MainInsetLayout from '../../-main-inset-layout'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export default function TeamNotFoundComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Teams', href: '/teams' },
        { label: 'Not Found', href: '/teams' },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <BadgeQuestionMark className="size-40" />
        <h1>Team not Found</h1>
        <p className="max-w-lg text-center">
          We couldn't find the page you're looking for.
        </p>
        <Link className={buttonVariants({ size: 'lg' })} to="/teams">
          Back to Teams List
        </Link>
      </div>
    </MainInsetLayout>
  )
}
