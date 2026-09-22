import { CreateEditDepartmentForm, TamsBanner, TamsGoBackNavigation } from '#/components'
import { documentHelper, numberSchema } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  departmentId: numberSchema(),
})


export const Route = createFileRoute(
  '/admin-dashboard/organization/department/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head:()=> documentHelper({ title: 'Edit Department | Tams', content: 'Organization Department Page', name: 'description' }),
})

function RouteComponent() {
  const { departmentId } = Route.useSearch()
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Departments" />

      <TamsBanner />

      <CreateEditDepartmentForm type="edit" departmentId={departmentId} />
    </div>
  )
}
