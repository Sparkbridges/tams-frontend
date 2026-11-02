import { TamsSpinner } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import {
  useAttendanceAccess,
  useAttendanceTransaction,
} from '#/lib/api/services/attendance'
import { normalizeStrings } from '#/lib/utils/helpers/helpers'
import {
  Alert,
  Badge,
  Button,
  Group,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { ListChecksIcon } from '@phosphor-icons/react'
import { useState } from 'react'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={4}>
    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
      {label}
    </Text>
    <Text size="sm" fw={500}>
      {value}
    </Text>
  </Stack>
)

const AttendanceTransactionDetailDrawer = ({
  opened,
  onClose,
  selectedId,
}: Props) => {
  const [page, setPage] = useState(1)
  const perPage = 10
  const { canView } = useAttendanceAccess()
  const validId = Number.isInteger(selectedId) && selectedId > 0
  const { transaction, commands } = useAttendanceTransaction(
    validId ? selectedId : 0,
    { page, perPage },
    opened && canView,
  )
  const detail = transaction.data?.data
  const commandPage = commands.data?.data

  return (
    <TamsDrawer
      title="Transaction Log Details"
      size="xl"
      opened={opened}
      onClose={onClose}
    >
      {!canView ? (
        <Alert color="red" title="Access denied" role="alert" m="lg">
          You do not have permission to view attendance transaction logs.
        </Alert>
      ) : !validId ? (
        <Text p="lg" c="dimmed">
          Select a transaction to view its details.
        </Text>
      ) : transaction.isLoading ? (
        <Stack
          align="center"
          justify="center"
          h={260}
          role="status"
          aria-label="Loading transaction details"
        >
          <TamsSpinner size="md" />
        </Stack>
      ) : transaction.isError || !detail ? (
        <Stack p="lg" role="alert">
          <Text fw={600}>Unable to load transaction details</Text>
          <Button
            variant="light"
            onClick={() => void transaction.refetch()}
            loading={transaction.isFetching}
          >
            Try again
          </Button>
        </Stack>
      ) : (
        <Stack p="lg" gap="lg">
          <Paper withBorder radius="lg" p="lg">
            <Group justify="space-between" align="flex-start">
              <Group wrap="nowrap">
                <ThemeIcon size={44} radius="md" variant="light">
                  <ListChecksIcon size={24} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    Transaction #{detail.id}
                  </Text>
                  <Title order={3}>
                    {normalizeStrings(detail.command_type)}
                  </Title>
                </Stack>
              </Group>
              <Button
                variant="light"
                size="xs"
                loading={transaction.isFetching || commands.isFetching}
                onClick={() => {
                  void transaction.refetch()
                  void commands.refetch()
                }}
              >
                Refresh
              </Button>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="lg">
              <DetailRow
                label="Created"
                value={formatDate(detail.created_at)}
              />
              <DetailRow
                label="Updated"
                value={formatDate(detail.updated_at)}
              />
              <DetailRow label="Branch ID" value={String(detail.station_id)} />
              <DetailRow label="Command type" value={detail.command_type} />
            </SimpleGrid>
          </Paper>

          <Alert color="blue">
            Commands are queued for devices. Pending commands may be waiting for
            an offline device to reconnect. Refresh to check execution progress.
          </Alert>

          <Paper withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              Device commands
            </Title>
            {commands.isLoading ? (
              <Stack
                align="center"
                p="lg"
                role="status"
                aria-label="Loading device commands"
              >
                <TamsSpinner size="md" />
              </Stack>
            ) : commands.isError || !commandPage ? (
              <Stack role="alert">
                <Text>Unable to load device commands</Text>
                <Button
                  variant="light"
                  loading={commands.isFetching}
                  onClick={() => void commands.refetch()}
                >
                  Retry commands
                </Button>
              </Stack>
            ) : commandPage.results.length === 0 ? (
              <Text c="dimmed">No commands on this page.</Text>
            ) : (
              <Stack gap="md">
                <Text size="sm" c="dimmed">
                  {commandPage.total} command(s) in this transaction
                </Text>
                <Table.ScrollContainer minWidth={560}>
                  <Table
                    verticalSpacing="sm"
                    aria-label="Transaction device commands"
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Device serial</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Command / committed at</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {commandPage.results.map((command) => (
                        <Table.Tr key={command.id}>
                          <Table.Td>{command.id}</Table.Td>
                          <Table.Td>{command.serial_no}</Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={
                                command.status === 'successful'
                                  ? 'green'
                                  : command.status === 'failed'
                                    ? 'red'
                                    : command.status === 'pending'
                                      ? 'yellow'
                                      : 'gray'
                              }
                            >
                              {command.status || 'Unknown'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text
                              size="xs"
                              style={{
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'anywhere',
                              }}
                            >
                              {command.cmd_content || 'Not available'}
                            </Text>
                            <Text size="xs" c="dimmed" mt={4}>
                              {formatDate(command.cmd_commit_time)}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Stack>
            )}
            {commandPage &&
              !commands.isError &&
              commandPage.total > perPage && (
                <Group justify="flex-end" mt="md">
                  <Pagination
                    value={page}
                    onChange={setPage}
                    total={Math.ceil(commandPage.total / perPage)}
                  />
                </Group>
              )}
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default AttendanceTransactionDetailDrawer
