import { createFileRoute } from '@tanstack/react-router'
import AttendanceWorkshiftForm from '#/components/organisms/attendance/AttendanceWorkshiftForm'
import { TamsBanner, TamsGoBackNavigation, TamsPageError } from '#/components'
import { documentHelper } from '#/lib'
import { useWorkshiftAccess } from '#/lib/api/services/workshift'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/create',
)({
  component: CreateWorkshift,
  head: () =>
    documentHelper({
      title: 'Create Workshift | Tams',
      content: 'Create attendance workshift',
      name: 'description',
    }),
})

function CreateWorkshift() {
  const { canCreate } = useWorkshiftAccess()
  if (!canCreate) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Workshifts" />
      <TamsBanner />
      <AttendanceWorkshiftForm />
    </div>
  )
}
