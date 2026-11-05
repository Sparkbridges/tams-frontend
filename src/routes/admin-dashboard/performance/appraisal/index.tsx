import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/performance/appraisal/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/admin-dashboard/performance/appraisal/"!</div>
}
