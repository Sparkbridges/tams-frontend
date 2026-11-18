import { TamsBanner, TamsGoBackNavigation, TamsPageError } from '#/components'
import CreateEditPerformanceTaskMgtProjectForm from '#/components/organisms/forms/CreateEditPerformanceTaskMgtProjectForm'
import { documentHelper, usePerformanceAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/task-management/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Task Management Project | Tams',
      content: 'Performance Task Management Project Create Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateTraining } = usePerformanceAccess()
  if (!canCreateTraining) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Projects" />

      <TamsBanner />

      <CreateEditPerformanceTaskMgtProjectForm type="create" />
    </div>
  )
}
