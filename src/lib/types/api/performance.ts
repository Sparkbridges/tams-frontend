import type {
  TBaseQueryParams,
  TGetApiResponse,
  TPostApiResponse,
} from './request.types'

export type TAppraisalPeriod = {
  id: number
  company_id: number
  appraisal_settings_id: number
  name: string
  start_month: number
  end_month: number
  created_at: string
  updated_at: string
}

export type TPerformanceAppraisalGeneralSettings = {
  id: number
  company_id: number
  num_appraisals_per_year: number
  created_at: string
  updated_at: string
  appraisalPeriods: TAppraisalPeriod[]
}

export type TFetchPerformanceAppraisalGeneralSettingsResponse = TGetApiResponse<
  TPerformanceAppraisalGeneralSettings[]
>

export type TUpdatePerformanceAppraisalGeneralSettingsPayload = {
  appraisals: {
    start_month: number
    end_month: number
    id?: number
    name: string
  }[]
  id: number
}

export type TPerformanceAppraisalGradingSettings = {
  id: number
  company_id: number
  label: string
  description: string | null
  min_score: number
  max_score: number
  created_at: string
  updated_at: string
}

export type TFetchPerformanceAppraisalGradingSettingsResponse = TGetApiResponse<
  TPerformanceAppraisalGradingSettings[]
>

export type TUpdatePerformanceAppraisalGradingSettingsPayload = {
  grades: { id?: number; label: string; max_score: number; min_score: number }[]
}

export type TPerformanceAppraiserSetting = {
  id: number
  description: string
  approval_types: string
  no_approvals: number
  company_id: number
  station_id: number
  category_type: AppraisalAssignmentCategory
  station_category_id: number
  created_at: string
  updated_at: string
  employeeGrades: { employee_grade_id: number; grade_name: string }[]
  employees: {
    employee_id: number
    employee_name: string
  }[]
  approvalLevels: {
    id: number
    approval_person_id: number
    level: number
    company_id: number
    station_id: number
    approval_person_name: string
    approval_person_email: string
    approval_levelable_id: string
    alt_approval_person_id: number
    alt_approval_person: string
  }[]
  branches: { station_id: number; station_name: string }[]
  departments: { id: number; department_name: string }[]
  branch: {
    station_id: number
    station_name: string
  }
}

export type TFetchPerformanceAppraiserSettingsResponse = TGetApiResponse<{
  results: TPerformanceAppraiserSetting[]
  total: number
}>

export type AppraisalPeopleKind = 'appraiser' | 'approver'
export type AppraisalAssignmentCategory =
  'employees' | 'department' | 'station_grade' | 'branch'
export type AppraisalPersonType = 'static' | 'dynamic'
export type AppraisalApprovalType = 'sequential' | 'concurrent'

export type TPerformanceApproverSetting = {
  id: number
  name: string
  description: string | null
  approval_type: AppraisalApprovalType
  no_approvers: number
  station_id: number
  created_at: string
  updated_at: string
  approver_persons?: {
    level: number
    approver_person_id: number
    approver_person_type: AppraisalPersonType
    alt_approver_person_id?: number
    alt_approver_person_type?: AppraisalPersonType
    approver_person_name?: string
    alt_approver_person_name?: string
  }[]
}

export type TFetchPerformanceApproverSettingsResponse = TGetApiResponse<{
  results: TPerformanceApproverSetting[]
  total: number
}>

export type TAppraisalPeopleSetting = {
  id: number
  name: string
  description: string
  approvalType: AppraisalApprovalType
  category: AppraisalAssignmentCategory
  branchId: number
  assignments: { value: string; label: string }[]
  createdAt: string
  updatedAt: string
  persons: {
    level: number
    personId: number
    personType: AppraisalPersonType
    alternateId?: number
    alternateType?: AppraisalPersonType
    name: string
    alternateName: string
  }[]
}

export type TSaveAppraisalPeopleSettingPayload =
  | {
      kind: 'appraiser'
      id?: number
      data: {
        description: string
        approval_types: 'Sequential'
        no_approvals: number
        category_type: AppraisalAssignmentCategory
        branch_id?: number
        employees?: number[]
        departments?: number[]
        grades?: number[]
        branches?: number[]
        appraiser_details: {
          appraiser_person_id: number
          alt_appraiser_person_id?: number
        }[]
      }
    }
  | {
      kind: 'approver'
      id?: number
      data: {
        name: string
        description: string
        approval_type: AppraisalApprovalType
        approver_persons: {
          approver_person_id: number
          approver_person_type: AppraisalPersonType
          alt_approver_person_id?: number
          alt_approver_person_type?: AppraisalPersonType
        }[]
      }
    }

