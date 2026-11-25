import { z } from 'zod/v4'
import { createFileRoute } from '@tanstack/react-router'
import { documentHelper } from '#/lib'
import useGetPageHeader from '#/lib/hooks/useGetPageHeader'
import { useAttendanceScope } from '#/lib/api/services/attendance'
import { performanceReportSchema } from '#/lib/utils/schema/performanceReports.schema'
import { AllPerformanceReports } from '#/components'

export const Route = createFileRoute('/admin-dashboard/performance/report')({
  validateSearch: z.object({ report: performanceReportSchema.optional() }),
  component: PerformanceReportsPage,
  head: () =>
    documentHelper({
      title: 'Performance Reports | Tams',
      content: 'Generate appraisal scorecard reports',
      name: 'description',
    }),
})

function PerformanceReportsPage() {
  const { report } = Route.useSearch()
  const navigate = Route.useNavigate()
  const context = useAttendanceScope()
  const { pageHeader } = useGetPageHeader({ key: 'performance-reports' })
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <section className="mt-10">
        <AllPerformanceReports
          key={JSON.stringify(context)}
          params={report}
          onChange={(next) =>
            void navigate({ search: { report: next }, hash: 'generate-report' })
          }
        />
      </section>
    </main>
  )
}
