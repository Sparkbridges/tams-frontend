import {
  CreateEditEmployeeForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, useOrganizationAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/employees/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Employee | Tams',
      content: 'Organization Create Employee Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateEmployee } = useOrganizationAccess()
  if (!canCreateEmployee) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Employees" />

      <TamsBanner />

      <CreateEditEmployeeForm type="create" />
    </div>
  )
}
