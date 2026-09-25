import type { TGetApiResponse, TPostApiResponse } from './request.types'

export type TBaseQueryParams = {
  page: number
  perPage: number
  search_query?: string
}

export type TSearchOrganizationEmployees = {
  id: number
  pin: number
  department_id: number | null
  employee_grade_id: number | null
  branch: string
  department: string | null
  name: string
  branch_id: number
}

export type TSearchOrganizationEmployeesResponse = TGetApiResponse<
  TSearchOrganizationEmployees[]
>

export type TFetchOrganizationBranchesParams = TBaseQueryParams

export type TOrganizationBranch = {
  id: number
  station_name: string
  parent_station_id: number
  station_type_id: number
  is_hq: number
  station_head_id: number
  station_hr_manager_id: number | null
  station_account_manager_id: number | null
  company_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  branch_head_name: string
  state: string | null
  city: string | null
}

export type TFetchOrganizationBranchesResponse = TGetApiResponse<{
  results: TOrganizationBranch[]
  total: number
}>

export type TOrganizationBranchType = {
  id: number
  type: string
}

export type TFetchOrganizationBranchTypesResponse = TGetApiResponse<
  TOrganizationBranchType[]
>

export type TCountry = {
  id: number
  code: string
  name: string
  phonecode: number
}

export type TFetchCountriesResponse = TGetApiResponse<TCountry[]>

export type TState = {
  id: number
  name: string
  country_id: number
}

export type TFetchStatesResponse = TGetApiResponse<TState[]>

export type TCreateBranchPayload = {
  branch_type_id: number
  parent_branch_id: number | null
  branch_head_id: number
  country: string
  state: string
  address: string
  branch_alt_phone_no: string
  branch_phone_no: string
  city: string
  description: string
}

export type TUpdateBranchPayload = TCreateBranchPayload & {
  id: number
}

export type TGetBranchDetails = {
  id: number
  station_name: string
  parent_station_id: number
  station_type_id: number
  is_hq: number
  station_head_id: number
  station_hr_manager_id: null
  station_account_manager_id: null
  company_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  branch_head_name: string
  branch_hr_manager_name: string | null
  branch_account_manager_name: string | null
  branch_type: string
  parent_branch: string | null
  branch_phone_no: string
  branch_alt_phone_no: string
  contact_person_name: string | null
  contact_person_designation: string | null
  fax: string | null
  email: string | null
  website: string | null
  address: string
  city: string
  state: string
  zip_code: string | null
  country: string
  additional_info: string | null
  currency_sign: string
  other_information: string | null
}

export type TGetBranchDetailsResponse = TGetApiResponse<TGetBranchDetails>

export type TGetDepartment = {
  id: number
  department_name: string
  department_head_id: number
  parent_department_id: number
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
  updated_by: number
  department_head_name: string
  group_department_name: string
  branch: string
}

export type TFetchOrganizationDepartmentsResponse = TGetApiResponse<{
  results: TGetDepartment[]
  total: number
}>

export type TFetchOrganizationDepartmentsParams = TBaseQueryParams

export type TDeleteOrganizationDepartmentPayload = {
  departmentIds: number[]
}

export type TDeleteBulkOrganizationBranchPayload = {
  branchIds: number[]
}

export type TDeleteOrganizationDepartmentResponse = TPostApiResponse<number>

export type TCreateDepartmentPayload = {
  department_name: string | number
  department_head_id: number
  parent_department_id: number | null
  sort: number
  notes: string
  station_id: number
  company_id: number
  is_active: number
  is_generic: number
}

export type TGetDepartmentDetails = {
  id: number
  department_name: string
  department_head_id: number
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
  updated_by: number | null
  branch_id: number
  department_head_name: string
  branch: string
  group_department_name: string | null
}

export type TGetDepartmentDetailsResponse =
  TGetApiResponse<TGetDepartmentDetails>

export type TUpdateDepartmentPayload = TCreateDepartmentPayload & { id: number }

