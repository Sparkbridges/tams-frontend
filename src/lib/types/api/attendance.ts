import type { TBaseQueryParams, TGetApiResponse } from './request.types'

export type AttendanceDevice = {
  id: number
  alias: string
  serial_no: string
  station_id: number
  device_type_id: number
  device_type?: string
  timezone: string | number
  state?: number
  last_activity?: string | null
  user_count?: number
  is_active?: boolean | number
}

export type TGetAttendanceDeviceResponse = TGetApiResponse<{
  results: AttendanceDevice[]
  total: number
}>

export type TGetAttendanceDeviceByIdResponse = TGetApiResponse<AttendanceDevice>

export type AttendanceDeviceTypeResponse = TGetApiResponse<
  { id: number; name: string }[]
>

export type AttendanceDevicePayload = {
  branch_id: number
  device_type_id: number
  alias: string
  serial_no: string
  timezone: string
}
export type CreateAttendanceDevicePayload = AttendanceDevicePayload & {
  license: string
}
export type AttendanceDeviceParams = TBaseQueryParams & {
  state?: 'online' | 'offline'
}
export type AttendanceDeviceUser = {
  employee_id: number
  name: string
  pin: number | string
  department?: string | null
  device_name: string
  serial_no: string
  privilege: string
  fp_count: number
}
export type AttendanceDeviceUserResponse = TGetApiResponse<{
  results: AttendanceDeviceUser[]
  total: number
}>

export type AttendanceDeviceUserParams = {
  device_id?: number
  search_query?: string
  per_page: number
  page: number
}
export type AttendanceDeviceTransaction = {
  id: number
  command_type: string
  created_at: string
  total?: number
  pending?: number
  executed?: number
  successful?: number
  failed?: number
}

export type AttendanceDeviceTransactionResponse = TGetApiResponse<{
  results: AttendanceDeviceTransaction[]
  total: number
}>

export type AttendanceDeviceTransactionDetailResponse = TGetApiResponse<{
  id: number
  command_type: string
  company_id: number
  station_id: number
  created_at: string
  updated_at: string
}>

export type AttendanceDeviceCommandLog = {
  id: number
  serial_no: string
  status: string
  cmd_content?: string | null
  cmd_commit_time?: string | null
}

export type AttendanceDeviceCommandLogResponse = TGetApiResponse<{
  results: AttendanceDeviceCommandLog[]
  total: number
}>
export type AttendanceUserTransferPayload = {
  employees: number[]
  devices: string[]
  command_type: 'USER_FP_TRANSFER' | 'MOVE_USER' | 'USER_TRANSFER'
  access?: 'supervisor' | 'admin'
}
export type AttendanceBulkTransferPayload = {
  device_from: string
  devices_to: string[]
}
