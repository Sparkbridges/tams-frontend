import { TamsAvatar } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import type { TamsTableData } from '#/lib/types'
import {
  ActionIcon,
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
  HashIcon,
  NoteIcon,
  UserIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'

type Props = {
  opened: boolean
  onClose: () => void
  selectedRow: TamsTableData | null
}

type TamsTableValue = TamsTableData[keyof TamsTableData]

const formatValue = (value?: TamsTableValue) => {
  if (value === null || value === undefined || value === '')
    return 'Not provided'
  if (Array.isArray(value))
    return value.length ? value.join(', ') : 'Not provided'
  return value.toString()
}

const formatDate = (value?: TamsTableValue) => {
  if (!value || Array.isArray(value)) return 'Not provided'

  const date = new Date(value as string)
  if (Number.isNaN(date.getTime())) return value.toString()

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date)
}

const toMembersList = (value?: TamsTableValue): string[] =>
  Array.isArray(value) ? value.map((member) => member.toString()) : []

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

const OrgTeamDetailDrawer = ({ opened, onClose, selectedRow }: Props) => {
  const members = toMembersList(selectedRow?.teamMembers)

  return (
    <TamsDrawer
      title="Team Details"
      size={'lg'}
      opened={opened}
      onClose={onClose}
    >
      {!selectedRow ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>No team selected</Text>
          <Text size="sm" c="dimmed">
            Select a team from the table to view its details.
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg" p="lg">
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                  Organization team
                </Text>
                <Title order={3} fw={700} c="gray.8">
                  {formatValue(selectedRow.teamName)}
                </Title>
              </Stack>

              <Badge color="blue" variant="light" radius="sm" size="lg">
                {formatValue(selectedRow.noOfMembers)} members
              </Badge>
            </Group>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Team ID
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.id)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Team lead
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.teamLead)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Members
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.noOfMembers)}
                </Text>
              </Paper>
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md">
              <ActionIcon variant="light" color="blue" radius="md">
                <UsersThreeIcon size={18} />
              </ActionIcon>
              <Text fw={700} size="lg" c="gray.8">
                Team profile
              </Text>
            </Group>

            <Stack gap="md">
              <DetailRow
                icon={<HashIcon size={16} />}
                label="Team ID"
                value={formatValue(selectedRow.id)}
              />
              <DetailRow
                icon={<UserIcon size={16} />}
                label="Team lead"
                value={formatValue(selectedRow.teamLead)}
              />
              <DetailRow
                icon={<UsersThreeIcon size={16} />}
                label="Number of members"
                value={formatValue(selectedRow.noOfMembers)}
              />
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md" justify="space-between">
              <Group gap="xs">
                <ActionIcon variant="light" color="teal" radius="md">
                  <UsersThreeIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Team members
                </Text>
              </Group>
              <Badge color="teal" variant="light" radius="sm">
                {members.length}
              </Badge>
            </Group>

            {members.length === 0 ? (
              <Text size="sm" c="dimmed">
                No members assigned to this team yet.
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {members.map((member, index) => (
                  <Group
                    key={`${member}-${index}`}
                    gap="sm"
                    wrap="nowrap"
                    p="xs"
                    className="rounded-md bg-gray-50"
                  >
                    <TamsAvatar name={member} color="initials" size="sm" />
                    <Text size="sm" fw={500} c="gray.8" truncate>
                      {member}
                    </Text>
                  </Group>
                ))}
              </SimpleGrid>
            )}
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md">
              <ActionIcon variant="light" color="grape" radius="md">
                <NoteIcon size={18} />
              </ActionIcon>
              <Text fw={700} size="lg" c="gray.8">
                Additional details
              </Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailRow
                icon={<CalendarBlankIcon size={16} />}
                label="Created"
                value={formatDate(selectedRow.createdAt)}
              />
              <DetailRow
                icon={<CalendarBlankIcon size={16} />}
                label="Last updated"
                value={formatDate(selectedRow.updatedAt)}
              />
            </SimpleGrid>

            <Divider my="md" />

            <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.4}>
              Notes
            </Text>
            <Text mt="xs" size="sm" c="gray.7" lh={1.6}>
              {formatValue(selectedRow.notes)}
            </Text>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default OrgTeamDetailDrawer
