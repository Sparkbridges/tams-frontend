import {
  TamsButton,
  TamsDatePickerInput,
  TamsMultiSelect,
  TamsSelectInput,
  TamsTable,
} from '#/components/atoms'
import {
  TamsCheckboxCard,
  TamsGoBackNavigation,
  TamsRadioCard,
  TamsStatsCard,
} from '#/components/molecules'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'
import {
  newDayjs,
  reportDateOptions,
  reportsFilter,
  segmentedControlData,
  useCreateEmployeeReports,
  useDownloadAs,
  useFetchDepartmentsAssignedToBranch,
  useFetchOrganizationAllEmployees,
  useFetchOrganizationBranches,
  useTamsStore,
} from '#/lib'
import type {
  TamsMenuItem,
  TamsTableColumn,
  TamsTableData,
  TCreateEmployeeReportsPayload,
  TStatsCard,
} from '#/lib'
import {
  Alert,
  Badge,
  Box,
  Checkbox,
  Divider,
  Group,
  Paper,
  Radio,
  SegmentedControl,
  Stack,
} from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import {
  BuildingOfficeIcon,
  ColumnsIcon,
  DownloadIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileXlsIcon,
  FunnelIcon,
} from '@phosphor-icons/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { generatePersonnelPdfBlob } from '../printable'

