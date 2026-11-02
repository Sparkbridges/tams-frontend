import { Paper, Stack, Text, SimpleGrid } from '@mantine/core'
import { TamsDrawer } from '#/components/atoms/drawer'
import type { AttendanceReportRecord } from '#/lib/types/api/attendanceReports'
import { reportCell } from '#/lib/utils/helpers/attendanceReports'

export default function AttendanceReportDetailDrawer({
  row,
  onClose,
}: {
  row: AttendanceReportRecord
  onClose: () => void
}) {
  const entries = Object.entries(row).filter(
    ([key, value]) =>
      key !== 'id' &&
      key !== 'employee_details' &&
      (value === null || typeof value !== 'object'),
  )
  return (
    <TamsDrawer
      opened
      onClose={onClose}
      title="Attendance report details"
      size="lg"
    >
      <Stack p="lg">
        <Text size="sm" c="dimmed">
          Snapshot of the generated report. Punches and calculations are
          provided by the attendance service.
        </Text>
        <Paper withBorder p="lg" radius="lg">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {entries.map(([key, value]) => (
              <Stack key={key} gap={4}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                  {key.replaceAll('_', ' ')}
                </Text>
                <Text size="sm" style={{ overflowWrap: 'anywhere' }}>
                  {reportCell(value)}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Paper>
      </Stack>
    </TamsDrawer>
  )
}
