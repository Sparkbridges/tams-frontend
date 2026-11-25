import {
  CreateEditTalentRequisitionForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper } from '#/lib'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/talent-requisition/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Talent Requisition | Tams',
      content: 'Talent Requisition Create Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateTalentRequest } = useRecruitmentAccess()
  if (!canCreateTalentRequest) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Talent Requests" />

      <TamsBanner />

      <CreateEditTalentRequisitionForm type="create" />
    </div>
  )
}
