import {
  CreateEditTalentRequisitionForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, numberSchema, zodObjectSchema } from '#/lib'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import { createFileRoute } from '@tanstack/react-router'

const productSearchSchema = zodObjectSchema({
  talentRequestId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/job-postings/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Talent Requisition | Tams',
      content: 'Talent Requisition Edit Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { talentRequestId } = Route.useSearch()
  const { canCreateTalentRequest } = useRecruitmentAccess()
  if (!canCreateTalentRequest) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Talent Requests" />

      <TamsBanner />

      <CreateEditTalentRequisitionForm type="edit" id={talentRequestId} />
    </div>
  )
}
