import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/settings/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/settings/profile"!</div>
}
