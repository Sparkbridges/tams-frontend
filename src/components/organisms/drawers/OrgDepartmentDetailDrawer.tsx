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
  BuildingOfficeIcon,
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

const formatValue = (value?: string | number | boolean | null) => {
  if (value === null || value === undefined || value === '')
    return 'Not provided'
  return value.toString()
}

const formatDate = (value?: string | number | boolean | null) => {
  if (!value) return 'Not provided'

  const date = new Date(value as string)
  if (Number.isNaN(date.getTime())) return value.toString()

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date)
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

const OrgDepartmentDetailDrawer = ({ opened, onClose, selectedRow }: Props) => {
  return (
    <TamsDrawer
      title="Department Details"
      size={'lg'}
      opened={opened}
      onClose={onClose}
    >
      {!selectedRow ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>No department selected</Text>
          <Text size="sm" c="dimmed">
            Select a department from the table to view its details.
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg" p="lg">
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                  Organization department
                </Text>
                <Title order={3} fw={700} c="gray.8">
                  {formatValue(selectedRow.departmentName)}
                </Title>
              </Stack>

              <Badge
                color={selectedRow.status === 'Active' ? 'green' : 'gray'}
                variant="light"
                radius="sm"
                size="lg"
              >
                {formatValue(selectedRow.status)}
              </Badge>
            </Group>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Department ID
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.id)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Group department
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.groupDepartment)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Branch
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.branches)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Head of department
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(selectedRow.headOfDepartment)}
                </Text>
              </Paper>
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md">
              <ActionIcon variant="light" color="blue" radius="md">
                <BuildingOfficeIcon size={18} />
              </ActionIcon>
              <Text fw={700} size="lg" c="gray.8">
                Department profile
              </Text>
            </Group>

            <Stack gap="md">
              <DetailRow
                icon={<HashIcon size={16} />}
                label="Department ID"
                value={formatValue(selectedRow.id)}
              />
              <DetailRow
                icon={<UserIcon size={16} />}
                label="Head of department"
                value={formatValue(selectedRow.headOfDepartment)}
              />
              <DetailRow
                icon={<UsersThreeIcon size={16} />}
                label="Group department"
                value={formatValue(selectedRow.groupDepartment)}
              />
              <DetailRow
                icon={<BuildingOfficeIcon size={16} />}
                label="Branch"
                value={formatValue(selectedRow.branches)}
              />
            </Stack>
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

export default OrgDepartmentDetailDrawer
