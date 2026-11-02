import type { CalendarDay } from './workshift'

export type SchedulerEmployee = {
  employee_id: number
  pin: number | null
  name: string
  shift_days: CalendarDay[]
}
export type SchedulerParams = {
  page: number
  perPage: number
  fetch_by: 'company' | 'branch' | 'employee'
  fetch_by_id?: number[]
  start_date: string
  end_date: string
}
export type ScheduleAssignment = {
  employee_id: number
  shift_type_id: number
  shift_date_start: string
}
export type SaveSchedulesPayload = {
  schedules: ScheduleAssignment[]
  on_conflict: 'skip' | 'replace'
}
