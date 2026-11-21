import { TamsButton, TamsDrawer } from '#/components/atoms'
import { useFetchPerformanceTrainingById } from '#/lib/api'
import { getErrorMessage, newDayjs, normalizeStrings } from '#/lib/utils'
import {
  Alert,
  Anchor,
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
  selectedId: number
}

const formatDate = (value: string | null | undefined) =>
  value ? newDayjs(value).format('DD-MM-YYYY [at] HH:mm') : 'Not provided'

const PerformanceTrainingDetailDrawer = ({
  opened,
  onClose,
  selectedId,
}: Props) => {
  const { data, isPending, isError, error, refetch } =
    useFetchPerformanceTrainingById(
      (response) => response.data,
      selectedId,
      opened,
    )

  return (
    <TamsDrawer
      title="Training Details"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {isPending ? (
        <Text p="md" role="status">
          Loading training...
        </Text>
      ) : isError ? (
        <Alert color="red" title="Unable to load training">
          {getErrorMessage(error)}
          <TamsButton onClick={() => refetch()}>Try again</TamsButton>
        </Alert>
      ) : !data ? (
        <Alert color="red" title="Training not found">
          The requested training details are unavailable.
        </Alert>
      ) : (
        <Stack p="lg" gap="lg">
          <Paper withBorder radius="lg" p="lg">
            <Group justify="space-between">
              <Title order={3}>{data.title}</Title>
              <Badge
                color={
                  data.status === 'approved'
                    ? 'green'
                    : data.status === 'rejected'
                      ? 'red'
                      : 'orange'
                }
              >
                {normalizeStrings(data.status)}
              </Badge>
            </Group>
            <Text mt="md" style={{ whiteSpace: 'pre-wrap' }}>
              {data.description || 'No description provided.'}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
              <Text size="sm">Training ID: {data.id}</Text>
              <Text size="sm">
                Duration:{' '}
                {data.duration_days === null || data.duration_days === undefined
                  ? 'Not provided'
                  : `${data.duration_days} day(s)`}
              </Text>
              <Text size="sm">Type: {normalizeStrings(data.type)}</Text>
              <Text size="sm">
                Scope:{' '}
                {data.is_generic ? 'All branches' : `Branch ${data.station_id}`}
              </Text>
            </SimpleGrid>
            {data.file_url ? (
              <Anchor
                href={data.file_url}
                target="_blank"
                rel="noopener noreferrer"
                mt="md"
                display="block"
              >
                Open training content
              </Anchor>
            ) : (
              <Text mt="md" size="sm" c="dimmed">
                No training content URL provided.
              </Text>
            )}
          </Paper>
          <Paper withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              Assignment information
            </Title>
            <Text size="sm">
              Assign by:{' '}
              {data.assignment_category
                ? normalizeStrings(data.assignment_category)
                : 'Not provided'}
            </Text>
            <Text size="sm" mt="xs">
              Selected IDs: {data.assignment_ids?.join(', ') || 'Not provided'}
            </Text>
            {data.assignment_category === 'employees' && (
              <>
                <Group justify="space-between" mt="md" mb="sm">
                  <Text fw={600}>Assigned employees</Text>
                  <Badge>{data.assignments.length}</Badge>
                </Group>
                {data.assignments.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    No employees assigned.
                  </Text>
                ) : (
                  <Stack gap="sm">
                    {data.assignments.map((assignment) => (
                      <Paper key={assignment.id} withBorder radius="md" p="sm">
                        <Group justify="space-between">
                          <Text fw={600}>
                            {[
                              assignment.employee?.first_name,
                              assignment.employee?.last_name,
                            ]
                              .filter(Boolean)
                              .join(' ') ||
                              `Employee ${assignment.employee_id}`}
                          </Text>
                          <Badge variant="light">
                            {normalizeStrings(assignment.status)}
                          </Badge>
                        </Group>
                        <Text size="sm" mt="xs">
                          Employee ID: {assignment.employee_id}
                        </Text>
                        <Text size="sm">
                          Score: {assignment.score ?? 'Not scored'}
                        </Text>
                        <Text size="sm">
                          Completed: {formatDate(assignment.completed_at)}
                        </Text>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </>
            )}
          </Paper>
          <Paper withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              Additional details
            </Title>
            <Text size="sm">Created: {formatDate(data.created_at)}</Text>
            <Text size="sm">Last updated: {formatDate(data.updated_at)}</Text>
            <Text size="sm">Created by employee ID: {data.created_by_id}</Text>
            <Text size="sm">
              Approved by employee ID: {data.approved_by_id ?? 'Not provided'}
            </Text>
            <Text size="sm">Approved: {formatDate(data.approved_at)}</Text>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default PerformanceTrainingDetailDrawer
