import { createFileRoute } from '@tanstack/react-router'
import RecruitmentDashboard from '#/components/organisms/dashboards/RecruitmentDashboard'
import { documentHelper } from '#/lib'

export const Route = createFileRoute('/admin-dashboard/recruitment/')({
  component: RecruitmentDashboard,
  head: () =>
    documentHelper({
      title: 'Recruitment Overview | Tams',
      content: 'Recruitment overview and applicant progress',
      name: 'description',
    }),
})
