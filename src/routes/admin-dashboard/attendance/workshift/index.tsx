import { createFileRoute } from '@tanstack/react-router'
import AttendanceWorkshifts from '#/components/organisms/attendance/AttendanceWorkshifts'

export const Route = createFileRoute('/admin-dashboard/attendance/workshift/')({
  component: AttendanceWorkshifts,
})
