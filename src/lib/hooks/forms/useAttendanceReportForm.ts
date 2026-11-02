import { useState } from 'react'
import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import type {
  AttendanceReportParams,
  AttendanceReportScope,
} from '#/lib/types/api/attendanceReports'
import { attendanceReportSchema } from '#/lib/utils/schema/attendanceReports.schema'
import {
  attendanceEmployeeColumns,
  attendanceOvertimeTotalColumns,
} from '#/lib/constants/attendanceReports'
import {
  useShiftDepartments,
  useShiftEmployeeSearch,
} from '#/lib/api/services/workshift'
import {
  useAttendanceReportAccess,
  useAttendanceReportTeams,
  useAttendanceReportGrades,
  useAttendanceReportBranches,
} from '#/lib/api/services/attendanceReports'

export default function useAttendanceReportForm({
  initial,
  onGenerate,
}: {
  initial?: AttendanceReportParams
  onGenerate: (params: AttendanceReportParams) => void
}) {
  const allowed = useAttendanceReportAccess()
  const form = useForm<AttendanceReportParams>({
    initialValues: initial ?? {
      type: allowed[0]?.value ?? 'simple',
      fetch_by: 'branch',
      fetch_by_id: 'all',
      branch_id: 'all',
      columns: ['pin', 'name'],
      date_from: dayjs().startOf('month').format('YYYY-MM-DD'),
      date_to: dayjs().format('YYYY-MM-DD'),
      group_by: 'employee',
      exclude_weekend: false,
      exclude_public_holiday: false,
      only_sunday: false,
      hourly_view: false,
      page: 1,
      per_page: 10,
    },
  })
  const [scope, setScope] = useState<AttendanceReportScope | 'all'>(
    initial?.fetch_by_id === 'all' || !initial ? 'all' : initial.fetch_by,
  )
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 300)
  const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState<
    { value: string; label: string }[]
  >([])
  const branches = useAttendanceReportBranches()
  const branchId = Array.isArray(form.values.branch_id)
    ? form.values.branch_id[0]
    : undefined
  const departments = useShiftDepartments(
    scope === 'department' ? (branchId ?? 0) : 0,
  )
  const employees = useShiftEmployeeSearch(
    scope === 'employee' ? debounced : '',
  )
  const teams = useAttendanceReportTeams(scope === 'team', debounced)
  const grades = useAttendanceReportGrades(scope === 'grade')
  const definition = allowed.find((report) => report.value === form.values.type)
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
    scope === 'branch'
      ? branchOptions
      : scope === 'department'
        ? (departments.data?.data.map((department) => ({
            value: String(department.id),
            label: department.department_name,
          })) ?? [])
        : scope === 'team'
          ? (teams.data
              ?.filter(
                (team) => team.is_generic || team.station_id === branchId,
              )
              .map((team) => ({
                value: String(team.id),
                label: team.team_name,
              })) ?? [])
          : scope === 'grade'
            ? (grades.data
                ?.filter(
                  (grade) =>
                    grade.station_id === null || grade.station_id === branchId,
                )
                .map((grade) => ({
                  value: String(grade.id),
                  label: grade.grade_name,
                })) ?? [])
            : [
                ...selectedEmployeeOptions.filter(
                  (option) =>
                    !foundEmployees.some(
                      (employee) => employee.value === option.value,
                    ),
                ),
                ...foundEmployees,
              ]
  const selectedIds = Array.isArray(form.values.fetch_by_id)
    ? form.values.fetch_by_id.map(String)
    : []
  const recipientOptions = [
    ...options,
    ...selectedIds
      .filter((id) => !options.some((option) => option.value === id))
      .map((id) => ({ value: id, label: `ID ${id}` })),
  ]
  const changeScope = (value: string) => {
    if (
      !['all', 'branch', 'department', 'team', 'grade', 'employee'].includes(
        value,
      )
    )
      return
    const next = value as AttendanceReportScope | 'all'
    setScope(next)
    setSearch('')
    form.setValues({
      fetch_by: next === 'all' ? 'branch' : next,
      fetch_by_id: next === 'all' ? 'all' : [],
      branch_id:
        next === 'employee' || next === 'all' || next === 'branch'
          ? 'all'
          : undefined,
    })
    form.clearErrors()
  }
  const changeType = (type: string | null) => {
    const next = allowed.find((report) => report.value === type)
    if (!next) return
    form.setValues({
      type: next.value,
      group_by: next.employeeOnly ? 'employee' : form.values.group_by,
      hourly_view: false,
    })
  }
  const handleGenerate = () => {
    const parsed = attendanceReportSchema.safeParse({
      ...form.getValues(),
      group_by: definition?.employeeOnly ? 'employee' : form.values.group_by,
      columns: Array.from(new Set(['pin', 'name', ...form.values.columns])),
      page: 1,
    })
    if (!parsed.success) {
      form.setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      )
      return
    }
    if (!allowed.some((report) => report.value === parsed.data.type)) {
      form.setFieldError(
        'type',
        'You do not have permission to generate this report',
      )
      return
    }
    form.clearErrors()
    onGenerate(parsed.data)
  }
  return {
    form,
    allowed,
    definition,
    scope,
    changeScope,
    changeType,
    search,
    setSearch,
    branchId,
    branchOptions,
    recipientOptions,
    selectedIds,
    selectRecipients: (ids: string[]) => {
      setSelectedEmployeeOptions(
        recipientOptions.filter((option) => ids.includes(option.value)),
      )
      form.setFieldValue('fetch_by_id', ids.map(Number))
    },
    queries: [branches, departments, employees, teams, grades],
    employeeColumns: attendanceEmployeeColumns,
    metricColumns:
      form.values.type === 'overtime' && form.values.hourly_view
        ? attendanceOvertimeTotalColumns
        : (definition?.columns ?? []),
    handleGenerate,
    reset: () => {
      form.reset()
      setScope(
        initial?.fetch_by_id === 'all' || !initial ? 'all' : initial.fetch_by,
      )
      setSearch('')
    },
  }
}
