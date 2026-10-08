import { TamsSpinner } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import { useGetHrmExemptionById } from '#/lib/api/services/hrm'
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

const HrmExemptionDetailDrawer = ({ opened, onClose, selectedId }: Props) => {
  const id = Number(selectedId)
  const hasSelection = Number.isInteger(id) && id > 0
  const {
    data: exemption,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetHrmExemptionById(
    opened && hasSelection ? id : 0,
    (response) => response.data,
  )

  const dates = [
    ...new Set(
      exemption?.exemptionsdate?.length
        ? exemption.exemptionsdate.map((date) => date.exemption_date)
        : (exemption?.exemption_date ?? []),
    ),
  ]
  const status = exemption?.approval_status?.toLowerCase() ?? ''
  const statusColor =
    status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'blue'

  return (
    <TamsDrawer
      title="Exemption Details"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {!hasSelection ? (
        <Stack align="center" justify="center" h={260}>
          <Text c="dimmed">Select an exemption to view its details.</Text>
        </Stack>
      ) : isLoading ? (
        <Stack
          align="center"
          justify="center"
          h={260}
          gap="sm"
          role="status"
          aria-label="Loading exemption details"
        >
          <TamsSpinner size="md" />
        </Stack>
      ) : isError || !exemption ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>Unable to load exemption details</Text>
          <Text size="sm" c="dimmed">
            Please try again or select another exemption.
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
                  HRM exemption #{exemption.id}
                </Text>
                <Title order={3} fw={700} c="gray.8">
                  {exemption.employees
                    ?.map((employee) => employee.employee_name)
                    .filter(Boolean)
                    .join(', ') || 'Not provided'}
                </Title>
              </Stack>
              <Badge color={statusColor} variant="light" radius="sm" size="lg">
                {status
                  ? normalizeStrings(status, 'capitalize')
                  : 'Not provided'}
              </Badge>
            </Group>
            <Divider my="md" />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailRow
                label="Exemption type"
                value={
                  exemption.exemption_type === 'CLOCK_IN_OUT'
                    ? 'Clock In/Out'
                    : exemption.exemption_type
                      ? normalizeStrings(exemption.exemption_type, 'capitalize')
                      : 'Not provided'
                }
              />
              <DetailRow
                label="Employee ID"
                value={String(exemption.employee_id)}
              />
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Text fw={700} size="lg" c="gray.8" mb="md">
              Request details
            </Text>
            <Stack gap="md">
              <DetailRow label="Reason" value={formatValue(exemption.reason)} />
              <Stack gap="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.4}>
                  Exemption dates
                </Text>
                {dates.length ? (
                  <Group gap="xs">
                    {dates.map((date) => (
                      <Badge
                        key={date}
                        variant="light"
                        color="gray"
                        radius="sm"
                        size="lg"
                      >
                        {formatDate(date)}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed">
                    No dates provided
                  </Text>
                )}
              </Stack>
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Text fw={700} size="lg" c="gray.8" mb="md">
              Approval details
            </Text>
            <Stack gap="md">
              <DetailRow
                label="Approval note"
                value={formatValue(exemption.approval_note)}
              />
              {(status === 'rejected' || exemption.rejection_reason) && (
                <DetailRow
                  label="Rejection reason"
                  value={formatValue(exemption.rejection_reason)}
                />
              )}
              <Divider />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DetailRow
                  label="Created"
                  value={formatDate(exemption.created_at)}
                />
                <DetailRow
                  label="Last updated"
                  value={formatDate(exemption.updated_at)}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default HrmExemptionDetailDrawer
