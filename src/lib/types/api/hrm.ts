import type {
  TBaseQueryParams,
  TGetApiResponse,
  TPostApiResponse,
} from './request.types'

export type TFetchHrmExemptionsParams = TBaseQueryParams & {
  status?: string
  start_date?: string
  end_date?: string
}

export type TFetchHrmExemptionsData = {
  id: number
  reason: string
  exemption_type: string
  employee_id: number
  approval_status: string
  exemption_date: string[]
  approval_note: null
  created_at: string
  updated_at: string
  company_id: number
  station_id: number
  exemption_approval_status: number
  rejection_reason: string | null
  employee_name: string
  exemptionsdate: {
    id: number
    exemption_date: string
  }[]
}
export type TFetchHrmExemptionsResponse = TGetApiResponse<{
  results: TFetchHrmExemptionsData[]
  total: number
}>

export type TFetchHrmExemptionByIdData = {
  id: number
  reason: string
  exemption_type: string
  employee_id: number
  approval_status: string
  exemption_date: string[]
  approval_note: string | null
  created_at: string
  updated_at: string
  company_id: number
  station_id: number
  exemption_approval_status: number
  rejection_reason: string | null
  exemptionsdate: {
    id: number
    exemption_date: string
  }[]
  employees: {
    id: number
    employee_name: string
  }[]
}

export type TFetchHrmExemptionByIdResponse =
  TGetApiResponse<TFetchHrmExemptionByIdData>

export type TCreateHrmExemptionResponse = TPostApiResponse<{
  reason: string
  exemption_type: string
  employee_id: number
  company_id: number
  station_id: number
  exemption_date: string[]
  created_at: string
  updated_at: string
  id: number
}>

export type TCanApproveHrmExemptionResponse = TGetApiResponse<boolean>

export type TApproveHrmExemptionPayload = {
  exemption_request_ids: number[]
}

export type TFetchHrmLeavesData = {
  id: number
  leave_id: number
  start_date: string
  end_date: string
  number_of_days: number
  handover_to: number
  employee_id: number
  status: string
  approved_count: number
  created_at: string
  updated_at: string
  company_id: number
  station_id: number
  leave_request_data: string
  note: string
  rejection_reason: string | null
  employee_name: string
  relief: string
  leave_type_name: string
}

export type TFetchHrmLeavesResponse = TGetApiResponse<{
  results: TFetchHrmLeavesData[]
  total: number
}>

export type TFetchHrmLeavesParams = TBaseQueryParams & {
  status?: string
  start_date?: string
  end_date?: string
  leave_type_id?: number
}

export type TFetchHrmLeavesTypesData = {
  id: number
  leaves: {
    id: number
    leave: string
    status: string
  }[]
  leave_name: string
  period_type: string
  weekend: string
  applicable_days: number
  note: string | null
  is_vacation: number
  company_id: number
  created_at: string
  updated_at: string
  station_id: number
  month_limit_before_deduction: number
  approval_type: string | null
  category_type: string
  no_approvals: number
  requires_approval: number
  is_generic: number
  is_active: number
  category_station_id: number | null
  gender: string | null
  is_paid: number
  branch: {
    id: number
    station_name: string
  }
  employeeGrades: {
    id: number
    grade_name: string
  }[]
  departments: {
    id: number
    department_name: string
  }[]
  employees: {
    id: number
    employee_name: string
  }[]
}

export type TFetchHrmLeavesTypesResponse = TGetApiResponse<{
  results: TFetchHrmLeavesTypesData[]
  total: number
}>

export type TFetchHrmLeaveByIdResponse = TGetApiResponse<TFetchHrmLeavesData>

export type TDeleteLeavesPayload = {
  leave_ids: number[]
}

export type TFetchLeaveTypesByEmployeeIdData = {
  id: number
  leave_name: string
  period_type: string
  weekend: string
  applicable_days: number
  note: string
  is_vacation: number
  company_id: number
  created_at: string
  updated_at: string
  station_id: number
  month_limit_before_deduction: number
  approval_type: null
  category_type: string
  no_approvals: number
  requires_approval: number
  is_generic: number
  category_station_id: null
  gender: null
  is_paid: number
}

export type TFetchLeaveTypesByEmployeeIdResponse = TGetApiResponse<
  TFetchLeaveTypesByEmployeeIdData[]
>

export type TTCreateHrmLeavePayload = {
  employee_id: number
  leave_type_id: number
  start_date: string
  end_date: string
  handover_to: number
  note?: string | undefined
}

export type TTEditHrmLeavePayload = TTCreateHrmLeavePayload & {
  id: number
}

type TCreateHrmLeaveResponseData = {
  employee_id: number
  leave_id: number
  start_date: string
  end_date: string
  number_of_days: number
  status: string
  approved_count: number
  company_id: number
  station_id: number
  note: string
  handover_to: number
  leave_request_data: string
  created_at: string
  updated_at: string
  id: number
}

export type TCreateHrmLeaveResponse =
  TPostApiResponse<TCreateHrmLeaveResponseData>

export type TGenerateHrmReportsParams = {
  fetch_by: string
  fetch_by_id: number[]
  columns?: string[]
  start_date?: string
  end_date?: string
  page: number
  perPage: number
  year?: string
  group_by?: 'leave_type' | 'employee'
  leave_type_id?: number
}

