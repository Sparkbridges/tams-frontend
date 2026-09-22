import type { TGetApiResponse } from './request.types'

export type TRecentActivityHistories = {
  id: number
  description: string
  causer_details: {
    id: number
    company_id: number
    name: string
    email: string
    roles: string[]
    ip_address: string
    host: string
    user_agent: string
  }
  readable_time: string
  readable_date: string
}

export type TPresentEmployee = {
  employee_details: {
    name: string
    pin: number
    employee_id: number
  }
  pin: number
  checkdate: string
  clockin: string
  clockout: string
  clockin_readable: string
  clockout_readable: string
  hours_worked: string
}

export type TFetchEmployeeHomeDetails = {
  work_anniversaries: []
  birthdays: []
  new_joiners: []
  employee_exits: []
  employees_count: {
    active: number
    inactive: number
    total: number
  }
  employees_on_leave: {
    results: []
    total: 0
  }
  recent_activity_histories: TRecentActivityHistories[]
  absent_employees: []
  present_employees: TPresentEmployee[]
  next_public_holiday: null
  readable_date: string
  day: string
}
export type TFetchEmployeeHomeDetailsResponse =
  TGetApiResponse<TFetchEmployeeHomeDetails>

export type TFetchAttendanceDashboardPunctualityParams = {
  page: number
  per_page: number
  type: 'present' | 'absent'
  branch_id: string
  date: string
}
