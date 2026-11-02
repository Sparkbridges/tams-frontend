import type {
  AttendanceReportColumn,
  AttendanceReportRecord,
  AttendanceReportType,
} from '#/lib/types/api/attendanceReports'

export function reportRecord(value: unknown): AttendanceReportRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid attendance report record')
  return value as AttendanceReportRecord
}

function employeeDetails(value: unknown): AttendanceReportRecord {
  if (value === undefined || value === null) return {}
  const details = reportRecord(value)
  const branch = details.branch ?? details.station_name
  const department = details.department ?? details.department_name
  return {
    ...details,
    ...(branch !== undefined && {
      branch:
        branch && typeof branch === 'object'
          ? reportRecord(branch).station_name
          : branch,
    }),
    ...(department !== undefined && {
      department:
        department && typeof department === 'object'
          ? reportRecord(department).department_name
          : department,
    }),
  }
}

export function flattenAttendanceReports(
  results: AttendanceReportRecord[],
  type: AttendanceReportType,
): AttendanceReportRecord[] {
  return results.flatMap((result) => {
    if (Array.isArray(result.employees)) {
      return result.employees.map((value) => {
        const row = reportRecord(value)
        const details = employeeDetails(row.employee_details)
        return { ...details, ...row, checkdate: row.checkdate ?? result.date }
      })
    }
    const details = employeeDetails(result.employee_details)
    const days = type === 'overtime' ? result.overtime_reports : result.days
    if (Array.isArray(days))
      return days.map((value) => ({ ...details, ...reportRecord(value) }))
    return [{ ...details, ...result }]
  })
}

export function reportCell(value: unknown): string | number {
  if (value === null || value === undefined || value === '')
    return 'Not available'
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return JSON.stringify(value)
}

export function attendanceExportRows(
  rows: AttendanceReportRecord[],
  columns: AttendanceReportColumn[],
) {
  return rows.map((row) =>
    Object.fromEntries(
      columns.map((column) => [column.label, reportCell(row[column.value])]),
    ),
  )
}
