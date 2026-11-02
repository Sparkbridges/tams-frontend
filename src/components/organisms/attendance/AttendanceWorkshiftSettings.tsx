import { Group, Paper, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { useWorkshiftAccess } from '#/lib/api/services/workshift'
import { AttendanceAccessDenied } from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'

export default function AttendanceWorkshiftSettings() {
  const access = useWorkshiftAccess()
  if (!access.canViewTypes && !access.canViewClock)
    return <AttendanceAccessDenied />
  return (
    <AttendanceWorkshiftsLayout>
      <Stack>
        {access.canViewTypes && (
          <Paper p="lg" withBorder>
            <Group justify="space-between">
              <Text>Shift types, times, durations and colors</Text>
              <Link to="/admin-dashboard/attendance/workshift/settings/shift-type">
                Manage shift types
              </Link>
            </Group>
          </Paper>
        )}
        {access.canViewClock && (
          <Paper p="lg" withBorder>
            <Group justify="space-between">
              <Text>Clock-in and clock-out matching windows</Text>
              <Link to="/admin-dashboard/attendance/workshift/settings/clock">
                Manage clock settings
              </Link>
            </Group>
          </Paper>
        )}
      </Stack>
    </AttendanceWorkshiftsLayout>
  )
}
