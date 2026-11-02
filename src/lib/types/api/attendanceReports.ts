import type { TGetApiResponse } from './request.types'

export type AttendanceReportType =
  | 'simple'
  | 'workforce'
  | 'lateness'
  | 'earlyIn'
  | 'absentee'
  | 'punctuality'
  | 'summary'
  | 'logs'
  | 'breaktime'
  | 'offday'
  | 'overtime_summary'
  | 'overtime'

export type AttendanceReportScope =
  'branch' | 'department' | 'team' | 'grade' | 'employee'

export type AttendanceReportParams = {
  type: AttendanceReportType
  fetch_by: AttendanceReportScope
  fetch_by_id: number[] | 'all'
  branch_id?: number[] | 'all'
  columns: string[]
  date_from: string
  date_to: string
  group_by: 'date' | 'employee'
  exclude_weekend: boolean
  exclude_public_holiday: boolean
  only_sunday: boolean
  hourly_view: boolean
  page: number
  per_page: number
}

export type AttendanceReportRecord = Record<string, unknown>
export type AttendanceReportData = {
  results: AttendanceReportRecord[]
  total: number
  warnings?: string[]
}
export type AttendanceReportResponse = TGetApiResponse<AttendanceReportData>

export type AttendanceReportColumn = { value: string; label: string }
export type AttendanceReportDefinition = {
  value: AttendanceReportType
  label: string
  description: string
  employeeOnly?: boolean
  columns: AttendanceReportColumn[]
}
