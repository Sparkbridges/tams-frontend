import { createFileRoute } from '@tanstack/react-router'
import AttendanceShiftClock from '#/components/organisms/attendance/AttendanceShiftClock'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/settings/clock',
)({
  component: AttendanceShiftClock,
})
