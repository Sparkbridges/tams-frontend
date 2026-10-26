import {
  TamsButton,
  TamsDatePickerInput,
  TamsMultiSelect,
  TamsSelectInput,
  TamsTable,
  TamsYearPickerInput,
} from '#/components/atoms'
import {
  TamsCheckboxCard,
  TamsGoBackNavigation,
  TamsStatsCard,
} from '#/components/molecules'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'
import {
  capitalize,
  hrmReportsFilter,
  newDayjs,
  segmentedControlData,
  useDownloadAs,
  useFetchDepartmentsAssignedToBranch,
  useFetchOrganizationAllEmployees,
  useFetchOrganizationBranches,
  useGenerateHrmLeaveReports,
  useGenerateHrmReports,
  useGetHrmLeaveTypes,
  useTamsStore,
} from '#/lib'
import type {
  TamsMenuItem,
  TamsTableColumn,
  TamsTableData,
  TFetchHrmLeaveReportsGroupByEmployeeData,
  TFetchHrmLeaveReportsGroupByLeaveData,
  TGenerateHrmReportsParams,
  TStatsCard,
} from '#/lib'
import {
  Alert,
  Badge,
  Box,
  Checkbox,
  Group,
  Paper,
  Progress,
  SegmentedControl,
  Stack,
  Tooltip,
} from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import {
  BuildingOfficeIcon,
  ClipboardTextIcon,
  ColumnsIcon,
  DotIcon,
  DownloadIcon,
  FileCsvIcon,
  FileXlsIcon,
  FunnelIcon,
} from '@phosphor-icons/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { transformHrmLeaveReportsGroupByEmployeeData } from '#/lib/utils'

const reportTypes = [
  { label: 'Exemption Report', value: 'exemption' },
  { label: 'Leave Usage', value: 'leave' },
]

