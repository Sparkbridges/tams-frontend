import { createFileRoute } from '@tanstack/react-router'
import HrmDashboard from '#/components/organisms/dashboards/HrmDashboard'

export const Route = createFileRoute('/admin-dashboard/hrm/')({
  component: HrmDashboard,
})
