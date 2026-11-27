import { KanbanIssueTypes, KanbanTaskPriority } from '../types/api/performance'

export const loginFormInitials = {
  company_id: '',
  email: '',
  password: '',
}

export const createBranchInitials = {
  branch_name: '',
  branch_type_id: 0,
  parent_branch_id: 0,
  address: '',
  branch_alt_phone_no: '',
  branch_head_id: 0,
  branch_phone_no: '',
  city: '',
  country: '',
  description: '',
  state: '',
  search_branch_head: '',
}
export const createDepartmentInitials = {
  branch_id: 0,
  department_head_id: 0,
  department_name: '',
  is_generic: 1,
  notes: '',
  parent_department_id: 0,
  search_branch_head: '',
}

export const createTeamInitials = {
  branch_id: 0,
  description: '',
  team_head_id: 0,
  team_members: [] as string[],
  team_name: '',
  search_branch_head: '',
}

export const createEmployeeInitials = {
  first_name: '',
  last_name: '',
  email: '',
  gender: '',
  date_of_birth: null as unknown as Date,
  login_access: true,
  blood_group: '',
  nationality: '',
  religion: '',
  marital_status: '',
  employee_type_id: null,
  pin: null,
  employee_category_id: null,
  employee_designation_id: null,
  employee_grade_id: null,
  branch_id: null as unknown as number,
  department_id: null as unknown as number,
  custom_employee_id: '',
  state: '',
  local_government: '',
  genotype: '',
  mobile_number: '',
  next_of_kin: '',
  last_employment_date: null as unknown as Date,
  last_employer: '',
  guarantor_name: '',
  guarantor_phone_number: '',
  last_qualification: '',
  appointment_date: null as unknown as Date,
  qualification_date: null as unknown as Date,
  account_name: '',
  account_number: '',
  bank_code: '',
  account_type: '',
  country: '',
  city: '',
  salutation: '',
  address: '',
  picture: undefined as unknown as File | string | undefined,
  bank_id: 0,
  roles: [] as number[],
  pension_fund_administrator: '',
  rsa_pin: '',
  tax_id: '',
  tax_location: '',
  staff_id: '',
  alt_mobile_number: '',
  means_of_identity: '',
  id_no: '',
  id_expiration: null as unknown as Date,
  emergency_contact_name: '',
  emergency_contact_rel: '',
  emergency_contact_no: '',
  emergency_contact_address: '',
}

export const editEmployeeInitials = {
  ...createEmployeeInitials,
  id: 0,
  picture: undefined as unknown as File | string | undefined,
}

export const editCompanyInitials = {
  company_name: '',
  legal_name: null,
  slug: '',
  company_logo: '',
  contact_person_name: '',
  contact_person_designation: null,
  company_phone_no: '',
  company_alt_phone_no: '',
  email: '',
  website: '',
  address: '',
  city: 0,
  state: 0,
  zip_code: null,
  country: 160,
  additional_info: null,
  currency_sign: '₦',
}

export const createPublicHolidaysSettingsInitials = {
  national_public_holiday_ids: 0,
  is_recurring: false,
  send_email_notification: true,
  name: '',
  date: null as unknown as Date,
  holiday_type: '',
}

export const editPublicHolidaysSettingsInitials = {
  ...createPublicHolidaysSettingsInitials,
  id: 0,
}

export const createHrmExemptionInitials = {
  employee_id: 1,
  employee_search: '',
  exemption_type: '' as string,
  exemption_date: [] as Date[],
  reason: '',
  branch_id: null as unknown as number,
}

export const editHrmExemptionInitials = {
  ...createHrmExemptionInitials,
  id: 0,
}

export const createHrmLeavesInitials = {
  employee_id: 0,
  employee_search: '',
  handover_search: '',
  date_range: [] as Date[],
  handover_to: 0,
  leave_type_id: 0,
  note: '',
}

export const editHrmLeavesInitials = {
  ...createHrmLeavesInitials,
  id: 0,
}

export const createHrmLeaveTypeInitials = {
  leave_name: '',
  period_type: 'Day' as string,
  weekend: [] as string[],
  exclude_public_holidays: false,
  applicable_days: 0,
  note: '',
  is_generic: 1,
  is_paid: true,
  gender: 'male' as string,
  isGenderBased: false, // not included
  isApplicableToAllBranches: true,
  departments: [] as number[],
  grades: [] as number[],
  employees: [] as number[],
  category_type: 'all_users',
  branch_id: null as unknown as number,
  employee_query: '',
}

export const editHrmLeaveTypeInitials = {
  ...createHrmLeaveTypeInitials,
  id: 0,
}

