import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/settings/team')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/settings/team"!</div>
}
