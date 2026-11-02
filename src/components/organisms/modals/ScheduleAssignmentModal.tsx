import {
  Alert,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import { TamsButton, TamsModal2 } from '#/components/atoms'
import { Tams2ColsForm2 } from '#/components/molecules'
import type { SchedulerEmployee } from '#/lib/types/api/scheduler'
import useScheduleAssignmentForm from '#/lib/hooks/forms/useScheduleAssignmentForm'
import { AttendanceQueryError } from '../attendance/AttendanceDevicesLayout'

export default function ScheduleAssignmentModal(props: {
  employees: SchedulerEmployee[]
  startDate: string
  onClose: () => void
}) {
  const state = useScheduleAssignmentForm(props)
  const conflicts = state.preview.filter((item) => item.existing).length
  return (
    <TamsModal2
      opened
      onClose={state.handleCancel}
      title="Assign employee schedules"
      size="xl"
      closeOnClickOutside={false}
    >
      <Stack>
        <Alert color="blue">
          Repeats create dated assignments up to the end date, not an ongoing
          rule. Maximum 93 days, 100 employees and 5,000 assignments.
        </Alert>
        {state.types.isError && (
          <AttendanceQueryError
            error={state.types.error}
            retry={() => void state.types.refetch()}
          />
        )}
        <Tams2ColsForm2 form={state.form} fields={state.fields} />
        {state.previewValues && (
          <Paper withBorder p="md" radius="md">
            <Stack>
              <Text fw={600}>Review assignments</Text>
              {state.previewQuery.isError ? (
                <AttendanceQueryError
                  error={state.previewQuery.error}
                  retry={() => void state.previewQuery.refetch()}
                />
              ) : state.previewQuery.isFetching ? (
                <Text role="status">Checking existing schedules...</Text>
              ) : (
                <>
                  <Text>
                    {state.preview.length} assignments; {conflicts} existing
                    schedules will be{' '}
                    {state.previewValues.on_conflict === 'skip'
                      ? 'kept'
                      : 'replaced'}
                    .
                  </Text>
                  {state.missingEmployees && (
                    <Alert color="red">
                      Some employees are no longer accessible or have no PIN.
                      Close and refresh the employee list.
                    </Alert>
                  )}
                  <ScrollArea h={240}>
                    <Table aria-label="Schedule assignment preview">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Employee</Table.Th>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Existing schedule</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {state.preview.map((item) => (
                          <Table.Tr
                            key={`${item.employee_id}:${item.shift_date_start}`}
                          >
                            <Table.Td>{item.name}</Table.Td>
                            <Table.Td>{item.shift_date_start}</Table.Td>
                            <Table.Td>
                              {item.existing ?? 'No saved schedule'}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                </>
              )}
            </Stack>
          </Paper>
        )}
        <Group justify="flex-end">
          <TamsButton
            variant="subtle"
            disabled={state.save.isPending}
            onClick={state.handleCancel}
          >
            Cancel
          </TamsButton>
          <TamsButton
            variant="outline"
            onClick={() => state.handlePreview()}
            disabled={state.save.isPending}
          >
            Preview assignments
          </TamsButton>
          {state.previewValues && (
            <TamsButton
              onClick={state.handleSave}
              loading={state.save.isPending}
              disabled={
                !state.previewQuery.isSuccess ||
                state.previewQuery.isFetching ||
                !!state.missingEmployees
              }
            >
              Confirm and save
            </TamsButton>
          )}
        </Group>
      </Stack>
    </TamsModal2>
  )
}
