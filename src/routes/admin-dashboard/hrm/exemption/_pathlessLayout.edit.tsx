import {
  CreateEditHrmExemptionForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, numberSchema, useHrmAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  exemptionId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/hrm/exemption/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Exemption | Tams',
      content: 'Hrm Exemption Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { exemptionId } = Route.useSearch()
  const { canEditExemptions } = useHrmAccess()

  if (!canEditExemptions) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Exemptions" />

      <TamsBanner />

      <CreateEditHrmExemptionForm type="edit" exemptionId={exemptionId} />
    </div>
  )
}
