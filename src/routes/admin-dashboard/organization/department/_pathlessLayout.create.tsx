import { CreateEditDepartmentForm, TamsBanner, TamsGoBackNavigation } from '#/components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/department/_pathlessLayout/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Departments" />

      <TamsBanner />

      <CreateEditDepartmentForm type="create" />
    </div>
  )
}
