import { useState } from 'react'
import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import {
  Alert,
  Badge,
  Checkbox,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import {
  ChartLineUpIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileXlsIcon,
} from '@phosphor-icons/react'
import {
  TamsButton,
  TamsDrawer,
  TamsMultiSelect,
  TamsSelectInput,
  TamsTable,
} from '#/components/atoms'
import { TamsCheckboxCard, TamsStatsCard } from '#/components/molecules'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'
import { useTamsStore } from '#/lib/store'
import useDownloadAs from '#/lib/hooks/useDownloadAs'
import { useAttendanceScope } from '#/lib/api/services/attendance'
import {
  useAttendanceReportBranches,
  useAttendanceReportGrades,
  useAttendanceReportTeams,
} from '#/lib/api/services/attendanceReports'
import {
  useShiftDepartments,
  useShiftEmployeeSearch,
} from '#/lib/api/services/workshift'
import performanceReportsClient from '#/lib/api/client/performanceReports'
import { performanceEmployeeColumns } from '#/lib/constants/performanceReports'
import type {
  PerformanceEmployeeReport,
  PerformanceReportParams,
  PerformanceReportScope,
} from '#/lib/types/api/performanceReports'
import { performanceReportSchema } from '#/lib/utils/schema/performanceReports.schema'
import {
  performanceDisplayValue,
  performanceReportColumns,
  performanceReportRows,
} from '#/lib/utils/helpers/performanceReports'
import { getErrorMessage } from '#/lib/utils'
import { generateAttendancePdf } from '../printable/AttendanceReport'

export default function AllPerformanceReports({
  params,
  onChange,
}: {
  params?: PerformanceReportParams
  onChange: (params: PerformanceReportParams) => void
}) {
  const user = useTamsStore((state) => state.user)
  const company = useTamsStore((state) => state.companyDetails)
  const canGenerate =
    user?.permissions.includes('generate performance report') ?? false
  const context = useAttendanceScope()
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState<PerformanceEmployeeReport | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 300)
  const [employeeOptions, setEmployeeOptions] = useState<
    { value: string; label: string }[]
  >([])
  const form = useForm<PerformanceReportParams>({
    initialValues: params ?? {
      fetch_by: 'branch',
      fetch_by_id: [],
      columns: ['first_name', 'last_name', 'pin'],
      year: new Date().getFullYear(),
      group_by: 'employee',
      page: 1,
      perPage: 10,
    },
  })
  const branches = useAttendanceReportBranches(canGenerate)
  const departments = useShiftDepartments(
    canGenerate && form.values.fetch_by === 'department'
      ? (form.values.branch_id ?? 0)
      : 0,
  )
  const teams = useAttendanceReportTeams(
    canGenerate && form.values.fetch_by === 'team',
    debounced,
  )
  const grades = useAttendanceReportGrades(
    canGenerate && form.values.fetch_by === 'grade',
  )
  const employees = useShiftEmployeeSearch(
    canGenerate && form.values.fetch_by === 'employee' ? debounced : '',
  )
  const branchOptions =
    branches.data?.map((branch) => ({
      value: String(branch.id),
      label: branch.station_name,
    })) ?? []
  const foundEmployees =
    employees.data?.data.map((employee) => ({
      value: String(employee.id),
      label: employee.name,
    })) ?? []
  const options =
    form.values.fetch_by === 'branch'
      ? branchOptions
      : form.values.fetch_by === 'department'
        ? (departments.data?.data.map((department) => ({
            value: String(department.id),
            label: department.department_name,
          })) ?? [])
        : form.values.fetch_by === 'team'
          ? (teams.data
              ?.filter(
                (team) =>
                  team.is_generic || team.station_id === form.values.branch_id,
              )
              .map((team) => ({
                value: String(team.id),
                label: team.team_name,
              })) ?? [])
          : form.values.fetch_by === 'grade'
            ? (grades.data
                ?.filter(
                  (grade) =>
                    grade.station_id === null ||
                    grade.station_id === form.values.branch_id,
                )
                .map((grade) => ({
                  value: String(grade.id),
                  label: grade.grade_name,
                })) ?? [])
            : [
                ...employeeOptions.filter(
                  (option) =>
                    !foundEmployees.some((item) => item.value === option.value),
                ),
                ...foundEmployees,
              ]
  const recipientOptions = [
    ...options,
    ...form.values.fetch_by_id
      .filter((id) => !options.some((option) => option.value === String(id)))
      .map((id) => ({ value: String(id), label: `ID ${id}` })),
  ]
  const query = useQuery({
    queryKey: ['performance-reports', context, params],
    queryFn: () => {
      if (!params) throw new Error('Generate a performance report first.')
      return performanceReportsClient.generate(params)
    },
    enabled: canGenerate && !!params,
    retry: false,
  })
  const downloads = useDownloadAs({ filename: 'performance-scorecards' })
  const exportReport = useMutation({
    mutationFn: async (format: 'csv' | 'xlsx' | 'pdf') => {
      if (!params || !canGenerate)
        throw new Error('Generate an accessible report before exporting.')
      const records = await performanceReportsClient.all(params)
      if (!records.length) throw new Error('No matching employees to export.')
      const columns = performanceReportColumns(params)
      const rows = performanceReportRows(records).map((row, id) => ({
        id,
        ...Object.fromEntries(
          columns.map((column) => [
            column.value,
            performanceDisplayValue(row[column.value]),
          ]),
        ),
      }))
      const tableColumns = columns.map((column) => ({
        accessor: column.value,
        label: column.label,
      }))
      const filename = `performance-scorecards-${params.year}`
      if (format === 'csv')
        downloads.exportTableCSV(tableColumns, rows, filename)
      else if (format === 'xlsx')
        downloads.exportTableXLSX(tableColumns, rows, `${filename}.xlsx`)
      else {
        const blob = await generateAttendancePdf({
          reportCategory: 'Performance',
          title: 'Appraisal Scorecard Report',
          period: String(params.year),
          generatedBy: user
            ? `${user.employee.first_name} ${user.employee.last_name}`
            : 'TAMS user',
          company: company ?? undefined,
          scope: `${params.fetch_by}: ${params.fetch_by_id.join(', ')}${params.branch_id ? ` / Branch: ${params.branch_id}` : ''}`,
          grouping: 'employee',
          rows,
          columns,
          warnings: [
            {
              code: 'approved_ended_only',
              message:
                'Only approved scorecards from ended appraisal groups are included. Workforce scope uses current employee records. Employees without matching scorecards are retained.',
            },
          ],
        })
        await downloads.downloadPdf(blob, `${filename}.pdf`)
      }
    },
    onSuccess: () =>
      notifications.show({
        title: 'Report exported',
        message: 'All matching employee scorecards were exported.',
        color: 'green',
      }),
    onError: (error) =>
      notifications.show({
        title: 'Report export failed',
        message: getErrorMessage(error),
        color: 'red',
      }),
  })
  const errorMessage = (error: unknown, retry: () => void) => (
    <Alert color="red" title="Unable to load performance report data">
      <Stack>
        <Text size="sm">{getErrorMessage(error)}</Text>
        <TamsButton onClick={retry}>Try again</TamsButton>
      </Stack>
    </Alert>
  )
  if (!canGenerate)
    return (
      <Alert color="red" title="Access denied">
        You do not have permission to generate performance reports.
      </Alert>
    )
  if (!params || editing)
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const result = performanceReportSchema.safeParse({
            ...form.getValues(),
            columns: Array.from(
              new Set(['first_name', 'last_name', ...form.values.columns]),
            ),
            page: 1,
          })
          if (!result.success) {
            form.setErrors(
              Object.fromEntries(
                result.error.issues.map((issue) => [
                  String(issue.path[0]),
                  issue.message,
                ]),
              ),
            )
            return
          }
          form.clearErrors()
          setEditing(false)
          setSelected(null)
          onChange(result.data)
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
                value="appraisal"
                data={[{ value: 'appraisal', label: 'Appraisal Scorecards' }]}
                allowDeselect={false}
              />
              <Text size="sm" c="dimmed">
                Employee scorecards, appraisal groups and performance-area/KPI
                details.
              </Text>
              <Divider label="Employee information" />
              <Checkbox.Group {...form.getInputProps('columns')}>
                <Stack>
                  {performanceEmployeeColumns.map((column) => (
                    <TamsCheckboxCard
                      key={column.value}
                      value={column.value}
                      label={column.label}
                      description={`Include ${column.label.toLowerCase()}`}
                    />
                  ))}
                </Stack>
              </Checkbox.Group>
              <Text size="xs" c="dimmed">
                Employee name is always included.
              </Text>
            </Stack>
          </Paper>
          <Paper p="lg" radius="lg" className="col-span-12 lg:col-span-8">
            <Group mb="lg">
              <Badge circle size="xl">
                2
              </Badge>
              <Title order={3}>Target Workforce &amp; Criteria</Title>
            </Group>
            <Stack>
              <TamsSelectInput
                label="Workforce scope"
                value={form.values.fetch_by}
                allowDeselect={false}
                data={[
                  { value: 'branch', label: 'Branch' },
                  { value: 'department', label: 'Department' },
                  { value: 'team', label: 'Team' },
                  { value: 'grade', label: 'Grade' },
                  { value: 'employee', label: 'Employees' },
                ]}
                onChange={(value) => {
                  if (
                    ![
                      'branch',
                      'department',
                      'team',
                      'grade',
                      'employee',
                    ].includes(value ?? '')
                  )
                    return
                  form.setValues({
                    fetch_by: value as PerformanceReportScope,
                    fetch_by_id: [],
                    branch_id: undefined,
                  })
                  form.clearErrors()
                  setSearch('')
                  setEmployeeOptions([])
                }}
              />
              {['department', 'team', 'grade'].includes(
                form.values.fetch_by,
              ) && (
                <TamsSelectInput
                  label="Branch"
                  searchable
                  clearable
                  data={branchOptions}
                  value={
                    form.values.branch_id ? String(form.values.branch_id) : null
                  }
                  error={form.errors.branch_id}
                  onChange={(value) =>
                    form.setValues({
                      branch_id: value ? Number(value) : undefined,
                      fetch_by_id: [],
                    })
                  }
                />
              )}
              <TamsMultiSelect
                label="Recipients"
                searchable
                clearable
                data={recipientOptions}
                value={form.values.fetch_by_id.map(String)}
                error={form.errors.fetch_by_id}
                disabled={
                  ['department', 'team', 'grade'].includes(
                    form.values.fetch_by,
                  ) && !form.values.branch_id
                }
                onChange={(ids) => {
                  setEmployeeOptions(
                    recipientOptions.filter((option) =>
                      ids.includes(option.value),
                    ),
                  )
                  form.setFieldValue('fetch_by_id', ids.map(Number))
                }}
                {...(['employee', 'team'].includes(form.values.fetch_by)
                  ? { searchValue: search, onSearchChange: setSearch }
                  : {})}
              />
              {[branches, departments, teams, grades, employees]
                .filter((option) => option.isError)
                .map((option, index) => (
                  <div key={index}>
                    {errorMessage(option.error, () => void option.refetch())}
                  </div>
                ))}
              <Divider label="Appraisal year" />
              <TamsSelectInput
                label="Year"
                searchable
                data={Array.from({ length: 10 }, (_, index) =>
                  String(new Date().getFullYear() - index),
                )}
                value={String(form.values.year)}
                allowDeselect={false}
                onChange={(value) => {
                  if (value) form.setFieldValue('year', Number(value))
                }}
                error={form.errors.year}
              />
              <Text size="sm">Group by employee</Text>
              <Alert color="blue">
                Only approved scorecards from ended appraisal groups are
                included. Employee scope uses current workforce records.
              </Alert>
              <Group justify="flex-end">
                {params && (
                  <TamsButton
                    variant="subtle"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </TamsButton>
                )}
                <TamsButton type="submit">Generate Report</TamsButton>
              </Group>
            </Stack>
          </Paper>
        </div>
      </form>
    )
  const reports = query.data?.data.reports ?? []
  const identityColumns = [
    { value: 'name', label: 'Employee' },
    ...performanceEmployeeColumns.filter((column) =>
      params.columns.includes(column.value),
    ),
  ]
  const loading = query.isFetching
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <TamsButton
          variant="subtle"
          onClick={() => {
            form.setValues(params)
            setEditing(true)
            setSelected(null)
          }}
        >
          Back to filters
        </TamsButton>
        <TamsButton
          variant="outline"
          loading={loading}
          onClick={() => {
            setSelected(null)
            void query.refetch()
          }}
        >
          Refresh report
        </TamsButton>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <TamsStatsCard
          title="Report"
          value="Appraisal Scorecards"
          description={String(params.year)}
          icon={ChartLineUpIcon}
          color="blue"
        />
        <TamsStatsCard
          title="Matching employees"
          value={String(query.data?.data.total ?? 0)}
          description="Server total across all pages"
          icon={ChartLineUpIcon}
          color="indigo"
        />
        <TamsStatsCard
          title="Scorecards on this page"
          value={String(
            reports.reduce(
              (total, report) => total + report.scorecards.length,
              0,
            ),
          )}
          description="Approved scorecards from ended groups"
          icon={ChartLineUpIcon}
          color="dark"
        />
      </SimpleGrid>
      <Alert color="blue">
        Click an employee to inspect their scorecards, performance areas and KPI
        categories/subcategories. Employees without matching scorecards remain
        in the report.
      </Alert>
      {query.isError ? (
        errorMessage(query.error, () => void query.refetch())
      ) : (
        <Paper radius="lg">
          <TamsTable
            disableSearch
            columns={[
              ...identityColumns.map((column) => ({
                label: column.label,
                accessor: column.value,
              })),
              { label: 'Scorecards', accessor: 'scorecards_count' },
            ]}
            data={reports.map((employee) => ({
              id: employee.id,
              ...Object.fromEntries(
                identityColumns.map((column) => [
                  column.value,
                  performanceDisplayValue(
                    column.value === 'name'
                      ? `${employee.first_name} ${employee.last_name}`
                      : employee[column.value],
                  ),
                ]),
              ),
              scorecards_count: employee.scorecards.length,
            }))}
            loading={query.isLoading}
            page={params.page}
            limit={params.perPage}
            total={query.data?.data.total ?? 0}
            setPage={(page) => {
              setSelected(null)
              onChange({ ...params, page })
            }}
            handleRowClick={(row) =>
              setSelected(
                reports.find((employee) => employee.id === row.id) ?? null,
              )
            }
            filters={
              <Group justify="space-between" w="100%">
                <Text fw={600}>Appraisal Scorecards</Text>
                <TamsButtonDropdown
                  btnText={exportReport.isPending ? 'Exporting...' : 'Export'}
                  variant="outline"
                  radius="xl"
                  options={[
                    {
                      type: 'item',
                      label: 'Export all as CSV',
                      icon: FileCsvIcon,
                      onClick: () => exportReport.mutate('csv'),
                      disabled:
                        loading ||
                        exportReport.isPending ||
                        !query.data?.data.total,
                    },
                    {
                      type: 'item',
                      label: 'Export all as Excel',
                      icon: FileXlsIcon,
                      onClick: () => exportReport.mutate('xlsx'),
                      disabled:
                        loading ||
                        exportReport.isPending ||
                        !query.data?.data.total,
                    },
                    {
                      type: 'item',
                      label: 'Export all as PDF',
                      icon: FilePdfIcon,
                      onClick: () => exportReport.mutate('pdf'),
                      disabled:
                        loading ||
                        exportReport.isPending ||
                        !query.data?.data.total,
                    },
                  ]}
                />
              </Group>
            }
          />
        </Paper>
      )}
      {selected && (
        <TamsDrawer
          opened
          onClose={() => setSelected(null)}
          title={`Scorecards for ${selected.first_name} ${selected.last_name}`}
          size="xl"
        >
          <Stack p="lg">
            {selected.scorecards.length === 0 && (
              <Alert>
                No approved scorecards from ended appraisal groups for this
                employee and year.
              </Alert>
            )}
            {selected.scorecards.map((card) => (
              <Paper key={card.id} withBorder p="lg" radius="lg">
                <Stack>
                  <Group justify="space-between">
                    <Title order={3}>{card.appraisalGroup.name}</Title>
                    <Badge>{card.approval_status}</Badge>
                  </Group>
                  <Text>Employee ID: {card.employee.id}</Text>
                  <Text>
                    Appraisal period:{' '}
                    {card.appraisalGroup.appraisalPeriod?.name ??
                      'Not available'}
                  </Text>
                  <Text>Year: {card.appraisalGroup.appraisal_year}</Text>
                  <Text>
                    Total performance score:{' '}
                    {performanceDisplayValue(card.grade_score)}
                  </Text>
                  <Text>Created at: {card.created_at}</Text>
                  {card.appraisalGroup.performanceAreas.length === 0 && (
                    <Text>No performance areas found.</Text>
                  )}
                  {card.appraisalGroup.performanceAreas.map((area) => (
                    <Paper key={area.id} withBorder p="md">
                      <Stack>
                        <Text fw={600}>
                          {area.name} / Area weight: {area.weight}
                        </Text>
                        {area.kpiCategories.length === 0 && (
                          <Text>No KPI categories.</Text>
                        )}
                        {area.kpiCategories.map((category) => (
                          <div key={category.id}>
                            <Text fw={500}>{category.name}</Text>
                            {category.kpiSubcategories.length === 0 ? (
                              <Text size="sm">No subcategories</Text>
                            ) : (
                              category.kpiSubcategories.map((subcategory) => (
                                <Text size="sm" key={subcategory.id}>
                                  {subcategory.name} / Weight:{' '}
                                  {subcategory.weight}
                                </Text>
                              ))
                            )}
                          </div>
                        ))}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </TamsDrawer>
      )}
    </Stack>
  )
}
