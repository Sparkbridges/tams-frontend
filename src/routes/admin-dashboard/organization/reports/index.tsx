import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/organization/reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin-dashboard/organization/reports/"!</div>
}
