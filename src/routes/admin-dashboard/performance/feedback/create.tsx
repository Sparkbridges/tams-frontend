import {
  CreateEditFeedbackSurveyForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, usePerformanceAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/feedback/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Feedback | Tams',
      content: 'Create a feedback survey',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateFeedback } = usePerformanceAccess()
  if (!canCreateFeedback) return <TamsPageError type="403" />

  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Feedback" />

      <TamsBanner />

      <CreateEditFeedbackSurveyForm type="create" />
    </div>
  )
}
