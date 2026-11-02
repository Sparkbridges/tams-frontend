import { createFileRoute } from '@tanstack/react-router'
import { useAttendanceScope } from '#/lib/api/services/attendance'
import { documentHelper } from '#/lib'
import { Divider } from '@mantine/core'
import useGetPageHeader from '#/lib/hooks/useGetPageHeader'
import AttendanceSchedulerTable from '#/components/organisms/data-table/AttendanceSchedulerTable'

export const Route = createFileRoute('/admin-dashboard/attendance/scheduler')({
  component: SchedulerPage,
  head: () =>
    documentHelper({
      title: 'Attendance Scheduler | Tams',
      content: 'Employee schedule assignments',
      name: 'description',
    }),
})
function SchedulerPage() {
  const scope = useAttendanceScope()
  const { pageHeader } = useGetPageHeader()
  return (
    <main>
      {pageHeader()}
      <Divider my="lg" />
      <AttendanceSchedulerTable key={JSON.stringify(scope)} />
    </main>
  )
}
