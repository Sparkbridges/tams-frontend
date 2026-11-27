import { documentHelper } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/recruitment/ats/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Applicant Tracking System | Tams',
      content: 'Applicant Tracking System Page',
      name: 'description',
    }),
})

function RouteComponent() {
  return <div>Hello "/admin-dashboard/recruitment/ats/"!</div>
}
