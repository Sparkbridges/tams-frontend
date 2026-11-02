import type { ReactNode } from 'react'
import { Divider, Group, Stack } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import useGetPageHeader from '#/lib/hooks/useGetPageHeader'

export default function AttendanceWorkshiftsLayout({
  actions,
  children,
}: {
  actions?: ReactNode
  children: ReactNode
}) {
  const { pageHeader } = useGetPageHeader({ key: 'workshift' })
  return (
    <main>
      <Stack gap="lg">
        <Group justify="space-between">
          {pageHeader()}
          {actions}
        </Group>
        <Divider />
        <Group gap="lg" aria-label="Work shift navigation">
          <Link
            to="/admin-dashboard/attendance/workshift"
            activeOptions={{ exact: true }}
            activeProps={{ className: 'font-semibold text-blue-500' }}
          >
            Work shifts
          </Link>
          <Link
            to="/admin-dashboard/attendance/workshift/calendar"
            activeProps={{ className: 'font-semibold text-blue-500' }}
          >
            Calendar
          </Link>
          <Link
            to="/admin-dashboard/attendance/workshift/roster"
            activeProps={{ className: 'font-semibold text-blue-500' }}
          >
            Roster
          </Link>
          <Link
            to="/admin-dashboard/attendance/workshift/settings"
            activeProps={{ className: 'font-semibold text-blue-500' }}
          >
            Settings
          </Link>
        </Group>
        {children}
      </Stack>
    </main>
  )
}
