import {
  CreateEditEmployeeForm,
  TamsBanner,
  TamsGoBackNavigation,
} from '#/components'
import { documentHelper, numberSchema } from '#/lib'
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
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Employees" />

      <TamsBanner />

      <CreateEditEmployeeForm type="edit" employeeId={employeeId} />
    </div>
  )
}
