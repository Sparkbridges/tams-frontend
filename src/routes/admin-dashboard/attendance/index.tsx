import { createFileRoute } from '@tanstack/react-router'
import AttendanceDashboard from '#/components/organisms/dashboards/AttendanceDashboard'

export const Route = createFileRoute('/admin-dashboard/attendance/')({
  component: AttendanceDashboard,
})
