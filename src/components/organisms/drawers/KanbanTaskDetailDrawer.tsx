import { TamsButton, TamsSpinner } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import { getErrorMessage, newDayjs, useFetchProjectKanbanTask } from '#/lib'
import type { TProjectKanbanTask } from '#/lib/types/api/performance'
import {
  Avatar,
  Badge,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  CalendarBlankIcon,
  CheckCircleIcon,
  FlagIcon,
  NoteIcon,
  UserCircleIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'

const formatDate = (value?: string | null) => {
  if (!value) return 'Not provided'
  const date = newDayjs(value)
  return date.isValid() ? date.format('MMM DD, YYYY') : value
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <Group gap="sm" align="flex-start" wrap="nowrap">
    <ThemeIcon variant="light" size="lg" radius="md" color="blue">
      {icon}
    </ThemeIcon>
    <Stack gap={2}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.4}>
        {label}
      </Text>
      <Text size="sm" fw={500} c="gray.8">
        {value}
      </Text>
    </Stack>
  </Group>
)

const KanbanTaskDetailDrawer = ({
  selectedId,
  opened,
  onClose,
  onEdit,
  projectId,
}: {
  selectedId: number | null
  opened: boolean
  onClose: () => void
  onEdit: (task: TProjectKanbanTask) => void
  projectId: number
}) => {
  const hasSelection =
    Number.isSafeInteger(selectedId) && Number(selectedId) > 0
  const query = useFetchProjectKanbanTask(
    selectedId ?? 0,
    projectId,
    opened && hasSelection,
  )
  const task = query.data?.data

  return (
    <TamsDrawer
      title="Task Details"
      opened={opened}
      onClose={onClose}
      size="lg"
    >
      {!hasSelection ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>No task selected</Text>
          <Text size="sm" c="dimmed">
            Select a task card to view its details.
          </Text>
        </Stack>
      ) : query.isLoading ? (
        <Stack
          align="center"
          justify="center"
          h={260}
          gap="sm"
          role="status"
          aria-label="Loading task details"
        >
          <TamsSpinner size="md" />
        </Stack>
      ) : query.isError ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>Unable to load task details</Text>
          <Text size="sm" c="dimmed">
            {getErrorMessage(query.error)}
          </Text>
          <TamsButton
            variant="light"
            onClick={() => void query.refetch()}
            loading={query.isFetching}
          >
            Try again
          </TamsButton>
        </Stack>
      ) : !task ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>Task not found</Text>
          <Text size="sm" c="dimmed">
            The requested task details are unavailable.
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg" p="lg">
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                  Kanban task #{task.id}
                </Text>
                <Title order={3} fw={700} c="gray.8">
                  {task.title}
                </Title>
              </Stack>
              <Badge
                color={task.issue_type === 'fix' ? 'red' : 'blue'}
                variant="light"
                radius="sm"
                size="lg"
              >
                {task.issue_type === 'fix' ? 'Fix' : 'Task'}
              </Badge>
            </Group>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailRow
                icon={<FlagIcon />}
                label="Priority"
                value={task.priority || 'Not provided'}
              />
              <DetailRow
                icon={<CalendarBlankIcon />}
                label="Start date"
                value={formatDate(task.start_date)}
              />
              <DetailRow
                icon={<CalendarBlankIcon />}
                label="Due date"
                value={formatDate(task.due_date)}
              />
              <DetailRow
                icon={<CheckCircleIcon />}
                label="Status"
                value={
                  task.status_id ? `Status #${task.status_id}` : 'Not provided'
                }
              />
            </SimpleGrid>

            <Divider my="md" />

            <Group justify="flex-end">
              <TamsButton
                variant="light"
                radius="xl"
                leftSection={<NoteIcon />}
                onClick={() => query.refetch()}
                loading={query.isFetching}
              >
                Refresh
              </TamsButton>
              <TamsButton radius="xl" onClick={() => onEdit(task)}>
                Edit task
              </TamsButton>
            </Group>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="sm" mb="md">
              <ThemeIcon variant="light" size="lg" radius="md" color="blue">
                <NoteIcon />
              </ThemeIcon>
              <Title order={4}>Description</Title>
            </Group>
            <Text size="sm" c="gray.7" style={{ whiteSpace: 'pre-wrap' }}>
              {task.description || 'No description provided.'}
            </Text>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" mb="md">
              <Group gap="sm">
                <ThemeIcon variant="light" size="lg" radius="md" color="blue">
                  <UsersThreeIcon />
                </ThemeIcon>
                <Title order={4}>Assignees</Title>
              </Group>
              <Badge variant="light">{task.actors?.length ?? 0}</Badge>
            </Group>
            {task.actors?.length ? (
              <Stack gap="sm">
                {task.actors.map((actor) => {
                  const employee = actor.employee
                  const name = employee
                    ? `${employee.first_name} ${employee.last_name}`
                    : 'Unknown employee'
                  return (
                    <Group key={actor.id} gap="sm">
                      <Avatar
                        src={employee?.picture}
                        name={name}
                        color="initials"
                        size="sm"
                        radius="xl"
                      />
                      <Text size="sm" fw={500}>
                        {name}
                      </Text>
                    </Group>
                  )
                })}
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">
                No assignees.
              </Text>
            )}
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" mb="md">
              <Group gap="sm">
                <ThemeIcon variant="light" size="lg" radius="md" color="blue">
                  <UserCircleIcon />
                </ThemeIcon>
                <Title order={4}>Subtasks</Title>
              </Group>
              <Badge variant="light">{task.subtasks?.length ?? 0}</Badge>
            </Group>
            {task.subtasks?.length ? (
              <Stack gap="sm">
                {task.subtasks.map((subtask) => (
                  <Paper
                    key={subtask.id}
                    withBorder
                    radius="md"
                    p="sm"
                    bg="gray.0"
                  >
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text size="sm" fw={600}>
                          {subtask.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {subtask.description || 'No description'}
                        </Text>
                      </div>
                      <Badge size="sm" variant="light">
                        {subtask.status?.name ?? 'Unknown'}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">
                No subtasks.
              </Text>
            )}
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default KanbanTaskDetailDrawer