const AllHrmReports = () => {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const { user, companyDetails } = useTamsStore()

  const [selectedReportType, setSelectedReportType] = useState<
    'exemption' | 'leave' | null
  >(null)
  const [customDateRange, setCustomDateRange] = useState<
    [DateValue | undefined, DateValue | undefined] | DateValue | undefined
  >()
  const [columnsFilter, setColumnsFilter] = useState<string[]>([])
  const [selectedSegment, setSelectedSegment] = useState<
    'all' | 'employee' | 'branch' | 'department'
  >('all')
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  )
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [searchEmployee, setSearchEmployee] = useState('')
  const [tableData, setTableData] = useState<TamsTableData[]>([])
  const [page, setPage] = useState(1)

  const [groupBy, setGroupBy] = useState<'leave' | 'employee' | null>(
    'employee',
  )

  const [year, setYear] = useState<DateValue | undefined>(undefined)

  const [leaveTypeId, setLeaveTypeId] = useState<string | null>(null)

  const [error, setError] = useState<Record<string, string>>({})

  const [params, setParams] = useState<TGenerateHrmReportsParams | undefined>(
    undefined,
  )

  const [total, setTotal] = useState(0)

  const { data: organizationBranches } = useFetchOrganizationBranches(
    undefined,
    (data) =>
      data.data.results.map((branch) => ({
        label: branch.station_name,
        value: branch.id.toString(),
      })),
  )

  const { data: employees } = useFetchOrganizationAllEmployees(
    {
      search_query: !searchEmployee ? undefined : searchEmployee,
      page: 1,
      perPage: 20,
    },
    (data) =>
      data.data.results.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const { data: leaveTypes } = useGetHrmLeaveTypes((item) =>
    item.data.results.map((leaveType) => ({
      label: leaveType.leave_name,
      value: leaveType.id.toString(),
    })),
  )

  const { data: organizationDepartments } = useFetchDepartmentsAssignedToBranch(
    selectedBranch ? Number(selectedBranch) : undefined,
    (data) =>
      data.data.map((department) => ({
        label: department.department_name,
        value: department.id.toString(),
      })),
  )

  const { data: generateHrmReports, isLoading: isGeneratingHrmReports } =
    useGenerateHrmReports(
      Boolean(params) && selectedReportType === 'exemption',
      params && { ...params, page },
    )

  const {
    data: generateHrmLeaveReports,
    isLoading: isGeneratingHrmLeaveReports,
  } = useGenerateHrmLeaveReports(
    Boolean(params) && selectedReportType === 'leave',
    params && { ...params, page },
  )

  useEffect(() => {
    let formattedResponse
    if (selectedReportType === 'exemption' && generateHrmReports) {
      formattedResponse = generateHrmReports.data.results
      setTableData(formattedResponse)
      setTotal(generateHrmReports.data.total)
      navigate({
        to: '/admin-dashboard/hrm/hrm-reports',
        hash: 'generate-report',
      })
      return
    }
    if (selectedReportType === 'leave' && generateHrmLeaveReports) {
      if (groupBy === 'employee') {
        formattedResponse = transformHrmLeaveReportsGroupByEmployeeData(
          generateHrmLeaveReports.data as TFetchHrmLeaveReportsGroupByEmployeeData,
        )
      } else {
        formattedResponse = (
          generateHrmLeaveReports.data as TFetchHrmLeaveReportsGroupByLeaveData
        ).results
      }
      setTableData(formattedResponse)
      setTotal(generateHrmLeaveReports.data.total)
      navigate({
        to: '/admin-dashboard/hrm/hrm-reports',
        hash: 'generate-report',
      })
      return
    }
  }, [
    generateHrmReports,
    generateHrmLeaveReports,
    selectedReportType,
    groupBy,
    setTableData,
    setTotal,
  ])

  const { exportTableCSV, exportTableXLSX } = useDownloadAs({
    filename: 'hrm_reports',
  })

  const cards = hrmReportsFilter.map((item, index) => (
    <TamsCheckboxCard
      value={item.value}
      description={item.description}
      label={item.label}
      key={index}
    />
  ))

  const newColumns = useMemo((): TamsTableColumn[] => {
    const cols = columnsFilter.map((item) => {
      const obj = hrmReportsFilter.find((i) => i.value === item)
      return {
        accessor: item,
        label: obj?.label as string,
      }
    })
    if (selectedReportType === 'leave') {
      if (groupBy === 'employee') {
        return [
          {
            label: 'Employee Name',
            accessor: 'name',
          },
          ...(leaveTypes?.map((leaveType) => ({
            label: capitalize(leaveType.label),
            accessor: leaveType.label,
            render(row) {
              const rowData = row[
                leaveType.label
              ] as unknown as TFetchHrmLeaveReportsGroupByEmployeeData['reports'][number]['entitled_leaves'][number]

              const value = rowData
                ? (Number(rowData.taken || 1) / Number(rowData.entitlement)) *
                  100
                : 0

              const tooltipLabel = rowData
                ? `${rowData.taken || 0} taken, ${rowData.scheduled || 0} scheduled, ${rowData.pending_approval || 0} pending, ${rowData.balance} available of ${rowData.entitlement}`
                : ''
              return rowData ? (
                <div>
                  <Progress.Root size={'md'}>
                    <Tooltip label={tooltipLabel}>
                      <Progress.Section
                        striped
                        value={value}
                        color="t-purple"
                      />
                    </Tooltip>
                  </Progress.Root>
                  <div className="mt-1 flex items-center gap-0.5 text-xs text-pretty flex-wrap text-mauve-600">
                    <span>
                      {rowData.balance} left of {rowData.entitlement}
                    </span>
                    {rowData.pending_approval && <DotIcon />}
                    <span>
                      {rowData.pending_approval
                        ? `${rowData.pending_approval} pending`
                        : null}
                    </span>
                  </div>
                </div>
              ) : (
                '-'
              )
            },
          })) as TamsTableColumn[]),
        ]
      }
      if (groupBy === 'leave') {
        return [
          {
            label: 'Employee Name',
            accessor: 'name',
            width: 200,
          },
          ...cols,
          {
            label: 'Entitlement (Days)',
            accessor: 'entitlement',
            width: 200,
          },
          {
            label: 'Pending Approval (Days)',
            accessor: 'pending_approval',
            width: 200,
          },
          {
            label: 'Scheduled (Days)',
            accessor: 'scheduled',
            width: 200,
          },
          {
            label: 'Taken (Days)',
            accessor: 'taken',
            width: 150,
          },
          {
            label: 'Balance (Days)',
            accessor: 'balance',
            width: 150,
          },
        ]
      }
    }
    return [...cols, { label: 'Exemption Count', accessor: 'exemption_count' }]
  }, [columnsFilter, leaveTypes, groupBy, selectedReportType])

  const isValidated = useCallback(() => {
    const errors: Record<string, string> = {}
    switch (selectedReportType) {
      case 'exemption':
        if (
          !(
            customDateRange as [DateValue | undefined, DateValue | undefined]
          )?.[0] ||
          !(
            customDateRange as [DateValue | undefined, DateValue | undefined]
          )?.[1]
        ) {
          errors.customDateRange = 'Select both a start and end date.'
        }
        if (columnsFilter.length === 0) {
          errors.columnsFilter = 'Select at least one column.'
        }
        if (selectedSegment === 'branch' && !selectedBranch) {
          errors.branch = 'Select a branch.'
        }
        if (selectedSegment === 'department' && !selectedDepartment) {
          errors.department = 'Select a department.'
          if (!selectedBranch) {
            errors.branch = 'Select a branch.'
          }
        }
        if (selectedSegment === 'employee' && selectedEmployees.length === 0) {
          errors.employees = 'Select at least one employee.'
        }
        return errors

      case 'leave':
        if (!year) {
          errors.year = 'Select a year.'
        }
        if (columnsFilter.length === 0 && groupBy === 'leave') {
          errors.columnsFilter = 'Select at least one column.'
        }
        if (groupBy === 'leave' && !leaveTypeId) {
          errors.leaveTypeId = 'Select a leave type.'
        }
        if (groupBy === 'employee') {
          if (selectedSegment === 'branch' && !selectedBranch) {
            errors.branch = 'Select a branch.'
          }
          if (selectedSegment === 'department' && !selectedDepartment) {
            errors.department = 'Select a department.'
            if (!selectedBranch) {
              errors.branch = 'Select a branch.'
            }
          }
          if (
            selectedSegment === 'employee' &&
            selectedEmployees.length === 0
          ) {
            errors.employees = 'Select at least one employee.'
          }
        }
        return errors

      default:
        return { general: 'Invalid report type selected.' }
    }
  }, [
    columnsFilter,
    customDateRange,
    selectedReportType,
    selectedSegment,
    selectedBranch,
    selectedDepartment,
    selectedEmployees,
    leaveTypeId,
    year,
    groupBy,
  ])

  const resetFilters = () => {
    setColumnsFilter([])
    setError({})
    setSelectedSegment('all')
    setSelectedEmployees([])
    setSelectedBranch(null)
    setSelectedDepartment(null)
    setCustomDateRange([null, null])
    setLeaveTypeId(null)
    setYear(null)
    setGroupBy(null)
    setSelectedReportType(null)
  }

  /*  const handleDownloadPdf = async () => {
    const blob = await generatePersonnelPdfBlob({
      records: tableData,
      columns: newColumns,
      dateRange: customDateRange as [Date | null, Date | null],
      generatedBy: {
        name: user?.employee.first_name + ' ' + user?.employee.last_name,
        role: user?.role_names[0] as string,
        id: user?.employee.pin.toString() as string,
      },
      auditor: {
        name: 'Dr. Folashade Adeyemi',
        title: 'Head of Governance & Audit',
      },
      referenceNumber: `TAMS-HRM-Report-${newDayjs().format('YYYYMMDDHH-mmss')}`,
      generatedAt: new Date(),
    })
    await downloadPdf(blob)
  } */

  const options: TamsMenuItem[] = useMemo(() => {
    return [
      /*       {
        type: 'item',
        label: 'Export as PDF',
        icon: FilePdfIcon,
        disabled: !tableData.length,
        onClick: handleDownloadPdf,
      }, */
      {
        type: 'item',
        label: 'Export as Excel',
        icon: FileXlsIcon,
        disabled: !tableData.length,
        onClick: () =>
          exportTableXLSX(
            newColumns,
            tableData,
            `${selectedReportType}_hrm_report_record_stream at ${newDayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          ),
      },
      {
        type: 'item',
        label: 'Export as csv',
        icon: FileCsvIcon,
        disabled: !tableData.length,
        onClick: () =>
          exportTableCSV(
            newColumns,
            tableData,
            `${selectedReportType}_hrm_report_record_stream at ${newDayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          ),
      },
    ]
  }, [newColumns, tableData])

  const handleCreateHrmReports = async () => {
    const errors = isValidated()
    if (Object.keys(errors).length > 0) {
      setError(errors)
      return
    }

    setError({})

    const payload: TGenerateHrmReportsParams =
      selectedReportType === 'exemption'
        ? {
            fetch_by: selectedSegment === 'all' ? 'company' : selectedSegment,
            columns: columnsFilter,
            fetch_by_id:
              selectedSegment === 'all'
                ? [companyDetails?.id as number]
                : selectedSegment === 'employee'
                  ? selectedEmployees.map((id) => Number(id))
                  : selectedSegment === 'branch'
                    ? selectedBranch
                      ? [Number(selectedBranch)]
                      : []
                    : selectedSegment === 'department'
                      ? [Number(selectedDepartment)]
                      : [],
            start_date: newDayjs((customDateRange as [Date, Date])[0]).format(
              'YYYY-MM-DD',
            ),
            end_date: newDayjs((customDateRange as [Date, Date])[1]).format(
              'YYYY-MM-DD',
            ),
            page,
            perPage: 10,
          }
        : {
            fetch_by: selectedSegment === 'all' ? 'company' : selectedSegment,
            fetch_by_id:
              selectedSegment === 'all'
                ? [companyDetails?.id as number]
                : selectedSegment === 'employee'
                  ? selectedEmployees.map((id) => Number(id))
                  : selectedSegment === 'branch'
                    ? selectedBranch
                      ? [Number(selectedBranch)]
                      : []
                    : selectedSegment === 'department'
                      ? [Number(selectedDepartment)]
                      : [],
            page,
            perPage: 10,
            year:
              groupBy === 'leave'
                ? newDayjs(year as string).format('YYYY')
                : undefined,
            group_by: groupBy === 'employee' ? groupBy : 'leave_type',
            leave_type_id:
              groupBy === 'leave' ? Number(leaveTypeId) : undefined,
            columns: groupBy === 'leave' ? columnsFilter : undefined,
          }
    setParams(payload)
  }

  const reportScope = segmentedControlData.find(
    (item) => item.value === selectedSegment,
  )?.label

  const stats = useMemo((): TStatsCard[] => {
    const dateRange = customDateRange as [Date, Date]
    return [
      {
        title:
          selectedReportType === 'leave'
            ? 'Employee Leave Usage in ' +
              newDayjs(year as string).format('YYYY') +
              ` grouped by (${groupBy})`
            : selectedReportType === 'exemption' && dateRange
              ? `Exemption Report between ${newDayjs(dateRange[0]).format('YYYY-MM-DD')} & ${newDayjs(dateRange[1]).format('YYYY-MM-DD')}`
              : 'Report',
        description: reportScope + ' leave data available in the report.',
        value: total.toString(),
        color: 'dark',
        icon: BuildingOfficeIcon,
      },
      selectedReportType === 'leave' && groupBy === 'employee'
        ? {
            title: 'Report Schema',
            description: 'Leave types counted in the report.',
            value: Array.isArray(leaveTypes)
              ? leaveTypes.length.toString()
              : '0',
            color: 'blue',
            icon: ClipboardTextIcon,
          }
        : {
            title: 'Report Schema',
            description: 'No of columns included in the report.',
            value: columnsFilter.length.toString(),
            color: 'blue',
            icon: ColumnsIcon,
          },
      {
        title: 'Generated By',
        description: 'on ' + new Date().toLocaleDateString(),
        value: user?.employee.first_name + ' ' + user?.employee.last_name,
        color: 'indigo',
        icon: BuildingOfficeIcon,
      },
    ]
  }, [
    total,
    columnsFilter,
    user,
    reportScope,
    selectedReportType,
    groupBy,
    year,
    customDateRange,
  ])

  return (
    <Box>
      {hash === 'generate-report' && (
        <section className="space-y-4">
          <TamsGoBackNavigation label="Go back" />
          <div className="grid grid-cols-12 gap-5">
            {stats.map((stat, index) => (
              <div key={index} className="lg:col-span-4 col-span-12">
                <TamsStatsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  description={stat.description}
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <TamsTable
              disableSearch
              total={total}
              page={page}
              setPage={setPage}
              data={tableData}
              columns={newColumns}
              filters={
                <div className="flex items-center w-full">
                  <Group>
                    <h2>
                      {capitalize(selectedReportType ?? '')} Record Stream
                    </h2>
                    <Badge size="sm" color="indigo" variant="light">
                      Preview
                    </Badge>
                  </Group>
                  <div className="ml-auto">
                    <TamsButtonDropdown
                      width={250}
                      variant="outline"
                      radius={'xl'}
                      btnText="Export"
                      options={options}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </section>
      )}
      {!hash && (
        <div className={'grid grid-cols-12 gap-4'}>
          <Paper p="md" radius="lg" className="col-span-4">
            <div className="flex items-center gap-3">
              <Badge circle size="xl">
                1
              </Badge>
              <h2 className="text-lg font-semibold">Report Filters</h2>
            </div>
            <div className="space-y-2.5">
              <TamsSelectInput
                value={selectedReportType}
                onChange={(value) =>
                  setSelectedReportType(value as 'exemption' | 'leave' | null)
                }
                label="Select Report Type"
                searchable
                data={reportTypes}
                withAsterisk
              />
              <>
                {selectedReportType === 'exemption' ? (
                  <TamsDatePickerInput
                    label="Select Date Range"
                    type="range"
                    value={customDateRange as DateValue | undefined}
                    onChange={(value) => {
                      setCustomDateRange(value)
                      setError((prev) => ({ ...prev, customDateRange: '' }))
                    }}
                    error={error['customDateRange']}
                  />
                ) : selectedReportType === 'leave' ? (
                  <TamsYearPickerInput
                    label="Select Year"
                    value={year}
                    onChange={(value) => {
                      setYear(value)
                      setError((prev) => ({ ...prev, year: '' }))
                    }}
                    error={error['year']}
                  />
                ) : null}
              </>
              {selectedReportType === 'leave' && (
                <div>
                  <TamsSelectInput
                    value={groupBy}
                    onChange={(value) => {
                      setGroupBy(value as 'employee' | 'leave' | null)
                      setError((prev) => ({ ...prev, groupBy: '' }))
                    }}
                    label="Select Group By"
                    searchable
                    data={[
                      { value: 'employee', label: 'Employee' },
                      { value: 'leave', label: 'Leave Type' },
                    ]}
                    withAsterisk
                  />
                </div>
              )}
              {selectedReportType === 'leave' && groupBy === 'leave' && (
                <div>
                  <TamsSelectInput
                    value={leaveTypeId}
                    onChange={(value) => {
                      setLeaveTypeId(value)
                      setError((prev) => ({ ...prev, leaveType: '' }))
                    }}
                    label="Select Leave Type"
                    searchable
                    data={leaveTypes}
                    withAsterisk
                  />
                </div>
              )}
            </div>
            {(selectedReportType === 'exemption' ||
              (selectedReportType === 'leave' && groupBy === 'leave')) && (
              <div>
                <div className="flex items-center gap-2 bg-secondary/10 p-2 mt-4 text-sm rounded-md">
                  <Checkbox
                    checked={columnsFilter.length === hrmReportsFilter.length}
                    onChange={(event) =>
                      setColumnsFilter(
                        event.currentTarget.checked
                          ? hrmReportsFilter.map((item) => item.value)
                          : [],
                      )
                    }
                  />
                  Select all Available Columns
                  <Badge size="sm" variant="light" ml="auto">
                    {columnsFilter.length} selected
                  </Badge>
                </div>
                {error['columnsFilter'] && (
                  <p className="text-sm text-red-500 mt-2">
                    {error['columnsFilter']}
                  </p>
                )}
                <Checkbox.Group
                  value={columnsFilter}
                  onChange={(e) => {
                    setColumnsFilter(e)
                    setError((prev) => ({ ...prev, columnsFilter: '' }))
                  }}
                >
                  <Stack className="h-145 overflow-y-auto" pt="md" gap="xs">
                    {cards}
                  </Stack>
                </Checkbox.Group>
              </div>
            )}
          </Paper>
          <section className="col-span-8 space-y-4">
            <Paper p="md" radius="lg" className="col-span-8 space-y-6">
              <div className="flex items-center gap-3">
                <Badge circle size="xl">
                  2
                </Badge>
                <h2 className="text-lg font-semibold">
                  Target Workforce & Criteria
                </h2>
              </div>
              <div>
                <p className="font-medium mb-1 text-sm text-gray-700">
                  Workforce Segmentation
                </p>
                <SegmentedControl
                  value={selectedSegment}
                  onChange={(value) =>
                    setSelectedSegment(
                      value as 'all' | 'employee' | 'branch' | 'department',
                    )
                  }
                  data={segmentedControlData}
                />
                <section className="mt-5">
                  {selectedSegment === 'all' ? (
                    <Alert
                      icon={<FunnelIcon />}
                      title="All Workforce Selected"
                      variant="light"
                      color="blue"
                    >
                      You have selected all Employees.
                    </Alert>
                  ) : selectedSegment === 'employee' ? (
                    <TamsMultiSelect
                      label="Select Employees"
                      value={selectedEmployees}
                      onChange={(value) => {
                        setSelectedEmployees(value)
                        setError((prev) => ({ ...prev, employees: '' }))
                      }}
                      searchable
                      onSearchChange={setSearchEmployee}
                      searchValue={searchEmployee}
                      data={employees ?? []}
                      error={error['employees']}
                    />
                  ) : selectedSegment === 'branch' ? (
                    <TamsSelectInput
                      value={selectedBranch}
                      onChange={setSelectedBranch}
                      label="Select Branch"
                      searchable
                      data={organizationBranches}
                      error={error['branch']}
                    />
                  ) : selectedSegment === 'department' ? (
                    <div className="space-y-3">
                      <TamsSelectInput
                        value={selectedBranch}
                        onChange={setSelectedBranch}
                        label="Select Branch"
                        searchable
                        data={organizationBranches}
                        error={error['branch']}
                      />
                      <TamsSelectInput
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        label="Select Department"
                        searchable
                        data={organizationDepartments ?? []}
                        error={error['department']}
                      />
                    </div>
                  ) : null}
                </section>
              </div>
            </Paper>

            <Paper p="md" className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Ready to generate the report</p>
                <p className="text-xs text-gray-600">
                  Ensure all filters are set before generating the report.
                </p>
              </div>

              <Group>
                <TamsButton
                  disabled={!selectedReportType}
                  onClick={resetFilters}
                  variant="default"
                  size="md"
                >
                  Reset Filters
                </TamsButton>
                <TamsButton
                  loading={
                    isGeneratingHrmReports || isGeneratingHrmLeaveReports
                  }
                  size="md"
                  disabled={!selectedReportType}
                  leftSection={<DownloadIcon />}
                  onClick={handleCreateHrmReports}
                >
                  Generate Report
                </TamsButton>
              </Group>
            </Paper>
          </section>
        </div>
      )}
    </Box>
  )
}

export default AllHrmReports
