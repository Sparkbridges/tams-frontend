import { createFileRoute } from '@tanstack/react-router'
import AttendanceShiftTypes from '#/components/organisms/attendance/AttendanceShiftTypes'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/settings/shift-type',
)({
  component: AttendanceShiftTypes,
})
