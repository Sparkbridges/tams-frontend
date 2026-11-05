import {
  CreateEditHrmExemptionForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, useHrmAccess } from '#/lib'
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
  const { canCreateExemptions } = useHrmAccess()

  if (!canCreateExemptions) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Exemptions" />

      <TamsBanner />

      <CreateEditHrmExemptionForm type="create" />
    </div>
  )
}
