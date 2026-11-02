import {
  Alert,
  Badge,
  Checkbox,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import {
  TamsButton,
  TamsDateInput,
  TamsMultiSelect,
  TamsSelectInput,
} from '#/components/atoms'
import { TamsCheckboxCard } from '#/components/molecules'
import useAttendanceReportForm from '#/lib/hooks/forms/useAttendanceReportForm'
import type { AttendanceReportParams } from '#/lib/types/api/attendanceReports'
import { AttendanceQueryError } from '../attendance/AttendanceDevicesLayout'

export default function AttendanceReportForm({
  initial,
  onGenerate,
}: {
  initial?: AttendanceReportParams
  onGenerate: (params: AttendanceReportParams) => void
}) {
  const state = useAttendanceReportForm({ initial, onGenerate })
  const { form } = state
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        state.handleGenerate()
      }}
    >
      <div className="grid grid-cols-12 gap-4">
        <Paper p="lg" radius="lg" className="col-span-12 lg:col-span-4">
          <Group mb="md">
            <Badge circle size="xl">
              1
            </Badge>
            <Title order={3}>Report &amp; Columns</Title>
          </Group>
          <Stack>
            <TamsSelectInput
              label="Report type"
              data={state.allowed.map(({ value, label }) => ({ value, label }))}
              allowDeselect={false}
              value={form.values.type}
              onChange={state.changeType}
              error={form.errors.type}
            />
            <Text size="sm" c="dimmed">
              {state.definition?.description}
            </Text>
            <Divider label="Employee information" />
            <Checkbox.Group {...form.getInputProps('columns')}>
              <Stack>
                {state.employeeColumns.map((column) => (
                  <TamsCheckboxCard
                    key={column.value}
                    value={column.value}
                    label={column.label}
                    description={`Include ${column.label.toLowerCase()} in the report`}
                  />
                ))}
              </Stack>
            </Checkbox.Group>
            <Text size="xs" c="dimmed">
              PIN and employee name are always included for identification.
            </Text>
            <Divider label="Report metrics" />
            <Text size="sm">
              {state.metricColumns.map((column) => column.label).join(', ')}
            </Text>
          </Stack>
        </Paper>
        <section className="col-span-12 lg:col-span-8 space-y-4">
          <Paper p="lg" radius="lg">
            <Group mb="lg">
              <Badge circle size="xl">
                2
              </Badge>
              <Title order={3}>Target Workforce &amp; Criteria</Title>
            </Group>
            <Stack>
              <TamsSelectInput
                label="Workforce scope"
                value={state.scope}
                allowDeselect={false}
                onChange={(value) => {
                  if (value) state.changeScope(value)
                }}
                data={[
                  { value: 'all', label: 'All accessible employees' },
                  { value: 'branch', label: 'Branch' },
                  { value: 'department', label: 'Department' },
                  { value: 'team', label: 'Team' },
                  { value: 'grade', label: 'Grade' },
                  { value: 'employee', label: 'Employees' },
                ]}
              />
              {state.scope === 'all' ? (
                <Alert color="blue">
                  Includes employees within your accessible branches.
                </Alert>
              ) : (
                <>
                  {['department', 'team', 'grade'].includes(state.scope) && (
                    <TamsSelectInput
                      label="Branch"
                      data={state.branchOptions}
                      value={state.branchId ? String(state.branchId) : null}
                      searchable
                      clearable
                      error={form.errors.branch_id}
                      onChange={(value) =>
                        form.setValues({
                          branch_id: value ? [Number(value)] : undefined,
                          fetch_by_id: [],
                        })
                      }
                    />
                  )}
                  <TamsMultiSelect
                    label={`Select ${state.scope === 'employee' ? 'employees' : state.scope === 'branch' ? 'branches' : state.scope === 'department' ? 'departments' : state.scope === 'team' ? 'teams' : 'grades'}`}
                    searchable
                    clearable
                    data={state.recipientOptions}
                    value={state.selectedIds}
                    onChange={state.selectRecipients}
                    error={form.errors.fetch_by_id}
                    disabled={
                      ['department', 'team', 'grade'].includes(state.scope) &&
                      !state.branchId
                    }
                    {...(state.scope === 'employee' || state.scope === 'team'
                      ? {
                          searchValue: state.search,
                          onSearchChange: state.setSearch,
                        }
                      : {})}
                  />
                </>
              )}
              {state.queries
                .filter((query) => query.isError)
                .map((query, index) => (
                  <AttendanceQueryError
                    key={index}
                    error={query.error}
                    retry={() => void query.refetch()}
                  />
                ))}
              <Divider label="Attendance period" />
              <Group grow>
                <TamsDateInput
                  label="Start date"
                  withAsterisk
                  {...form.getInputProps('date_from')}
                  value={form.values.date_from || null}
                  onChange={(value) =>
                    form.setFieldValue('date_from', value ?? '')
                  }
                />
                <TamsDateInput
                  label="End date"
                  withAsterisk
                  {...form.getInputProps('date_to')}
                  value={form.values.date_to || null}
                  onChange={(value) =>
                    form.setFieldValue('date_to', value ?? '')
                  }
                />
              </Group>
              <Text size="xs" c="dimmed">
                Up to 93 days per report. Dates are inclusive.
              </Text>
              <Checkbox
                label="Exclude weekends"
                checked={form.values.exclude_weekend}
                onChange={(event) =>
                  form.setValues({
                    exclude_weekend: event.currentTarget.checked,
                    ...(event.currentTarget.checked
                      ? { only_sunday: false }
                      : {}),
                  })
                }
              />
              <Checkbox
                label="Exclude public holidays"
                {...form.getInputProps('exclude_public_holiday', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                label="Sundays only"
                checked={form.values.only_sunday}
                onChange={(event) =>
                  form.setValues({
                    only_sunday: event.currentTarget.checked,
                    ...(event.currentTarget.checked
                      ? { exclude_weekend: false }
                      : {}),
                  })
                }
                error={form.errors.only_sunday}
              />
              <Divider label="Result grouping" />
              <SegmentedControl
                aria-label="Group results by"
                value={form.values.group_by}
                disabled={state.definition?.employeeOnly}
                data={[
                  { value: 'employee', label: 'Employee' },
                  { value: 'date', label: 'Date' },
                ]}
                onChange={(value) => {
                  if (value === 'employee' || value === 'date')
                    form.setFieldValue('group_by', value)
                }}
              />
              {state.definition?.employeeOnly && (
                <Text size="xs" c="dimmed">
                  This report is grouped by employee.
                </Text>
              )}
              {form.values.type === 'overtime' && (
                <Checkbox
                  label="Show approved overtime totals per employee"
                  {...form.getInputProps('hourly_view', { type: 'checkbox' })}
                />
              )}
            </Stack>
          </Paper>
          <Paper p="lg" radius="lg">
            <Group justify="space-between">
              <div>
                <Text fw={600}>Ready to generate the report</Text>
                <Text size="xs" c="dimmed">
                  No saved shift is not the same as an off day or absence.
                </Text>
              </div>
              <Group>
                <TamsButton variant="default" onClick={state.reset}>
                  Reset Filters
                </TamsButton>
                <TamsButton type="submit">Generate Report</TamsButton>
              </Group>
            </Group>
          </Paper>
        </section>
      </div>
    </form>
  )
}
