import AppLogo from '@/components/app-logo'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import useAppStore from '@/integrations/zustand/app-store'

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async () => {
    const isAuthenticated = useAppStore.getState().isAuthenticated
    if (isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

function App() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <AppLogo size={48} padding={8} />
          <h1>QuestForge</h1>
        </a>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome to QuestForge</CardTitle>
            <CardDescription>
              Your hub for managing projects and tasks efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link
                to="/auth/register"
                className={buttonVariants({ className: 'w-full' })}
              >
                Create admin account
              </Link>
              <Link
                to="/auth/login"
                className={buttonVariants({
                  className: 'w-full',
                  variant: 'outline',
                })}
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
