import {
  CreateEditHrmLeavesForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, useHrmAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/hrm/leave/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Leave | Tams',
      content: 'Organization Leave Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateLeaves } = useHrmAccess()
  if (!canCreateLeaves) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Leave" />

      <TamsBanner />

      <CreateEditHrmLeavesForm type="create" />
    </div>
  )
}
