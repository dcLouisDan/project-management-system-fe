import { BadgeQuestionMark } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'

export default function TeamNotFoundComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'My Teams', href: '/teams/my-teams' },
        { label: 'Team Not Found', href: '/teams/my-teams' },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <BadgeQuestionMark className="size-40" />
        <h1>Team not Found</h1>
        <p className="max-w-lg text-center">
          We couldn't find the page you're looking for.
        </p>
        <Link
          className={buttonVariants({ size: 'lg' })}
          to="/teams/my-teams"
        >
          Back to My Teams
        </Link>
      </div>
    </MainInsetLayout>
  )
}

