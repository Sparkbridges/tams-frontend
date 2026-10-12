import {
  CreateEditHrmLeavesForm,
  TamsBanner,
  TamsGoBackNavigation,
} from '#/components'
import { documentHelper } from '#/lib'
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
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Leave" />

      <TamsBanner />

      <CreateEditHrmLeavesForm type="create" />
    </div>
  )
}
