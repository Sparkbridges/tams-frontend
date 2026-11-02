import { useState } from 'react'
import {
  Alert,
  Badge,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { TamsDrawer } from '#/components/atoms/drawer'
import { Link } from '@tanstack/react-router'
import { TamsButton, TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import {
  useUnassignWorkshift,
  useWorkshift,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import { shiftDays } from '#/lib/utils/schema/workshift.schema'
import type { ShiftAssignment } from '#/lib/types/api/workshift'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from '../attendance/AttendanceDevicesLayout'

export default function AttendanceWorkshiftDetailDrawer({
  selectedId,
  opened,
  onClose,
}: {
  selectedId: number
  opened: boolean
  onClose: () => void
}) {
  const id = selectedId
  const access = useWorkshiftAccess()
  const hasSelection = Number.isSafeInteger(id) && id > 0
  const query = useWorkshift(opened && hasSelection && access.canView ? id : 0)
  const remove = useUnassignWorkshift()
  const [assignment, setAssignment] = useState<ShiftAssignment | null>(null)
  const shift = query.data?.data
  return (
    <TamsDrawer
      title="Workshift details"
      opened={opened}
      onClose={() => {
        if (!remove.isPending) onClose()
      }}
      size="xl"
    >
      <Stack p="lg" gap="lg">
        {!access.canView ? (
          <AttendanceAccessDenied />
        ) : !hasSelection ? (
          <Alert>Select a workshift to view its details.</Alert>
        ) : query.isError ? (
          <AttendanceQueryError
            error={query.error}
            retry={() => void query.refetch()}
          />
        ) : query.isLoading ? (
          <div role="status" aria-label="Loading workshift details">
            <Skeleton height={300} />
          </div>
        ) : !shift ? (
          <Alert color="red">Work shift not found.</Alert>
        ) : (
          <Stack>
            <Paper withBorder p="lg" radius="lg">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">
                    Workshift #{shift.id}
                  </Text>
                  <Title order={3}>{shift.name}</Title>
                </div>
                <Badge>
                  {shift.is_generic
                    ? 'All branches'
                    : `Branch ${shift.station_id}`}
                </Badge>
              </Group>
              <Group mt="md">
                {access.canEdit && (
                  <Link
                    to="/admin-dashboard/attendance/workshift/edit/$id"
                    params={{ id: String(id) }}
                  >
                    Edit shift
                  </Link>
                )}
                {access.canAssign && (
                  <Link
                    to="/admin-dashboard/attendance/workshift/assign-employee/$id"
                    params={{ id: String(id) }}
                  >
                    Manage assignments
                  </Link>
                )}
                <TamsButton
                  variant="light"
                  loading={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  Refresh
                </TamsButton>
              </Group>
            </Paper>
            <Text fw={600}>Weekly schedule</Text>
            <TamsTable
              columns={[
                { label: 'Day', accessor: 'day' },
                { label: 'Shift type', accessor: 'shift_type' },
              ]}
              data={shift.regular_shift_days.map((day) => ({
                id: day.day_id,
                day: shiftDays[day.day_id - 1],
                shift_type:
                  day.shift_type_id === 0
                    ? 'Off day'
                    : (day.shift_type_name ?? `Type ${day.shift_type_id}`),
              }))}
              page={1}
              disablePagination
              disableSearch
            />
            <Text fw={600}>Assignments ({shift.assignables.length})</Text>
            {!shift.assignables.length && (
              <Alert>No recipients are assigned to this workshift.</Alert>
            )}
            <TamsTable
              columns={[
                { label: 'ID', accessor: 'id' },
                { label: 'Type', accessor: 'type' },
                { label: 'Name', accessor: 'name' },
                ...(access.canAssign
                  ? [
                      {
                        label: 'Actions',
                        accessor: 'actions',
                        render: (row: { id?: unknown }) => (
                          <TamsButton
                            color="red"
                            variant="subtle"
                            onClick={() =>
                              setAssignment(
                                shift.assignables.find(
                                  (item) => item.id === row.id,
                                ) ?? null,
                              )
                            }
                          >
                            Unassign
                          </TamsButton>
                        ),
                      },
                    ]
                  : []),
              ]}
              data={shift.assignables.map((item) => ({
                id: item.id,
                type: item.type,
                name: item.type_name,
              }))}
              page={1}
              disablePagination
              disableSearch
            />
          </Stack>
        )}
      </Stack>
      <TamsConfirmation
        opened={assignment !== null}
        onClose={() => {
          if (!remove.isPending) setAssignment(null)
        }}
        title="Unassign work shift"
        message={`Remove this shift from ${assignment?.type_name ?? 'this recipient'}?`}
        loading={remove.isPending}
        isCritical
        onConfirm={() => {
          if (assignment && !remove.isPending)
            remove.mutate(
              { id, assignable_id: assignment.id },
              { onSuccess: () => setAssignment(null) },
            )
        }}
      />
    </TamsDrawer>
  )
}
