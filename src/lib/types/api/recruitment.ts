import type {
  TBaseQueryParams,
  TGetApiResponse,
  TPostApiResponse,
} from './request.types'

export type TRecruitmentEmailTemplate = {
  id: number
  company_id: number
  template_type: string
  subject: string
  body: string
  is_active: number
  created_at: string
  updated_at: string
}
export type TRecruitmentEmailTemplatesResponse = TGetApiResponse<{
  templates: TRecruitmentEmailTemplate[]
}>
export type TRecruitmentEmailTemplatesByIdResponse = TGetApiResponse<{
  template: TRecruitmentEmailTemplate
  placeholders: {
    key: string
    description: string
  }[]
}>

export type TUpdateRecruitmentEmailTemplateByIdParams = {
  templateId: number
  subject: string
  body: string
}

export type TRecruitmentSettingsResponse = TGetApiResponse<{
  id: number
  company_id: number
  accepted_formats: string
  max_file_size_mb: number
  cv_template_url: string | null
  cv_template_name: string | null
  created_at: string
  updated_at: string
}>

export type TUpdateRecruitmentSettingsParams = {
  accepted_formats: string[]
  max_file_size_mb: number
}

export type TRecruitmentJobRequest = {
  id: number
  description: string | null
  role: string
  work_mode: string
  type: string
  reason: string
  salary_range: string | null
  department_id: number | null
  company_id: number
  station_id: number
  created_at: string
  updated_at: string
  status: string
  approved_by_id: number | null
  requested_by_id: number | null
  department: {
    id: number
    department_name: string
    department_head_id: number | null
    parent_department_id: number | null
    sort: number
    notes: string
    station_id: number
    company_id: number
    is_active: number
    is_generic: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    created_by: string
    updated_by: string | null
  } | null
  approved_by: {
    id: number
    first_name: string
    last_name: string
    email: string
    date_of_birth: string
    gender: string
    blood_group: string
    nationality: string
    religion: string
    marital_status: string
    show_in_organogram: number
    employee_type_id: number
    employee_category_id: number
    employee_designation_id: number
    employee_grade_id: number
    pin: number
    user_id: number
    company_id: number
    station_id: number
    department_id: number
    pay_package_id: number | null
    is_active: number
    appointment_date: string
    created_at: string
    updated_at: string
    custom_employee_id: string | null
    state: string
    local_government: string | null
    genotype: string | null
    custom_fields: string | null
    mobile_number: string
    next_of_kin: string | null
    last_employment_date: string | null
    last_employer: string | null
    guarantor_name: string | null
    guarantor_phone_number: string | null
    last_qualification: string | null
    qualification_date: string | null
    qualification_document: string | null
    bank_name: string | null
    account_number: string
    account_type: string | null
    deleted_at: string | null
    country: string
    city: string
    account_name: string
    salutation: string
    address: string
    picture: string
    bank_id: number
    bank_branch: string
    pension_fund_administrator: string | null
    rsa_pin: string | null
    tax_id: string | null
    staff_id: string | null
    tax_location: string | null
    mobile_number2: string
    signature: string | null
    alt_mobile_number: string | null
    means_of_identity: string
    id_no: string
    id_expiration: string
    emergency_contact_name: string
    emergency_contact_rel: string
    emergency_contact_no: string
    emergency_contact_address: string
    bank_code: string
    recipient_code: string
  } | null
  linked_posting: {
    id: number
    description: string
    role: string
    work_mode: string
    type: string
    status: string
    uuid: string
    published_url: null
    custom_fields: null
    created_by_id: number
    company_id: number
    station_id: number
    created_at: string
    updated_at: string
    job_location_country_id: null
    job_location_state_id: null
    accepted_formats: null
    max_file_size_mb: null
    job_request_id: number
    department_id: number
    required_documents: null
    deleted_at: null
  } | null
}

export type TRecruitmentJobRequestsResponse = TGetApiResponse<{
  results: TRecruitmentJobRequest[]
  total: number
}>

export type TRecruitmentJobRequestsParams = TBaseQueryParams & {
  status?: string
  work_mode?: string
  type?: string
  department_id?: number
}

export type TRecruitmentTalentRequestByIdResponse =
  TGetApiResponse<TRecruitmentJobRequest>

export type TTalentRequestStatus = 'reopen' | 'approve' | 'reject' | 'cancel'

export type TUpdateRecruitmentTalentRequestStatusParams = {
  id: number
  status: TTalentRequestStatus
}

export type TCreateTalentRequisitionResponse = TPostApiResponse<{
  company_id: number
  station_id: number
  requested_by_id: number
  status: string
  department_id: number
  role: string
  salary_range: string
  work_mode: string
  type: string
  reason: string
  description: string
  created_at: string
  updated_at: string
  id: number
}>
