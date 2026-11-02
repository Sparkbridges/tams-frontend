import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useAttendanceScope } from '#/lib/api/services/attendance'

export const Route = createFileRoute('/admin-dashboard/attendance/workshift')({
  component: WorkshiftContext,
})
function WorkshiftContext() {
  const scope = useAttendanceScope()
  return <Outlet key={JSON.stringify(scope)} />
}
