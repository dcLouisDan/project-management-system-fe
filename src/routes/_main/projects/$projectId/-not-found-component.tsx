import { BadgeQuestionMark } from 'lucide-react'
import MainInsetLayout from '../../-main-inset-layout'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export default function ProjectNotFoundComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        { label: 'Not Found', href: '/projects' },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <BadgeQuestionMark className="size-40" />
        <h1>Project not Found</h1>
        <p className="max-w-lg text-center">
          We couldn't find the page you're looking for.
        </p>
        <Link className={buttonVariants({ size: 'lg' })} to="/projects">
          Back to Projects List
        </Link>
      </div>
    </MainInsetLayout>
  )
}
