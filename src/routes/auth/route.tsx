import AppLogo from '@/components/app-logo'
import useAppStore from '@/integrations/zustand/app-store'
import { APP_NAME } from '@/lib/constants'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: async () => {
    const isAuthenticated = useAppStore.getState().isAuthenticated
    if (isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <AppLogo />
          {APP_NAME}
        </a>
        <Outlet />
      </div>
    </div>
  )
}
