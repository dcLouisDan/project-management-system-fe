import { createFileRoute } from '@tanstack/react-router'
import MainInsetLayout from '../-main-inset-layout'
import PageHeader from '@/components/page-header'
import { APP_NAME } from '@/lib/constants'

const PAGE_TITLE = 'Add New User'
const PAGE_DESCRIPTION =
  'Add a new team member and assign roles to control their permissions across the platform.'

export const Route = createFileRoute('/_main/users/create')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: PAGE_TITLE + ' - ' + APP_NAME,
      },
      {
        name: 'description',
        content: PAGE_DESCRIPTION,
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Users', href: '/users' },
        { label: 'Add', href: '/users/create' },
      ]}
    >
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
    </MainInsetLayout>
  )
}
