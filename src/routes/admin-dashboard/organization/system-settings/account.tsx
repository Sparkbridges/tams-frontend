import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/system-settings/account',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/admin-dashboard/organization/system-settings/account"!</div>
  )
}
