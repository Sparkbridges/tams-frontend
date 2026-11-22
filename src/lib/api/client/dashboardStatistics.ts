import { Client } from '#/lib/config'
import type { TGetApiResponse } from '#/lib/types/api/request.types'

type Count = number | string
export type HrmStatistics = {
  entities_count: {
    employees_count: {
      total_employees: Count
      number_of_active_employees: Count
      number_of_inactive_employees: Count
    }
    exemption_requests_count: Count
    leave_requests: {
      num_leave_requests: Count
      num_leave_requests_taken: Count
      num_leave_requests_pending: Count
      num_leave_requests_scheduled: Count
    }
    entry_exits: { entry: Count; exits: Count }
  }
  gender_distribution: { male: Count; female: Count; others: Count }
  employee_retention: { entry: Count; total_employees: Count }
  employee_turnover: { exits: Count; total_employees: Count }
  joinee_vs_resignee: {
    month: string
    no_joinees: Count
    no_resignees: Count
  }[]
}

export type AttendanceStatistics = {
  entities_count: {
    present_employees: Count
    absent_employees: Count
    early_in_employees: Count
    late_employees: Count
    total_employees: Count
    number_of_active_employees: Count
    number_of_inactive_employees: Count
    devices_activity: { total: Count; online: Count; offline: Count }
  }
  attendance_distribution: Record<string, Count>
  early_rate: { rate: Count; number_of_active_employees: Count }
  absentee_rate: { rate: Count; number_of_active_employees: Count }
  average_absenteism: { short_month: string; rate: Count }[]
}

export type DashboardParams = {
  branch_id: string
  department_id?: string
  year?: number
  date?: string
}

export const dashboardStatisticsClient = {
  hrm: <T extends keyof HrmStatistics>(type: T, params: DashboardParams) =>
    Client.get<TGetApiResponse<HrmStatistics[T]>>(`/hrm/dashboard/${type}`, {
      params,
    }),
  attendance: <T extends keyof AttendanceStatistics>(
    type: T,
    params: DashboardParams,
  ) =>
    Client.get<TGetApiResponse<AttendanceStatistics[T]>>(
      '/attendance/dashboard',
      { params: { ...params, type } },
    ),
}