export type TDeleteOrganizationTeamPayload = {
  teamIds: number[]
}

export type TDeleteOrganizationTeamResponse = TPostApiResponse<number>

export type TTeam = {
  id: number
  team_name: string
  company_id: number
  station_id: number
  is_generic: number
  created_at: string
  updated_at: string
  description: string
  team_head_id: number
  station_name: string
  team_head_name: string
  no_members: number
  members: {
    id: number
    team_member_name: string
  }[]
}

export type TTeamResponse = TGetApiResponse<{ results: TTeam[]; total: number }>

export type TFetchOrganizationTeamsParams = TBaseQueryParams

export type TCreateTeamPayload = {
  branch_id: number
  description: string
  team_head_id: number
  team_members: number[]
  team_name: string
}

export type TUpdateTeamPayload = TCreateTeamPayload & { id: number }

export type TTeamDetails = {
  id: number
  team_name: string
  company_id: number
  station_id: number
  is_generic: number
  created_at: string
  updated_at: string
  description: string
  team_head_id: number
  station_name: string
  team_head_name: string
  no_members: number
  members: {
    id: number
    team_member_name: string
  }[]
}

export type TTeamDetailsResponse = TGetApiResponse<TTeamDetails>

export type TEmployee = {
  id: number
  custom_employee_id: string | null
  pin: number
  name: string
  email: string
  is_active: number
  branch: string
  designation: string | null
  department: string
  status: string
}

export type TEmployeeResponse = TGetApiResponse<{
  results: TEmployee[]
  total: number
}>

export type TFetchOrganizationAllEmployeesParams = TBaseQueryParams & {
  status?: string
}
export type TEmployeeCountResponse = TGetApiResponse<{
  archived: number
  unarchived: number
}>

export type TFetchArchivedOrganizationEmployeesParams = TBaseQueryParams

export type TArchivedEmployee = {
  id: number
  pin: number
  email: string
  address: string
  branch: string
  designation: string
  department: string
  name: string
  status: string
  date_archived: string
}

export type TArchivedEmployeeResponse = TGetApiResponse<{
  results: TArchivedEmployee[]
  total: number
}>

export type TRestoreArchivedEmployeesPayload = {
  id: number[]
}

export enum TEmployeeRole {
  EMPLOYEE = 'employee',
}

export type TEmployeeDetail = {
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
  employee_type_id: number | null
  employee_category_id: number | null
  employee_designation_id: number | null
  employee_grade_id: number | null
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
  local_government: string
  genotype: string
  custom_fields: null
  mobile_number: string
  next_of_kin: string
  last_employment_date: string | null
  last_employer: string | null
  guarantor_name: string | null
  guarantor_phone_number: string | null
  last_qualification: string | null
  qualification_date: string | Date | null
  qualification_document: null
  bank_name: null
  account_number: string | null
  account_type: null
  deleted_at: null
  country: string | null
  city: string
  account_name: null
  salutation: string
  address: string
  picture: string | null
  bank_id: number | null
  bank_branch: null
  pension_fund_administrator: string | null
  rsa_pin: string
  tax_id: string
  staff_id: string
  tax_location: string
  mobile_number2: null
  signature: null
  alt_mobile_number: string | null
  means_of_identity: string
  id_no: string
  id_expiration: string
  emergency_contact_name: string | null
  emergency_contact_rel: string | null
  emergency_contact_no: string | null
  emergency_contact_address: string | null
  bank_code: string | null
  recipient_code: string | null
  branch_id: number
  employee_designation: { id: number; designation_name: string } | null
  employee_type: { id: number; type_name: string } | null
  employee_grade: { id: number; grade_name: string } | null
  employee_category: { id: number; category_name: string } | null
  branch: {
    id: number
    station_name: string
  }
  roles: [
    {
      id: number
      name: TEmployeeRole
    },
  ]
  bank: null
  department: {
    id: number
    department_name: string
  }
}

