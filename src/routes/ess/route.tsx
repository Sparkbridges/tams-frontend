import { DashboardLayout } from '#/components'
import { handleAuthenticatedRoutesMiddleware, USER_VIEW } from '#/lib'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/ess')({
  component: RouteComponent,
  beforeLoad: async ({ location }) =>
    await handleAuthenticatedRoutesMiddleware(location.pathname),
})

function RouteComponent() {
  return (
    <DashboardLayout viewType={USER_VIEW.ESS}>
      <Outlet />
    </DashboardLayout>
  )
}
