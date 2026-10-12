import { TamsSpinner } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import { useGetHrmLeaveById } from '#/lib/api/services/hrm'
import { newDayjs, normalizeStrings } from '#/lib/utils'
import {
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number | string
}

const formatValue = (value?: string | null) => value?.trim() || 'Not provided'

const formatDate = (value?: string | null) => {
  if (!value) return 'Not provided'
  const date = newDayjs(value)
  return date.isValid() ? date.format('MMM DD, YYYY') : value
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={4}>
    <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.4}>
      {label}
    </Text>
    <Text
      size="sm"
      fw={500}
      c="gray.8"
      style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
    >
      {value}
    </Text>
  </Stack>
)

const HrmLeaveDetailDrawer = ({ opened, onClose, selectedId }: Props) => {
  const id = Number(selectedId)
  const hasSelection = Number.isInteger(id) && id > 0
  const {
    data: leave,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetHrmLeaveById(
    opened && hasSelection ? id : 0,
    (response) => response.data,
  )

  const status = leave?.status?.toLowerCase() ?? ''
  const statusColor =
    status === 'approved' || status === 'taken' || status === 'completed'
      ? 'green'
      : status === 'rejected'
        ? 'red'
        : 'blue'

  return (
    <TamsDrawer
      title="Leave Details"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {!hasSelection ? (
        <Stack align="center" justify="center" h={260}>
          <Text c="dimmed">Select a leave request to view its details.</Text>
        </Stack>
      ) : isLoading ? (
        <Stack
          align="center"
          justify="center"
          h={260}
          gap="sm"
          role="status"
          aria-label="Loading leave details"
        >
          <TamsSpinner size="md" />
        </Stack>
      ) : isError || !leave ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>Unable to load leave details</Text>
          <Text size="sm" c="dimmed">
            Please try again or select another leave request.
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
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                  HRM leave #{leave.id}
                </Text>
                <Title order={3} fw={700} c="gray.8">
                  {formatValue(leave.employee_name)}
                </Title>
              </Stack>
              <Badge color={statusColor} variant="light" radius="sm" size="lg">
                {status === 'taken'
                  ? 'Completed'
                  : status
                    ? normalizeStrings(status, 'capitalize')
                    : 'Not provided'}
              </Badge>
            </Group>
            <Divider my="md" />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailRow
                label="Leave type"
                value={formatValue(leave.leave_type_name)}
              />
              <DetailRow
                label="Employee ID"
                value={String(leave.employee_id ?? 'Not provided')}
              />
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Text fw={700} size="lg" c="gray.8" mb="md">
              Request details
            </Text>
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DetailRow
                  label="Start date"
                  value={formatDate(leave.start_date)}
                />
                <DetailRow
                  label="End date"
                  value={formatDate(leave.end_date)}
                />
                <DetailRow
                  label="Duration"
                  value={
                    leave.number_of_days == null
                      ? 'Not provided'
                      : `${leave.number_of_days} ${leave.number_of_days === 1 ? 'day' : 'days'}`
                  }
                />
                <DetailRow
                  label="Relief employee"
                  value={formatValue(leave.relief)}
                />
              </SimpleGrid>
              <DetailRow label="Note" value={formatValue(leave.note)} />
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Text fw={700} size="lg" c="gray.8" mb="md">
              Approval details
            </Text>
            <Stack gap="md">
              <DetailRow
                label="Approval count"
                value={String(leave.approved_count ?? 'Not provided')}
              />
              {(status === 'rejected' || leave.rejection_reason) && (
                <DetailRow
                  label="Rejection reason"
                  value={formatValue(leave.rejection_reason)}
                />
              )}
              <Divider />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DetailRow
                  label="Created"
                  value={formatDate(leave.created_at)}
                />
                <DetailRow
                  label="Last updated"
                  value={formatDate(leave.updated_at)}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default HrmLeaveDetailDrawer