export type TGenerateHrmReportsResponse = TGetApiResponse<{
  results: {
    pin: number
    gender: string | null
    email: string
    name: string
    employee_id: number
    exemption_count: number
  }[]
  total: number
}>

// for leave type; group employee

export type TFetchHrmLeaveReportsGroupByEmployeeData = {
  reports: {
    id: number
    name: string
    entitled_leaves: {
      id: number
      leave_type: string
      entitlement: number
      company_id: number
      employee_id: number
      pending_approval: number
      scheduled: number
      taken: number
      balance: number
    }[]
  }[]
  total: number
}

// for leave type; group leave
export type TFetchHrmLeaveReportsGroupByLeaveData = {
  total: number
  leave_type_name: string
  results: {
    employee_id: number
    company_id: number
    pin: number
    gender: string | null
    name: string
    station_id: number
    department_id: number
    employee_grade_id: number
    id: number
    leave_type_id: number
    leave_type: string
    entitlement: number
    pending_approval: number
    scheduled: number
    taken: number
    balance: number
  }[]
}

export type TFetchHrmLeaveReportsResponse = TGetApiResponse<
  | TFetchHrmLeaveReportsGroupByLeaveData
  | TFetchHrmLeaveReportsGroupByEmployeeData
>

export type TUpdateHrmLeaveTypeStatusPayload = {
  id: number
  is_active: boolean
}

export type TReassignPendingLeavesPayload = {
  leave_ids?: number[]
  source_leave_type_id: number
  target_leave_type_id: number
}

export type TFetchHrmLeaveTypeByIdResponse = TGetApiResponse<{
  id: number
  leave_name: string
  period_type: string
  weekend: string
  applicable_days: number
  note: string
  is_vacation: number
  company_id: number
  created_at: string
  updated_at: string
  station_id: number
  month_limit_before_deduction: 0
  approval_type: null
  category_type: string
  no_approvals: number
  requires_approval: number
  is_generic: number
  category_station_id: number
  gender: string | null
  is_paid: number
  exclude_public_holidays: number
  departments: number[]
  employees: number[]
  branch: {
    id: number
    station_name: string
  }
  employeeGrades: number[]
}>

export type TFetchHrmLeaveApproversData = {
  id: number
  description: string
  approval_types: string
  no_approvals: number
  station_category_id: number
  company_id: number
  station_id: number
  created_at: string
  updated_at: string
  category_type: string
  departments: []
  employees: {
    id: number
    employee_name: string
  }[]
  branches: []
  employeeGrades: []
  branch: {
    id: number
    station_name: string
  }
  approvalLevels: {
    id: number
    approval_person_id: number
    company_id: number
    station_id: number
    approval_person_name: string
    approval_person_email: string
    approval_levelable_id: string
    alt_approval_person_id: number | null
    alt_approval_person: string
  }[]
}

export type TFetchHrmLeaveApproversResponse = TGetApiResponse<{
  total: number
  results: TFetchHrmLeaveApproversData[]
}>

export type TFetchHrmLeaveApproversByIdData = {
  id: number
  description: string
  approval_types: string
  no_approvals: number
  station_category_id: number
  company_id: number
  station_id: number
  created_at: string
  updated_at: string
  category_type: string
  departments: {
    id: number
    department_name: string
  }[]
  employeeGrades: {
    id: number
    grade_name: string
  }[]
  employees: {
    id: number
    employee_name: string
  }[]
  branches: {
    id: number
    station_name: string
  }[]
  branch: {
    id: number
    station_name: string
  }
  approvalLevels: {
    id: number
    approval_person_id: number
    company_id: number
    station_id: number
    approval_person_name: string
    approval_person_email: string
    approval_levelable_id: string
    alt_approval_person_id: number | null
    alt_approval_person: string
  }[]
}

export type TFetchHrmLeaveApproversByIdResponse =
  TGetApiResponse<TFetchHrmLeaveApproversByIdData>

export type TFetchHrmExemptionSettingsApprovals = {
  id: number
  name: string
  approval_types: string
  no_approvals: number
  company_id: number
  station_id: number
  created_at: string
  updated_at: string
  category_type: string
  category_station_id: string
}

export type TFetchHrmExemptionsApprovalsResponse = TGetApiResponse<{
  results: TFetchHrmExemptionSettingsApprovals[]
  total: number
}>

export type TFetchHrmExemptionsApprovalByIdData = {
  id: number
  name: string
  approval_types: string
  no_approvals: number
  company_id: number
  station_id: number
  created_at: string
  updated_at: string
  category_type: string
  category_station_id: string
  station_name: null
  employees: {
    id: number
    employee_name: string
  }[]
  approvalLevels: {
    approval_person_id: number
    alt_approval_person: string
    approval_person_name: string
    approval_person_email: string
    approval_levelable_id: string
    alt_approval_person_id: number | null
  }[]
  departments: {
    id: number
    department_name: string
  }[]
  employeeGrades: {
    id: number
    grade_name: string
  }[]
  branches: {
    id: number
    station_name: string
  }[]
}

export type TFetchHrmExemptionsApprovalByIdResponse =
  TGetApiResponse<TFetchHrmExemptionsApprovalByIdData>
