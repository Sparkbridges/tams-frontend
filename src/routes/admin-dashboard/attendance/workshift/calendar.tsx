import { createFileRoute } from '@tanstack/react-router'
import AttendanceShiftCalendar from '#/components/organisms/attendance/AttendanceShiftCalendar'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/calendar',
)({
  component: AttendanceShiftCalendar,
})
