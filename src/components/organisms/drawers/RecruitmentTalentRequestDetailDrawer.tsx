import { TamsDrawer } from '#/components/atoms/drawer'
import type { TRecruitmentJobRequest } from '#/lib/types'
import { formatCurrency } from '#/lib/utils/helpers/helpers'
import {
  Alert,
  Badge,
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
  request?: TRecruitmentJobRequest
  branches?: { value: string; label: string }[]
}

const formatValue = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === ''
    ? 'Not provided'
    : String(value)

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

const formatCategory = (value: string | null | undefined) => {
  if (!value) return 'Not provided'
  const labels: Record<string, string> = {
    fulltime: 'Full-time',
    parttime: 'Part-time',
    onsite: 'On-site',
  }
  return (
    labels[value] ??
    value.replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase())
  )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
      {label}
    </Text>
    <Text
      size="sm"
      mt={4}
      style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
    >
      {value}
    </Text>
  </div>
)

const RecruitmentTalentRequestDetailDrawer = ({
  opened,
  onClose,
  request,
  branches,
}: Props) => {
  const branch = branches?.find(
    (item) => item.value === String(request?.station_id),
  )
  const approver = request?.approved_by
  const approverName = approver
    ? [approver.first_name, approver.last_name].filter(Boolean).join(' ')
    : ''
  const statusColor: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
    cancelled: 'gray',
  }

  return (
    <TamsDrawer
      title="Talent Request Details"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {!request ? (
        <Alert m="lg" color="gray" title="Request unavailable">
          Select a request from the table to view its details.
        </Alert>
      ) : (
        <Stack p="lg" gap="lg">
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Talent request #{request.id}
                </Text>
                <Title order={3}>{formatValue(request.role)}</Title>
              </div>
              <Badge
                color={statusColor[request.status] ?? 'gray'}
                variant="light"
                size="lg"
              >
                {formatCategory(request.status)}
              </Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="lg">
              <Detail
                label="Department"
                value={formatValue(request.department?.department_name)}
              />
              <Detail
                label="Branch"
                value={branch?.label ?? `Branch ${request.station_id}`}
              />
              <Detail
                label="Work mode"
                value={formatCategory(request.work_mode)}
              />
              <Detail label="Job type" value={formatCategory(request.type)} />
              <Detail
                label="Salary range"
                value={
                  request.salary_range?.includes('-')
                    ? `${formatCurrency(request.salary_range?.split('-')[0] ?? '0')} - ${formatCurrency(request.salary_range?.split('-')[1] ?? '0')}`
                    : `${formatCurrency('0')} - ${formatCurrency(request.salary_range ?? '0')}`
                }
              />
              <Detail
                label="Requested on"
                value={formatDate(request.created_at)}
              />
            </SimpleGrid>
          </Paper>
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Title order={4} mb="md">
              Request details
            </Title>
            <Stack gap="md">
              <Detail
                label="Reason for hiring"
                value={formatValue(request.reason)}
              />
              <Detail
                label="Description"
                value={formatValue(request.description)}
              />
            </Stack>
          </Paper>
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Title order={4} mb="md">
              Additional information
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Detail
                label="Requested by employee ID"
                value={formatValue(request.requested_by_id)}
              />
              <Detail
                label="Reviewed by"
                value={
                  approverName ||
                  (request.approved_by_id
                    ? `Employee ${request.approved_by_id}`
                    : 'Not provided')
                }
              />
              <Detail
                label="Last updated"
                value={formatDate(request.updated_at)}
              />
              <Detail
                label="Linked job posting"
                value={
                  request.linked_posting
                    ? `#${request.linked_posting.id} (${formatCategory(request.linked_posting.status)})`
                    : 'Not created'
                }
              />
            </SimpleGrid>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default RecruitmentTalentRequestDetailDrawer
