import { BadgeQuestionMark } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import MainInsetLayout from '@/routes/_main/-main-inset-layout'
import { useQuery } from '@tanstack/react-query'
import { showProjectQueryOptions } from '@/lib/query-options/show-project-query-options'

export default function TaskNotFoundComponent() {
  const { projectId } = useParams({
    from: '/_main/projects/$projectId/tasks/$taskId/',
  })
  const { data: project } = useQuery(showProjectQueryOptions(Number(projectId)))
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Projects', href: '/projects' },
        {
          label: project ? project.name : 'Project Details',
          href: `/projects/${projectId}`,
        },
        { label: 'Task Not Found', href: `/projects/${projectId}` },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <BadgeQuestionMark className="size-40" />
        <h1>Task not Found</h1>
        <p className="max-w-lg text-center">
          We couldn't find the page you're looking for.
        </p>
        <Link
          className={buttonVariants({ size: 'lg' })}
          to="/projects/$projectId"
          params={{ projectId }}
        >
          Back to Project Page
        </Link>
      </div>
    </MainInsetLayout>
  )
}
