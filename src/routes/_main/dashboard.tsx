import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from './-main-inset-layout'

export const Route = createFileRoute('/_main/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[{ label: 'Dashboard', href: '/dashboard' }]}
    >
      Dashboard
    </MainInsetLayout>
  )
}
