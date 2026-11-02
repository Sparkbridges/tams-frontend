import { z } from 'zod/v4'
import { createFileRoute } from '@tanstack/react-router'
import AllAttendanceReports from '#/components/organisms/boxes/AllAttendanceReports'
import { documentHelper } from '#/lib'
import useGetPageHeader from '#/lib/hooks/useGetPageHeader'
import { useAttendanceScope } from '#/lib/api/services/attendance'
import { attendanceReportSchema } from '#/lib/utils/schema/attendanceReports.schema'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/attendance-reports',
)({
  validateSearch: z.object({ report: attendanceReportSchema.optional() }),
  component: AttendanceReportsPage,
  head: () =>
    documentHelper({
      title: 'Attendance Reports | Tams',
      content: 'Generate and export attendance reports',
      name: 'description',
    }),
})

function AttendanceReportsPage() {
  const { report } = Route.useSearch()
  const navigate = Route.useNavigate()
  const scope = useAttendanceScope()
  const { pageHeader } = useGetPageHeader()
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <section className="mt-10">
        <AllAttendanceReports
          key={JSON.stringify(scope)}
          params={report}
          onChange={(next) => {
            void navigate({
              search: { report: next },
              hash: next ? 'generate-report' : '',
            })
          }}
        />
      </section>
    </main>
  )
}
