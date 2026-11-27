import { createFileRoute } from '@tanstack/react-router'
import { Divider, Stack } from '@mantine/core'
import { TamsGoBackNavigation, TamsPageError } from '#/components'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import RecruitmentApplicantsTable from '#/components/organisms/data-table/RecruitmentApplicantsTable'
import { applicantSearchSchema } from '#/lib/utils/schema/ats.schema'
import { documentHelper } from '#/lib'

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/ats/tracking/$id',
)({
  component: RouteComponent,
  validateSearch: applicantSearchSchema,
  head: () =>
    documentHelper({
      title: 'Applicant Tracking | Tams',
      content: 'Track job applicants',
      name: 'description',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { canViewApplicants } = useRecruitmentAccess()
  if (!canViewApplicants) return <TamsPageError type="403" />
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)))
    return <TamsPageError type="404" />
  return (
    <main>
      <Stack align="start">
        <TamsGoBackNavigation label="Back to ATS" />
      </Stack>
      <Divider my="md" />
      <RecruitmentApplicantsTable key={id} jobId={Number(id)} />
    </main>
  )
}
