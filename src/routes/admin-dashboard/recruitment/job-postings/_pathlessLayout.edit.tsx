import {
  CreateEditJobPostingForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'
import { documentHelper, numberSchema, zodObjectSchema } from '#/lib'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import { createFileRoute } from '@tanstack/react-router'

const productSearchSchema = zodObjectSchema({
  id: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/job-postings/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Job Posting | Tams',
      content: 'Job Posting Edit Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { id } = Route.useSearch()
  const { canCreateJobPosting } = useRecruitmentAccess()
  if (!canCreateJobPosting) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Job Postings" />

      <TamsBanner />

      <CreateEditJobPostingForm type="edit" id={id} />
    </div>
  )
}