export type TEmployeeDetailResponse = TGetApiResponse<TEmployeeDetail>

export type TGetFieldSampleRow = {
  'Employee Access Pin': '3,457'
  'Employee ID': ''
  'Employee Name': 'Thomas moore'
  'First Name': 'Thomas'
  'Last Name': 'Moore'
  Email: 'thomas@cardcentre.com.ng'
  Gender: 'Female'
  'Date of Birth': '04-30-1977'
  'Blood Group': 'O+'
  Nationality: 'Nigerian'
  Religion: 'Christianity'
  'Marital Status': 'Married'
  'Employee Type ID': ''
  'Employee Category ID': ''
  'Employee Designation ID': ''
  'Employee Grade ID': ''
  'Branch ID': '515'
  'Department ID': '513'
  Country: 'Nigeria'
  State: 'Osun'
  City: 'Ijebu-Jesa'
  'Local Government': 'Abeokuta South'
  Genotype: 'AA'
  'Mobile Number': '8033458454'
  'Next of Kin': 'Mrs Ojo Olukemi'
  'Last Employment Date': ''
  'Last Employer': 'Chams Holdco Plc'
  'Guarantor Name': 'Mr Stanley Arodiwe'
  'Guarantor Phone Number': '8023524074'
  'Appointment Date': '15-02-2017'
  'Account Name': 'Ojolo Opeyemi Oluwatoyin'
  'Account Number': '3009667312'
  'Bank Name': 'Access Bank'
  'Bank Code': '44'
  'Bank ID': ''
  Salutation: 'Mrs'
  Address: '40,Iseyin Street,Off Shyllon Street,Palm grove Bus Stop, Lagos'
  'Grant Login Access': 'Yes'
  'Bank Branch': ''
  'Pension Fund Administrator': ''
  'RSA Pin': ''
  'TAX ID': ''
  'TAX LOCATION': ''
  'STAFF ID': ''
  'CUSTOM ID': ''
}

export type TGetFieldsFromCsvResponse = TPostApiResponse<{
  fieldsFromCSV: [
    'Employee Access Pin',
    'Employee ID',
    'Employee Name',
    'First Name',
    'Last Name',
    'Email',
    'Gender',
    'Date of Birth',
    'Blood Group',
    'Nationality',
    'Religion',
    'Marital Status',
    'Employee Type ID',
    'Employee Category ID',
    'Employee Designation ID',
    'Employee Grade ID',
    'Branch ID',
    'Department ID',
    'Country',
    'State',
    'City',
    'Local Government',
    'Genotype',
    'Mobile Number',
    'Next of Kin',
    'Last Employment Date',
    'Last Employer',
    'Guarantor Name',
    'Guarantor Phone Number',
    'Appointment Date',
    'Account Name',
    'Account Number',
    'Bank Name',
    'Bank Code',
    'Bank ID',
    'Salutation',
    'Address',
    'Grant Login Access',
    'Bank Branch',
    'Pension Fund Administrator',
    'RSA Pin',
    'TAX ID',
    'TAX LOCATION',
    'STAFF ID',
    'CUSTOM ID',
  ]
  employeeUploadFields: {
    label: string
    value: string
  }[]
  total: number
  sampleRows: TGetFieldSampleRow[]
}>

export type TGetFieldsFromCsvPayload = {
  employeesFile: FormData
}

export type TValidateEmployeeDataPayload = {
  employeesFile: FormData
}

