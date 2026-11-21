import {
  CreateEditPerformanceTrainingForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, usePerformanceAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/training/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Training | Tams',
      content: 'Performance Training Create Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateTraining } = usePerformanceAccess()
  if (!canCreateTraining) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Training" />

      <TamsBanner />

      <CreateEditPerformanceTrainingForm type="create" />
    </div>
  )
}
