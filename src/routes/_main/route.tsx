import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import useAppStore from '@/integrations/zustand/app-store'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'

export const Route = createFileRoute('/_main')({
  component: RouteComponent,
  beforeLoad: async () => {
    const isAuthenticated = useAppStore.getState().isAuthenticated
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
  errorComponent: ErrorRouteComponent,
})

function ErrorRouteComponent() {
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col gap-4 justify-center items-center h-screen">
          <TriangleAlert className="size-40" />
          <h1>Something went wrong!</h1>
          <p className="max-w-lg text-center">
            Something went wrong while loading this page. Please refresh and try
            again, or contact support if the problem persists.
          </p>
          <Link className={buttonVariants({ size: 'lg' })} to="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
