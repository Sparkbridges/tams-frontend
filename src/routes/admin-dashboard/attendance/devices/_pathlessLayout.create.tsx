import { createFileRoute } from '@tanstack/react-router'
import { documentHelper, useAttendanceAccess } from '#/lib'
import {
  CreateEditAttendanceDeviceForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/devices/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Device | Tams',
      content: 'Attendance Device Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreate } = useAttendanceAccess()

  if (!canCreate) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Devices" />
      <TamsBanner />
      <CreateEditAttendanceDeviceForm type="create" />
    </div>
  )
}
