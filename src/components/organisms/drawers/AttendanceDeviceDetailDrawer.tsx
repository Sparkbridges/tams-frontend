import { TamsSpinner } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import {
  useAttendanceAccess,
  useAttendanceDevice,
} from '#/lib/api/services/attendance'
import { attendanceTimezones } from '#/lib/constants/attendance'
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { DevicesIcon } from '@phosphor-icons/react'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number | string | null
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={4}>
    <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.4}>
      {label}
    </Text>
    <Text size="sm" fw={500} style={{ overflowWrap: 'anywhere' }}>
      {value}
    </Text>
  </Stack>
)

const AttendanceDeviceDetailDrawer = ({
  opened,
  onClose,
  selectedId,
}: Props) => {
  const id = Number(selectedId)
  const hasSelection = Number.isInteger(id) && id > 0
  const { canViewDetail } = useAttendanceAccess()
  const { data, isLoading, isError, refetch, isFetching } = useAttendanceDevice(
    opened && hasSelection && canViewDetail ? id : 0,
  )
  const device = data?.data
  const status =
    device?.state === 1 ? 'Online' : device?.state === 0 ? 'Offline' : 'Unknown'
  const timezone = attendanceTimezones.find(
    (zone) => zone.value === String(device?.timezone),
  )?.label

  return (
    <TamsDrawer
      title="Attendance Device Details"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {!canViewDetail ? (
        <Alert color="red" title="Access denied" role="alert" m="lg">
          You do not have permission to view attendance device details.
        </Alert>
      ) : !hasSelection ? (
        <Stack align="center" justify="center" h={260}>
          <Text c="dimmed">Select a device to view its details.</Text>
        </Stack>
      ) : isLoading ? (
        <Stack
          align="center"
          justify="center"
          h={260}
          role="status"
          aria-label="Loading attendance device details"
        >
          <TamsSpinner size="md" />
        </Stack>
      ) : isError || !device ? (
        <Stack align="center" justify="center" h={260} gap="sm" role="alert">
          <Text fw={600}>Unable to load attendance device details</Text>
          <Text size="sm" c="dimmed" ta="center">
            Please try again or select another device.
          </Text>
          <Button
            variant="light"
            onClick={() => void refetch()}
            loading={isFetching}
          >
            Try again
          </Button>
        </Stack>
      ) : (
        <Stack gap="lg" p="lg">
          <Paper withBorder radius="lg" p="lg">
            <Group justify="space-between" align="flex-start">
              <Group align="flex-start" wrap="nowrap">
                <ThemeIcon variant="light" size={44} radius="md">
                  <DevicesIcon size={24} />
                </ThemeIcon>
                <Stack gap={4} style={{ minWidth: 0 }}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                    Attendance device #{device.id}
                  </Text>
                  <Title order={3} style={{ overflowWrap: 'anywhere' }}>
                    {device.alias?.trim() || 'Unnamed device'}
                  </Title>
                </Stack>
              </Group>
              <Badge
                color={
                  status === 'Online'
                    ? 'green'
                    : status === 'Offline'
                      ? 'red'
                      : 'gray'
                }
                variant="light"
                radius="sm"
                size="lg"
              >
                {status}
              </Badge>
            </Group>
            <Divider my="md" />
            <DetailRow
              label="Serial number"
              value={device.serial_no?.trim() || 'Not provided'}
            />
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              Device configuration
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <DetailRow label="Device ID" value={String(device.id)} />
              <DetailRow
                label="Device type"
                value={
                  device.device_type?.trim() ||
                  (device.device_type_id != null
                    ? `Type #${device.device_type_id}`
                    : 'Not provided')
                }
              />
              <DetailRow
                label="Branch ID"
                value={
                  device.station_id != null
                    ? String(device.station_id)
                    : 'Not provided'
                }
              />
              <DetailRow
                label="Time zone"
                value={
                  timezone ?? (String(device.timezone ?? '') || 'Not provided')
                }
              />
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              Device activity
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <DetailRow
                label="Users on device"
                value={
                  device.user_count != null
                    ? String(device.user_count)
                    : 'Not available'
                }
              />
              <DetailRow
                label="Last transaction"
                value={device.last_activity?.trim() || 'No transactions yet'}
              />
            </SimpleGrid>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default AttendanceDeviceDetailDrawer