export const createHrmLeaveApproverInitials = {
  description: '',
  approval_types: '',
  category_type: '' as any,
  employees: [] as number[],
  branch_id: null,
  no_approvals: 0,
  departments: [] as number[],
  grades: [] as number[],
  employee_query: '',
  branches: [] as number[],
}

export const editHrmLeaveApproverInitials = {
  ...createHrmLeaveApproverInitials,
  id: 0,
}

export const createEditHrmExemptionApproverInitials = {
  name: '',
  approval_types: '',
  category_type: '' as any,
  employees: [] as number[],
  category_branch_id: 0,
  no_approvals: 0,
  departments: [] as number[],
  grades: [] as number[],
  employee_query: '',
  branches: [] as number[],
  id: 0,
}

export const inviteEmployeeInitials = {
  branch_id: 0,
  department_id: 0,
  employee_type_id: 0,
  employee_designation_id: 0,
  employee_grade_id: 0,
  employee_category_id: 0,
  first_name: '',
  last_name: '',
  email: '',
  roles: [],
  pin: 0,
}

export const createPerformanceTrainingInitials = {
  title: '',
  duration_days: 0,
  type: '',
  description: '',
  file_url: '',
  is_generic: true,
  branch_id: null,
  assignment_category: '',
  assignment_ids: [],
  search_employee: undefined,
}

export const editPerformanceTrainingInitials = {
  ...createPerformanceTrainingInitials,
  id: 0,
}

export const createFeedbackSurveyInitials = {
  name: '',
  description: '',
  allow_participants_view_answers: false,
  assign_to_category: 'employees',
  assign_to_ids: [] as string[],
  apply_to_category: 'employees',
  apply_to_ids: [] as string[],
  assign_search: '',
  apply_search: '',
  survey_questions: [
    {
      question: '',
      required: true,
      type: 'text' as const,
      type_value: undefined as string[] | undefined,
    },
  ],
}

export const editFeedbackSurveyInitials = {
  ...createFeedbackSurveyInitials,
  id: 0,
}

export const createAppraisalGroupInitials = {
  id: 0,
  name: '',
  description: '',
  appraisal_period_id: null as number | null,
  appraiser_settings_id: null as number | null,
  approver_settings_id: null as number | null,
  appraisal_year: new Date().getFullYear(),
  apply_grade_settings: true,
  is_active: true,
  performance_areas: [
    {
      name: '',
      weight: 100,
      description: '',
      kpi_categories: [
        {
          name: '',
          weight: 100,
          description: '',
          kpi_sub_categories: [],
        },
      ],
    },
  ],
}

export const createPerformanceTaskManagementProjectInitials = {
  name: '',
  description: '',
  team_ids: [] as number[],
  status: 'pending',
  priority: 3,
  date_from: null as unknown as Date,
  date_to: null as unknown as Date,
  branch_id: 0,
}

export const editPerformanceTaskManagementProjectInitials = {
  ...createPerformanceTaskManagementProjectInitials,
  id: 0,
}

export const createKanbanTaskInitials = {
  project_id: 0,
  title: '',
  description: '',
  priority: KanbanTaskPriority.medium,
  issue_type: KanbanIssueTypes.task,
  actors: [] as number[],
  parent_task_id: undefined,
  is_sub_task: false,
  status_id: 1,
  start_date: null as unknown as Date,
  due_date: null as unknown as Date,
}
export const editKanbanTaskInitials = {
  ...createKanbanTaskInitials,
  id: 0,
}

export const createTalentRequisitionInitials = {
  department_id: 0,
  role: '',
  salary_range: '',
  work_mode: '',
  type: '',
  reason: '',
  description: '',
  branch_id: 0,
  salary_min: undefined as unknown as number,
  salary_max: undefined as unknown as number,
}

export const editTalentRequisitionInitials = {
  ...createTalentRequisitionInitials,
  id: 0,
}

export const createJobPostingInitials = {
  role: '',
  job_request_id: undefined as unknown as number,
  work_mode: '',
  type: '',
  description: '',
  job_location_country_id: undefined as unknown as number,
  job_location_state_id: undefined as unknown as number,
  custom_fields: '',
  required_documents: [{ name: '', size: 0, required: true, data: '' }],
  files: [] as File[],
}

// '[{"question":"loo","answer_type":"dropdown","required":true,"options":["a","b","c"]},{"question":"klpo","answer_type":"checkbox","required":false,"options":["lol","asd"]},{"question":"lslsls","answer_type":"date","required":false,"options":[]},{"question":"kdl","answer_type":"yes_no","required":false,"options":[]},{"question":"jdjdj","answer_type":"long_text","required":false,"options":[]},{"question":"kkljk","answer_type":"short_text","required":false,"options":[]}]'
export const editJobPostingInitials = {
  ...createJobPostingInitials,
  id: 0,
}
