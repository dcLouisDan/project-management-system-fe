import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/teams/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/teams/"!</div>
}
