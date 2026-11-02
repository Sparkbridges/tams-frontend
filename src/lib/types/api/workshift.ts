export type ShiftDay = {
  day_id: number
  shift_type_id: number
  shift_type_name?: string
}
export type ShiftAssignment = {
  id: number
  type: 'company' | 'branch' | 'department' | 'team' | 'employee'
  type_id: number
  type_name: string
  branch_id?: number
}
export type Workshift = {
  id: number
  name: string
  station_id: number
  is_generic: boolean | number
  has_assignables?: boolean | number
  regular_shift_days: ShiftDay[]
  assignables: ShiftAssignment[]
}
export type WorkshiftPayload = {
  name: string
  branch_id: number | 'all'
  is_generic: boolean
  shift_days: { day_id: number; shift_type_id: number }[]
}
export type AssignWorkshiftPayload = {
  regular_shift_id: number
  assignables: Pick<ShiftAssignment, 'type' | 'type_id' | 'branch_id'>[]
}
export type ShiftType = {
  id?: number
  is_system?: boolean | number
  name: string
  day_span: number
  shift_start: string
  shift_end: string
  color_code: string
}
export type CalendarDay = {
  shift_type_id?: number
  shift_date_end?: string
  day_span?: number
  shift?: string
  shift_date_start: string
  shift_type_name?: string
  shift_start?: string
  shift_end?: string
  color_code?: string
}
export type CalendarParams = {
  employee_id: number
  date_start: string
  date_end: string
}
export type RosterParams = {
  fetch_by: 'company' | 'branch' | 'department' | 'employee'
  fetch_by_id: number[]
  branch_id?: number
  start_date: string
  end_date: string
}
export type RosterRow = {
  pin: number | null
  name: string
  roster: { shift: string; shift_date_start: string }[]
}
export type RosterResult = {
  results: RosterRow[]
  total: number
  rosterDates: { date: string; readable_date: string; is_past: boolean }[]
}
export type ClockWindow = {
  hours_before_start: number
  hours_after_start: number
}
export type ClockValue = { clock_in: ClockWindow; clock_out: ClockWindow }
export type ClockSetting = { default?: boolean; value: ClockValue }
