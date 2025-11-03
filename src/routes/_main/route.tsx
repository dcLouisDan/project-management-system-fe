import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import useAppStore from '@/integrations/zustand/app-store'

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
})

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
