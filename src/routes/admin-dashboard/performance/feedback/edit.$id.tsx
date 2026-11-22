import {
  CreateEditFeedbackSurveyForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, usePerformanceAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/feedback/edit/$id',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Edit Feedback | Tams',
      content: 'Edit a feedback survey',
      name: 'description',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { canEditFeedback } = usePerformanceAccess()
  if (!canEditFeedback) return <TamsPageError type="403" />

  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Feedback" />

      <TamsBanner />

      <CreateEditFeedbackSurveyForm type="edit" id={Number(id)} />
    </div>
  )
}
