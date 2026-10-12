import {
  CreateEditHrmLeavesForm,
  TamsBanner,
  TamsGoBackNavigation,
} from '#/components'
import { documentHelper, numberSchema } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  leaveId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/hrm/leave/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Leave | Tams',
      content: 'Hrm Leave Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { leaveId } = Route.useSearch()
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Leave" />

      <TamsBanner />

      <CreateEditHrmLeavesForm type="edit" leaveId={leaveId} />
    </div>
  )
}
