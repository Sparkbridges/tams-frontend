import { DashboardLayout, TamsPageError } from '#/components'
import { handleAuthenticatedRoutesMiddleware, USER_VIEW } from '#/lib'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard')({
  component: RouteComponent,
  beforeLoad: async ({ location }) =>
    await handleAuthenticatedRoutesMiddleware(location.pathname),
  notFoundComponent: () => <TamsPageError type="404" />,
  errorComponent: () => <TamsPageError type="500" />,
})

function RouteComponent() {
  return (
    <DashboardLayout viewType={USER_VIEW.ADMIN}>
      <Outlet />
    </DashboardLayout>
  )
}
