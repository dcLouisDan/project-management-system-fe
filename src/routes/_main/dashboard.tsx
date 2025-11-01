import { Button } from '@/components/ui/button'
import { logoutUser } from '@/lib/api/user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button onClick={async () => logoutUser()}>Logout</Button>
    </div>
  )
}
