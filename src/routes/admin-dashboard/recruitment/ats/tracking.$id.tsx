import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/ats/tracking/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin-dashboard/recruitment/ats/tracking/$id"!</div>
}
