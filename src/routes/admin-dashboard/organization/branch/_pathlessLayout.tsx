import { TamsPageError } from '#/components'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/branch/_pathlessLayout',
)({
    component: RouteComponent,
    errorComponent: () => <TamsPageError type='500' />,
    notFoundComponent: () => <TamsPageError type='404' />,
    
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
