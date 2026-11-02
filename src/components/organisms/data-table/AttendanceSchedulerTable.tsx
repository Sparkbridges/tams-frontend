import { Alert, Group, Paper, Stack, Text } from '@mantine/core'
import { TamsButton, TamsDateInput, TamsTable } from '#/components/atoms'
import useHandleAttendanceScheduler from '#/lib/hooks/tables/useHandleAttendanceScheduler'
import ShiftRecipients from '../attendance/ShiftRecipients'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from '../attendance/AttendanceDevicesLayout'
import ScheduleAssignmentModal from '../modals/ScheduleAssignmentModal'

export default function AttendanceSchedulerTable() {
  const state = useHandleAttendanceScheduler()
  if (!state.access.canView) return <AttendanceAccessDenied />
  return (
    <Stack gap="lg">
      <Alert color="blue">
        Use Workshift for recurring branch/department routines. Scheduler saves
        employee assignments for specific dates and overrides their saved shifts
        on those dates.
      </Alert>
      <Paper withBorder p="lg" radius="lg">
        <Stack>
          <ShiftRecipients
            value={state.recipients}
            onChange={state.setRecipients}
            allowedTypes={['company', 'branch', 'employee']}
          />
          <Group align="end">
            <TamsDateInput
              label="Start date"
              value={state.startDate}
              onChange={state.setStartDate}
            />
            <TamsDateInput
              label="End date"
              value={state.endDate}
              onChange={state.setEndDate}
            />
            <TamsButton onClick={state.handleGenerate}>
              Load schedules
            </TamsButton>
          </Group>
          {state.error && (
            <Text c="red" role="alert">
              {state.error}
            </Text>
          )}
        </Stack>
      </Paper>
      {state.query.isError && (
        <AttendanceQueryError
          error={state.query.error}
          retry={() => void state.query.refetch()}
        />
      )}
      {state.params && !state.query.isError && (
        <>
          <Text size="sm" c="dimmed">
            Select employees on the current page, then choose Assign shifts.
            Dates without stored assignments are not off days.
          </Text>
          <TamsTable
            key={JSON.stringify(state.params)}
            columns={state.columns}
            data={state.tableData}
            page={state.params.page}
            setPage={(page) =>
              state.setParams((current) =>
                current ? { ...current, page } : null,
              )
            }
            total={state.query.data?.data.total}
            loading={state.query.isLoading}
            disableSearch
            bulkSelectionOptions={
              state.access.canSave
                ? [{ label: 'Assign shifts', action: state.handleAssign }]
                : []
            }
          />
        </>
      )}
      {state.selectedEmployees.length > 0 && (
        <ScheduleAssignmentModal
          employees={state.selectedEmployees}
          startDate={state.params?.start_date ?? ''}
          onClose={state.closeAssignment}
        />
      )}
    </Stack>
  )
}
