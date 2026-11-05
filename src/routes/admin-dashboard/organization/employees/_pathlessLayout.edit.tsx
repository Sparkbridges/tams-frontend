import {
  CreateEditEmployeeForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, numberSchema, useOrganizationAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  employeeId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/organization/employees/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Employees | Tams',
      content: 'Organization Employees Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { employeeId } = Route.useSearch()
  const { canEditEmployee } = useOrganizationAccess()
  if (!canEditEmployee) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Employees" />

      <TamsBanner />

      <CreateEditEmployeeForm type="edit" employeeId={employeeId} />
    </div>
  )
}
