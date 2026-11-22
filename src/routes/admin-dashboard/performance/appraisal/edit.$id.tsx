import {
  CreateEditAppraisalGroupForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, usePerformanceAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/appraisal/edit/$id',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Edit Appraisal Group | Tams',
      content: 'Edit an appraisal group',
      name: 'description',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { canUpdateAppraisal } = usePerformanceAccess()
  if (!canUpdateAppraisal) return <TamsPageError type="403" />

  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Appraisal Groups" />
      <TamsBanner />
      <CreateEditAppraisalGroupForm type="edit" id={Number(id)} />
    </div>
  )
}
