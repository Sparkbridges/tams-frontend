import {
  CreateEditAppraisalGroupForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, usePerformanceAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/appraisal/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Appraisal Group | Tams',
      content: 'Create an appraisal group',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateAppraisal } = usePerformanceAccess()
  if (!canCreateAppraisal) return <TamsPageError type="403" />

  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Appraisal Groups" />
      <TamsBanner />
      <CreateEditAppraisalGroupForm type="create" />
    </div>
  )
}
