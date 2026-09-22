import { handleAuthenticatedRoutesMiddleware } from '#/lib'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/ess')({
  component: RouteComponent,
  beforeLoad: async ({ location }) =>
    await handleAuthenticatedRoutesMiddleware(location.pathname),
})

function RouteComponent() {
  return (
    <div>
      ess hello
      <Outlet />
    </div>
  )
}
