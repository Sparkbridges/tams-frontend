import { Alert, Group, Paper, Skeleton, Stack, Text } from '@mantine/core'
import { Schedule } from '@mantine/schedule'
import { TamsButton, TamsSelectInput } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import useHandleShiftCalendar from '#/lib/hooks/tables/useHandleShiftCalendar'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'

export default function AttendanceShiftCalendar() {
  const state = useHandleShiftCalendar()
  if (!state.canView) return <AttendanceAccessDenied />
  const selected = state.selected
  const hasSavedShift =
    selected && selected.shift !== 'NA' && selected.shift_type_id !== undefined
  return (
    <AttendanceWorkshiftsLayout>
      <Stack gap="lg">
        <Group align="end">
          <TamsSelectInput
            label="Employee"
            searchable
            allowDeselect={false}
            value={state.employee.value}
            data={state.options}
            searchValue={state.search}
            onSearchChange={state.setSearch}
            description={
              state.employees.isFetching
                ? 'Searching...'
                : 'Type a name to search'
            }
            onChange={(value) => {
              const employee = state.options.find(
                (option) => option.value === value,
              )
              if (employee) {
                state.setEmployee(employee)
                state.setSelectedDate(null)
              }
            }}
          />
          <TamsButton
            variant="outline"
            loading={state.query.isFetching}
            disabled={!state.employee.value}
            onClick={() => void state.query.refetch()}
          >
            Refresh
          </TamsButton>
        </Group>
        <Alert color="blue">
          This calendar shows saved schedules only. A blank date means no saved
          schedule, not an off day. Regular workshifts may not have generated
          future dates yet. Times are displayed as recorded, without timezone
          conversion.
        </Alert>
        {state.employees.isError && (
          <AttendanceQueryError
            error={state.employees.error}
            retry={() => void state.employees.refetch()}
          />
        )}
        {!state.employee.value ? (
          <Alert>Select an employee to view their calendar.</Alert>
        ) : state.query.isError ? (
          <AttendanceQueryError
            error={state.query.error}
            retry={() => void state.query.refetch()}
          />
        ) : state.query.isLoading ? (
          <Skeleton height={400} />
        ) : (
          <Paper withBorder p="md" radius="lg">
            {!state.events.length && (
              <Alert mb="md">No saved schedules for this period.</Alert>
            )}
            <Schedule
              date={state.date}
              onDateChange={state.setDate}
              view={state.view}
              onViewChange={state.setView}
              events={state.events}
              layout="responsive"
              withAgenda
              monthViewProps={{ firstDayOfWeek: 1 }}
              weekViewProps={{ firstDayOfWeek: 1 }}
              onEventClick={(event) => state.setSelectedDate(String(event.id))}
              onDayClick={(day) => state.setSelectedDate(day)}
            />
          </Paper>
        )}
      </Stack>
      <TamsDrawer
        title="Employee schedule"
        opened={state.selectedDate !== null}
        onClose={() => state.setSelectedDate(null)}
        size="md"
      >
        <Stack p="lg">
          <Text fw={700}>{state.employee.label}</Text>
          <Text>{state.selectedDate}</Text>
          {!hasSavedShift ? (
            <Alert>No saved schedule for this date.</Alert>
          ) : (
            <>
              <Text fw={600}>
                {selected.shift_type_id === 0
                  ? 'Off day'
                  : (selected.shift_type_name ?? 'Assigned shift')}
              </Text>
              {selected.shift_type_id !== 0 && (
                <Text>
                  {selected.shift_start} - {selected.shift_end}
                </Text>
              )}
              {selected.shift_date_end && (
                <Text size="sm">
                  Ends on {selected.shift_date_end.slice(0, 10)}
                </Text>
              )}
            </>
          )}
        </Stack>
      </TamsDrawer>
    </AttendanceWorkshiftsLayout>
  )
}
