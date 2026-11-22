import { createFileRoute } from '@tanstack/react-router'
import PerformanceDashboard from '#/components/organisms/dashboards/PerformanceDashboard'

export const Route = createFileRoute('/admin-dashboard/performance/')({
  component: PerformanceDashboard,
})
