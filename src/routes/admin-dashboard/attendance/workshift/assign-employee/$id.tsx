import { createFileRoute, notFound } from '@tanstack/react-router'
import AttendanceWorkshiftAssignments from '#/components/organisms/attendance/AttendanceWorkshiftAssignments'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/assign-employee/$id',
)({
  beforeLoad: ({ params }) => {
    if (
      !/^[1-9]\d*$/.test(params.id) ||
      !Number.isSafeInteger(Number(params.id))
    )
      throw notFound()
  },
  component: WorkshiftAssignments,
})
function WorkshiftAssignments() {
  const { id } = Route.useParams()
  return <AttendanceWorkshiftAssignments key={id} id={Number(id)} />
}