export type TPerformanceTraining = {
  id: number
  company_id: number
  station_id: number
  created_by_id: number
  title: string
  duration: string | null
  duration_days: number | null
  type: string
  description: string
  file_url: string
  is_generic: number
  status: string
  approved_by_id: number
  approved_at: string
  deleted_at: string | null
  created_at: string
  updated_at: string
  assignment_category: string
  assignment_ids: number[]
  assignments: {
    id: number
    company_id: number
    training_id: number
    employee_id: number
    status: string
    score: number | null
    completed_at: string
    created_at: string
    updated_at: string
    employee: {
      id: number
      first_name: string
      last_name: string
      department_id: number
      employee_grade_id: number
    }
  }[]
}

export type TFetchPerformanceTrainingsResponse = TGetApiResponse<{
  results: TPerformanceTraining[]
  total: number
}>

export type TPerformanceTrainingParams = TBaseQueryParams & {
  type?: string
  status?: string
}

export type TFetchPerformanceTrainingByIdResponse =
  TGetApiResponse<TPerformanceTraining>

export type TCreatePerformanceTrainingResponse = TPostApiResponse<{
  company_id: number
  station_id: number
  created_by_id: number
  title: string
  duration: string | null
  duration_days: number | null
  type: string
  description: string
  file_url: string
  is_generic: boolean
  assignment_category: string
  assignment_ids: number[]
  status: string
  created_at: string
  updated_at: string
  id: number
}>

export type TCreateHrmProjectResponse = TPostApiResponse<{
  id: number
  company_id: number
  station_id: number
  created_by_id: number
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
}>

export type TCreatePerformanceTaskProjectParams = TBaseQueryParams & {
  team_id?: number
  search_query?: string
  status?: 'pending' | 'active' | 'abandoned' | 'completed'
  is_archived?: boolean
  sort?: 'recently_updated' | 'due_date' | 'highest_completion' | 'priority'
}

export type TFetchPerformanceTaskProject = {
  branch_id: number | null
  id: number
  name: string
  description: string
  date_from: string
  date_to: string
  status: TUpdateProjectStatus
  created_by_id: number
  company_id: number
  created_at: string
  updated_at: string
  priority: number
  is_archived: boolean
  task_count: number
  subtask_count: number
  completed_tasks: number
  in_progress_tasks: number
  in_review_tasks: number
  todo_tasks: number
  backlog_tasks: number
  overdue_tasks: number
  completion_percentage: number
  created_by: {
    id: number
    pin: number
    fullname: string
  }
  teams: {
    id: number
    team_name: string
  }[]
  members: {
    id: number
    project_id: number
    employee_id: number
    company_id: number
    created_at: string
    updated_at: string
    employee: {
      id: number
      pin: number
      fullname: string
      branch: string
      team: string
    }
  }[]
}

export type TFetchPerformanceTaskProjectByIdResponse =
  TGetApiResponse<TFetchPerformanceTaskProject>

export type TFetchPerformanceTaskProjectsResponse = TGetApiResponse<{
  results: TFetchPerformanceTaskProject[]
  total: number
}>

export type TUpdateProjectStatus =
  'pending' | 'active' | 'abandoned' | 'completed'

export type TUpdateProjectStatusPayload = {
  is_archived?: boolean
  status?: TUpdateProjectStatus
  id: number
}

export type TFetchProjectKanbanTasksParams = {
  project_id: number
}

export type TProjectKanbanTask = {
  id: number
  title: string
  status_id: number
}

export type TMoveProjectKanbanTaskPayload = {
  project_id: number
  task_id: number
  status_id: number
}

export type TFetchProjectKanbanTasks = {
  id: number
  name: string
  project_id: number
  created_at: string
  updated_at: string
  system_key: string | null
  sort_order: number
  tasks: TProjectKanbanTask[]
}

export type TFetchProjectKanbanTasksResponse = TGetApiResponse<
  TFetchProjectKanbanTasks[]
>

export type TFetchProjectKanbanStatuses = {
  id: number
  name: string
  project_id: number
  created_at: string
  updated_at: string
  system_key: string
  sort_order: number
}

export type TFetchProjectKanbanStatusesResponse = TGetApiResponse<
  TFetchProjectKanbanStatuses[]
>

export enum KanbanIssueTypes {
  fix = 'fix',
  task = 'task',
}

export enum KanbanTaskPriority {
  high = 'high',
  medium = 'medium',
  low = 'low',
}

export type TCreateProjectKanbanTaskResponse = TPostApiResponse<any>

export type TCreateTasksByProjectIdResponse = TGetApiResponse<
  {
    id: number
    title: string
    description: string
    project_id: number
    priority: KanbanTaskPriority
    file_url: string | null
    issue_type: KanbanIssueTypes
    status_id: number
    start_date: string | null
    due_date: string | null
    created_by_id: number
    company_id: number
    created_at: string
    updated_at: string
    parent_task_id: number | null
  }[]
>
