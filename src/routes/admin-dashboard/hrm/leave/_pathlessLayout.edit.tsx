import {
  CreateEditHrmLeavesForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, numberSchema, useHrmAccess } from '#/lib'
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
  const { canEditLeaves } = useHrmAccess()
  if (!canEditLeaves) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Leave" />

      <TamsBanner />

      <CreateEditHrmLeavesForm type="edit" leaveId={leaveId} />
    </div>
  )
}
