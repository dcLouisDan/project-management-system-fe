import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'

export const Route = createFileRoute('/_main/teams')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Teams', href: '/teams' }]}>
      Hello "/_main/teams"!
    </MainInsetLayout>
  )
}
