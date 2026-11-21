import { TamsButton, TamsDrawer } from '#/components/atoms'
import { useAppraisalPeopleSetting } from '#/lib/api'
import type { AppraisalPeopleKind } from '#/lib/types/api/performance'
import { getErrorMessage, newDayjs } from '#/lib/utils'
import { Alert, Badge, Group, Paper, Stack, Text, Title } from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  onEdit: () => void
  kind: AppraisalPeopleKind
  selectedId: number
}

const AppraisalPeopleSettingDetailDrawer = ({
  opened,
  onClose,
  onEdit,
  kind,
  selectedId,
}: Props) => {
  const { data, isPending, isError, error, refetch } =
    useAppraisalPeopleSetting(kind, opened ? selectedId : undefined)
  const label = kind === 'appraiser' ? 'Appraiser' : 'Approver'

  return (
    <TamsDrawer
      title={`${label} Settings Details`}
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {isPending ? (
        <Text p="md" role="status">
          Loading settings...
        </Text>
      ) : isError ? (
        <Alert color="red" title="Unable to load settings">
          {getErrorMessage(error)}
          <TamsButton onClick={() => refetch()}>Try again</TamsButton>
        </Alert>
      ) : (
        <Stack p="lg" gap="lg">
          <Paper withBorder radius="lg" p="lg">
            <Group justify="space-between">
              <Title order={3}>{data.name}</Title>
              <Badge>{data.approvalType}</Badge>
            </Group>
            <Text size="sm" mt="md">
              {data.description || 'No description provided.'}
            </Text>
            <Text size="sm" mt="sm">
              {data.persons.length} {label.toLowerCase()} level(s)
            </Text>
            <Text size="sm">
              Created:{' '}
              {newDayjs(data.createdAt).format('DD-MM-YYYY [at] HH:mm')}
            </Text>
            <Text size="sm">
              Updated:{' '}
              {newDayjs(data.updatedAt).format('DD-MM-YYYY [at] HH:mm')}
            </Text>
          </Paper>
          {kind === 'appraiser' && (
            <Paper withBorder radius="lg" p="lg">
              <Text fw={600}>Assign by: {data.category.replace('_', ' ')}</Text>
              <Text size="sm" mt="sm">
                {data.assignments.map((item) => item.label).join(', ') ||
                  'No assignments.'}
              </Text>
            </Paper>
          )}
          <Paper withBorder radius="lg" p="lg">
            <Text fw={600} mb="md">
              {label} Levels
            </Text>
            <Stack>
              {data.persons.map((person, index) => (
                <Paper key={index} withBorder radius="md" p="sm">
                  <Text fw={600}>Level {person.level}</Text>
                  <Text>
                    {label}: {person.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Type: {person.personType}
                  </Text>
                  <Text size="sm">
                    Alternate: {person.alternateName || 'Not assigned'}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
          <TamsButton onClick={onEdit}>Edit Settings</TamsButton>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default AppraisalPeopleSettingDetailDrawer
