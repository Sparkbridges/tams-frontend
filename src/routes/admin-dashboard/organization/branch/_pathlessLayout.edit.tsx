import { CreateEditBranchForm, TamsBanner, TamsGoBackNavigation } from '#/components'
import { documentHelper, numberSchema } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  branchId: numberSchema(),
})


export const Route = createFileRoute(
  '/admin-dashboard/organization/branch/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head:()=> documentHelper({ title: 'Edit Branch | Tams', content: 'Organization Branch Page', name: 'description' }),
})

function RouteComponent() {
  const { branchId } = Route.useSearch()
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Branches" />

      <TamsBanner />

      <CreateEditBranchForm type="edit" branchId={branchId} />
    </div>
  )
}
