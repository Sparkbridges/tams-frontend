import { createFileRoute, notFound } from '@tanstack/react-router'
import AttendanceWorkshiftForm from '#/components/organisms/attendance/AttendanceWorkshiftForm'
import { TamsBanner, TamsGoBackNavigation, TamsPageError } from '#/components'
import { documentHelper } from '#/lib'
import { useWorkshiftAccess } from '#/lib/api/services/workshift'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/edit/$id',
)({
  beforeLoad: ({ params }) => {
    if (
      !/^[1-9]\d*$/.test(params.id) ||
      !Number.isSafeInteger(Number(params.id))
    )
      throw notFound()
  },
  component: EditWorkshift,
  head: () =>
    documentHelper({
      title: 'Edit Workshift | Tams',
      content: 'Edit attendance workshift',
      name: 'description',
    }),
})
function EditWorkshift() {
  const { id } = Route.useParams()
  const { canView, canEdit } = useWorkshiftAccess()
  if (!canView || !canEdit) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Workshifts" />
      <TamsBanner />
      <AttendanceWorkshiftForm key={id} id={Number(id)} />
    </div>
  )
}
