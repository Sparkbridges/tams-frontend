import { TamsBanner, TamsGoBackNavigation, TamsPageError } from '#/components'
import CreateEditPerformanceTaskMgtProjectForm from '#/components/organisms/forms/CreateEditPerformanceTaskMgtProjectForm'
import {
  documentHelper,
  numberSchema,
  usePerformanceAccess,
  zodObjectSchema,
} from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

const productSearchSchema = zodObjectSchema({
  projectId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/performance/task-management/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Task Management Project | Tams',
      content: 'Performance Task Management Edit Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { projectId } = Route.useSearch()
  const { canEditTraining } = usePerformanceAccess()
  if (!canEditTraining) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Projects" />

      <TamsBanner />

      <CreateEditPerformanceTaskMgtProjectForm type="edit" id={projectId} />
    </div>
  )
}
