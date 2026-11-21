import {
  CreateEditPerformanceTrainingForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import {
  documentHelper,
  numberSchema,
  usePerformanceAccess,
  zodObjectSchema,
} from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

const productSearchSchema = zodObjectSchema({
  trainingId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/performance/training/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Training | Tams',
      content: 'Performance Training Edit Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { trainingId } = Route.useSearch()
  const { canEditTraining } = usePerformanceAccess()
  if (!canEditTraining) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Training" />

      <TamsBanner />

      <CreateEditPerformanceTrainingForm type="edit" id={trainingId} />
    </div>
  )
}
