import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import { SETTING_LINKS } from '@/lib/nav-main-links'

export const Route = createFileRoute('/_main/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[{ href: '/settings', label: 'Settings' }]}
    >
      <div className="flex gap-2 py-1 border-y">
        {SETTING_LINKS.map((link, index) => (
          <Link
            key={index}
            className="px-2 py-1 rounded-md hover:bg-accent/50 text-sm flex-1 text-center"
            to={link.url}
            activeProps={{ className: 'bg-accent' }}
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div className="w-full lg:px-4 mx-auto">
        <Outlet />
      </div>
    </MainInsetLayout>
  )
}
