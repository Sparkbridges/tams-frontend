import {
  CreateEditHrmExemptionForm,
  TamsBanner,
  TamsGoBackNavigation,
} from '#/components'
import { documentHelper } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/hrm/exemption/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Exemption | Tams',
      content: 'Organization Exemption Page',
      name: 'description',
    }),
})

function RouteComponent() {
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Exemptions" />

      <TamsBanner />

      <CreateEditHrmExemptionForm type="create" />
    </div>
  )
}
