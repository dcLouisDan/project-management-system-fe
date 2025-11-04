import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/users/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/users/create"!</div>
}