const AllUserReports = () => {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const { user } = useTamsStore()
  const [columnsFilter, setColumnsFilter] = useState<string[]>([])
  const [searchEmployee, setSearchEmployee] = useState('')

  const [page, setPage] = useState(1)

  const [selectedSegment, setSelectedSegment] = useState<
    'all' | 'employee' | 'branch' | 'department'
  >('all')

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  )
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const [selectedDateCreated, setSelectedDateCreated] = useState<string | null>(
    'all',
  )

  const [customDateRange, setCustomDateRange] = useState<
    [DateValue | undefined, DateValue | undefined] | DateValue | undefined
  >()
  const [dateRangeError, setDateRangeError] = useState('')
  const [columnsError, setColumnsError] = useState('')

  const [tableData, setTableData] = useState<TamsTableData[]>([])

  const { exportTableCSV, exportTableXLSX, downloadPdf } = useDownloadAs({
    filename: 'users_reports',
  })

  const { data: organizationBranches } = useFetchOrganizationBranches(
    undefined,
    (data) =>
      data.data.results.map((branch) => ({
        label: branch.station_name,
        value: branch.id.toString(),
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

  const {
    mutateAsync: createEmployeeReportsMutateAsync,
    isPending: isCreatingEmployeeReports,
  } = useCreateEmployeeReports()

  const handleCreateEmployeeReports = async () => {
    try {
      const dateFilter =
        selectedDateCreated === 'last_30_days'
          ? { date_filter: 'last_30_days' as const }
          : selectedDateCreated === 'custom_range' &&
              Array.isArray(customDateRange) &&
              customDateRange[0] &&
              customDateRange[1]
            ? {
                date_filter: 'custom_range' as const,
                date_from: newDayjs(customDateRange[0]).format('YYYY-MM-DD'),
                date_to: newDayjs(customDateRange[1]).format('YYYY-MM-DD'),
              }
            : undefined

      if (selectedDateCreated === 'custom_range' && !dateFilter) {
        setDateRangeError('Select both a start and end date.')
        return
      }

      if (columnsFilter.length === 0) {
        setColumnsError('Select at least one column.')
        return
      }

      setDateRangeError('')
      setColumnsError('')

      const payload: TCreateEmployeeReportsPayload = {
        fetch_by: selectedSegment === 'all' ? 'company' : selectedSegment,
        columns: columnsFilter,
        page: 1,
        perPage: 10000,
        ...dateFilter,
        fetch_by_id:
          selectedSegment === 'employee'
            ? selectedEmployees.map((id) => Number(id))
            : selectedSegment === 'branch'
              ? selectedBranch
                ? [Number(selectedBranch)]
                : []
              : selectedSegment === 'department'
                ? selectedDepartment
                  ? [Number(selectedDepartment)]
                  : []
                : [],
      }
      const response = await createEmployeeReportsMutateAsync(payload)
      setTableData(response.data.results)
      navigate({
        to: '/admin-dashboard/organization/reports',
        hash: 'generate-report',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const hasChanged = useMemo(() => {
    return (
      columnsFilter.length > 0 ||
      selectedDateCreated !== 'all' ||
      selectedSegment !== 'all' ||
      selectedEmployees.length > 0 ||
      selectedBranch !== null ||
      selectedDepartment !== null
    )
  }, [
    columnsFilter,
    selectedDateCreated,
    selectedSegment,
    selectedEmployees,
    selectedBranch,
    selectedDepartment,
  ])

  const resetFilters = () => {
    setColumnsFilter([])
    setDateRangeError('')
    setColumnsError('')
    setSelectedSegment('all')
    setSelectedEmployees([])
    setSelectedBranch(null)
    setSelectedDepartment(null)
    setCustomDateRange([null, null])
    setSelectedDateCreated('all')
  }

  const cards = reportsFilter.map((item, index) => (
    <TamsCheckboxCard
      value={item.value}
      description={item.description}
      label={item.label}
      key={index}
    />
  ))

  const dateCards = reportDateOptions.map((item, index) => (
    <TamsRadioCard item={item} key={index} />
  ))

  const reportScope = segmentedControlData.find(
    (item) => item.value === selectedSegment,
  )?.label

  const stats = useMemo((): TStatsCard[] => {
    return [
      {
        title:
          'Scope of Data' +
          ' ' +
          (selectedDateCreated === 'all'
            ? 'for All Dates'
            : selectedDateCreated === 'custom'
              ? 'for Custom Date Range'
              : selectedDateCreated === 'last_30_days'
                ? 'for Last 30 Days'
                : null),
        description: reportScope + ' data available in the report.',
        value: tableData.length.toString(),
        color: 'dark',
        icon: BuildingOfficeIcon,
      },
      {
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
  }, [tableData, columnsFilter, user, selectedDateCreated, reportScope])

  const newColumns = useMemo((): TamsTableColumn[] => {
    return columnsFilter.map((item) => {
      const obj = reportsFilter.find((i) => i.value === item)
      return {
        accessor: item,
        label: obj?.label as string,
      }
    })
  }, [columnsFilter, reportsFilter])

  const handleDownloadPdf = async () => {
    const blob = await generatePersonnelPdfBlob({
      records: tableData,
      columns: newColumns,
      dateFilter: selectedDateCreated as string,
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
      referenceNumber: `TAMS-RPT-${newDayjs().format('YYYYMMDDHH-mmss')}`,
      generatedAt: new Date(),
    })
    await downloadPdf(blob)
  }

  const options: TamsMenuItem[] = useMemo(() => {
    return [
      {
        type: 'item',
        label: 'Export as PDF',
        icon: FilePdfIcon,
        disabled: !tableData.length,
        onClick: handleDownloadPdf,
      },
      {
        type: 'item',
        label: 'Export as Excel',
        icon: FileXlsIcon,
        disabled: !tableData.length,
        onClick: () =>
          exportTableXLSX(
            newColumns,
            tableData,
            `workforce_record_stream at ${newDayjs().format('YYYY-MM-DD HH:mm:ss')}`,
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
            `workforce_record_stream at ${newDayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          ),
      },
    ]
  }, [newColumns, tableData])

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
              total={tableData.length}
              page={page}
              setPage={setPage}
              data={tableData?.slice((page - 1) * 10, page * 10)}
              columns={newColumns}
              filters={
                <div className="flex items-center w-full">
                  <Group>
                    <h2>Workforce Record Stream</h2>
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
              <h2 className="text-lg font-semibold">Data Columns</h2>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 p-2 mt-4 text-sm rounded-md">
              <Checkbox
                checked={columnsFilter.length === reportsFilter.length}
                onChange={(event) =>
                  setColumnsFilter(
                    event.currentTarget.checked
                      ? reportsFilter.map((item) => item.value)
                      : [],
                  )
                }
              />
              Select all Available Columns
              <Badge size="sm" variant="light" ml="auto">
                {columnsFilter.length} selected
              </Badge>
            </div>
            {columnsError && (
              <p className="text-sm text-red-500 mt-2">{columnsError}</p>
            )}
            <div>
              <Checkbox.Group value={columnsFilter} onChange={setColumnsFilter}>
                <Stack className="h-145 overflow-y-auto" pt="md" gap="xs">
                  {cards}
                </Stack>
              </Checkbox.Group>
            </div>
          </Paper>
          <section className="col-span-8 space-y-4">
            {' '}
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
                      onChange={setSelectedEmployees}
                      searchable
                      onSearchChange={setSearchEmployee}
                      searchValue={searchEmployee}
                      data={employees ?? []}
                    />
                  ) : selectedSegment === 'branch' ? (
                    <TamsSelectInput
                      value={selectedBranch}
                      onChange={setSelectedBranch}
                      label="Select Branch"
                      searchable
                      data={organizationBranches}
                    />
                  ) : selectedSegment === 'department' ? (
                    <div className="space-y-3">
                      <TamsSelectInput
                        value={selectedBranch}
                        onChange={setSelectedBranch}
                        label="Select Branch"
                        searchable
                        data={organizationBranches}
                      />
                      <TamsSelectInput
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        label="Select Department"
                        searchable
                        data={organizationDepartments ?? []}
                      />
                    </div>
                  ) : null}
                </section>
              </div>

              <Divider my="md" />
              {/* date created section */}
              <div>
                <p className="font-medium text-sm mb-1 text-gray-700">
                  Date Created
                </p>
                <Radio.Group
                  value={selectedDateCreated}
                  onChange={setSelectedDateCreated}
                >
                  <div className="flex gap-3">{dateCards}</div>
                </Radio.Group>
                <div className="mt-3">
                  {selectedDateCreated === 'custom_range' && (
                    <>
                      <TamsDatePickerInput
                        label="Select Date Range"
                        type="range"
                        value={customDateRange as DateValue | undefined}
                        onChange={(value) => {
                          setCustomDateRange(value)
                          setDateRangeError('')
                        }}
                      />
                      {dateRangeError && (
                        <p className="mt-1 text-sm text-red-600">
                          {dateRangeError}
                        </p>
                      )}
                    </>
                  )}
                </div>
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
                  disabled={!hasChanged}
                  onClick={resetFilters}
                  variant="default"
                  size="md"
                >
                  Reset Filters
                </TamsButton>
                <TamsButton
                  loading={isCreatingEmployeeReports}
                  size="md"
                  disabled={!hasChanged}
                  leftSection={<DownloadIcon />}
                  onClick={handleCreateEmployeeReports}
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

export default AllUserReports