export type TValidateEmployeeDataRow = {
  row: number
  status: 'error' | 'warning' | 'valid'
  action: 'create' | 'update'
  pinWasAutoGenerated: boolean
  data: {
    pin: number
    first_name: string
    last_name: string
    email: string
    gender: 'Male' | 'Female' | 'Other'
    date_of_birth: string
    blood_group: string
    nationality: string
    religion: string
    marital_status: string
    employee_type_id: number | null
    employee_category_id: number | null
    employee_designation_id: number | null
    employee_grade_id: number | null
    branch_id: number | null
    department_id: number | null
    country: string
    state: string
    city: string
    local_government: string
    genotype: string
    mobile_number: string
    next_of_kin: string
    last_employment_date: string | null
    last_employer: string | null
    guarantor_name: string
    guarantor_phone_number: string
    appointment_date: string | null
    account_name: string
    account_number: string
    bank_name: string
    bank_code: string
    bank_id: number | null
    salutation: string
    address: string
    login_access: boolean
    rsa_pin: string | null
  }
  errors: [
    {
      field: string
      message: string
    },
  ]
}

export type TValidateEmployeeDataResponse = TPostApiResponse<{
  totalRows: number
  validCount: number
  errorCount: number
  pinCollisionCount: number
  rows: TValidateEmployeeDataRow[]
}>

export type TGetNextFreePinPayload = {
  excludePins?: string
}

export interface CommitResult {
  createdCount: number
  updatedCount: number
  failedCount: number
  timeline: {
    row?: number
    message: string
    type: 'success' | 'failure'
    time: Date
  }[]
}

type CommitStatus = {
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown'
  progress: number // 0-100
  result: CommitResult | null // populated only once state === 'completed'
}

export type TGetUploadEmployeeDataStatusResponse = TGetApiResponse<CommitStatus>

export type TGetBanksResponse = TGetApiResponse<
  {
    id: number
    bank_name: string
    bank_code: string
    is_active_on_remita: number
  }[]
>

export type TGetEmployeeTypes = {
  id: number
  type_name: string
  company_id: number
  station_id: number | null
}

export type TGetEmployeeTypesResponse = TGetApiResponse<{
  results: TGetEmployeeTypes[]
  total: number
}>

export type TGetEmployeeDesignations = {
  id: number
  designation_name: string
  station_id: number | null
  company_id: number
  is_system: number
  created_at: string
  updated_at: string
}

export type TGetEmployeeDesignationsResponse = TGetApiResponse<{
  results: TGetEmployeeDesignations[]
  total: number
}>

export type TGetEmployeeGrades = {
  id: number
  grade_name: string
  pay_package_id: number | null
  station_id: number | null
  company_id: number
  is_system: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  rank: number
}

export type TGetEmployeeGradesResponse = TGetApiResponse<{
  results: TGetEmployeeGrades[]
  total: number
}>

export type TGetEmployeeCategories = {
  id: number
  category_name: string
  station_id: number | null
  company_id: number
  is_system: number
  created_at: string
  updated_at: string
}

export type TGetEmployeeCategoriesResponse = TGetApiResponse<{
  results: TGetEmployeeCategories[]
  total: number
}>

export type TUploadEmployeeImagePayload = {
  image: FormData
}

export type TUploadEmployeeImageResponse = TPostApiResponse<string>

export type TGetEmployeeRoles = {
  id: number
  name: string
  description: string | null
  is_system: number
}

export type TGetEmployeeRolesResponse = TGetApiResponse<TGetEmployeeRoles[]>

export type TCreateEmployeeReportsPayload = {
  fetch_by: 'employee' | 'company' | 'branch' | 'department'
  fetch_by_id: number[]
  columns: string[]
  page: number
  perPage: number
  date_filter?: 'last_30_days' | 'custom_range'
  date_from?: string
  date_to?: string
}

export type TFetchEmployeeReportsResponse = TPostApiResponse<{
  results: {
    name: string
    email: string | null
    gender: string | null
  }[]
  total: number
}>

export type TFetchDepartmentsAssignedToBranchResponse = TGetApiResponse<
  {
    id: number
    department_name: string
  }[]
>

export type TFetchEmployeeTypesParams = TBaseQueryParams
export type TFetchEmployeeDesignationsParams = TBaseQueryParams
export type TFetchEmployeeGradesParams = TBaseQueryParams
export type TFetchEmployeeCategoriesParams = TBaseQueryParams
