import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/performance/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin-dashboard/performance/"!</div>
}
