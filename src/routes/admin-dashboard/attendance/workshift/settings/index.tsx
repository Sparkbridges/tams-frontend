import { createFileRoute } from '@tanstack/react-router'
import AttendanceWorkshiftSettings from '#/components/organisms/attendance/AttendanceWorkshiftSettings'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/settings/',
)({
  component: AttendanceWorkshiftSettings,
})
