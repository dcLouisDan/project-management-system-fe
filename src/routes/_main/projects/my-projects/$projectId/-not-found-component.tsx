import { BadgeQuestionMark } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'

export default function ProjectNotFoundComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'My Projects', href: '/projects/my-projects' },
        { label: 'Project Not Found', href: '/projects/my-projects' },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <BadgeQuestionMark className="size-40" />
        <h1>Project not Found</h1>
        <p className="max-w-lg text-center">
          We couldn't find the page you're looking for.
        </p>
        <Link
          className={buttonVariants({ size: 'lg' })}
          to="/projects/my-projects"
        >
          Back to My Projects
        </Link>
      </div>
    </MainInsetLayout>
  )
}

