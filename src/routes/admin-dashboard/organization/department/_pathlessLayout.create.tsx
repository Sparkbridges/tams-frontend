import {
  CreateEditDepartmentForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, useOrganizationAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/department/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Department | Tams',
      content: 'Create Organization Department Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateDepartment } = useOrganizationAccess()
  if (!canCreateDepartment) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Departments" />

      <TamsBanner />

      <CreateEditDepartmentForm type="create" />
    </div>
  )
}
