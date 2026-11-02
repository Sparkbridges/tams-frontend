import { createFileRoute } from '@tanstack/react-router'
import {
  documentHelper,
  numberSchema,
  useAttendanceAccess,
  zodObjectSchema,
} from '#/lib'
import {
  CreateEditAttendanceDeviceForm,
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
} from '#/components'

const productSearchSchema = zodObjectSchema({
  deviceId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/attendance/devices/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Device | Tams',
      content: 'Attendance Device Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { deviceId } = Route.useSearch()
  const { canCreate } = useAttendanceAccess()

  if (!canCreate) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Devices" />
      <TamsBanner />
      <CreateEditAttendanceDeviceForm id={deviceId} type="edit" />
    </div>
  )
}
