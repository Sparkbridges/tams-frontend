export type TCompanyDetailsType = {
  id: number
  company_name: string
  slug: string
  is_active: number
  company_logo: string
  head_station_id: number
  legal_name: string | null
  redirect_url: string
}

export type TAuthSessionType = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export enum USER_VIEW {
  ADMIN = 'admin',
  ESS = 'ess',
}

export type TUser = {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  is_user_first_signin: number
  roles: {
    id: number
    name: string
    company_id: number | null
  }[]
  role_names: string[]
  permissions: [
    'view backend',
    'view dashboard data',
    'view sub-station dashboard data',
    'view attendance dashboard',
    'create employee',
    'create employee login access',
    'edit employee',
    'soft delete employee',
    'hard delete employee',
    'view all employees',
    'view other employees profile',
    'view own profile',
    'import employees',
    'export employees',
    'view employees account details',
    'deactivate employees',
    'activate employees',
    'view employees reports',
    'change employee roles',
    'change employee permissions',
    'view employees in department',
    'view employees in team',
    'view all companies',
    'create company',
    'edit company',
    'delete company',
    'manage company settings',
    'view other company profile',
    'view all stations',
    'create station',
    'edit station',
    'delete station',
    'assign station accountant',
    'manage station settings',
    'manage station staffs',
    'set head station',
    'view single station',
    'fetch station types',
    'perform operations on sub-stations',
    'view all departments',
    'view single department',
    'create department',
    'edit department',
    'delete department',
    'manage department head',
    'view all teams',
    'create team',
    'edit team',
    'delete team',
    'assign employees to team',
    'set team rules',
    'manage team admin',
    'create grade',
    'edit grade',
    'view grades',
    'view grade by id',
    'delete grade',
    'create station setting',
    'edit station setting',
    'create employee type',
    'update employee type',
    'delete employee type',
    'create employee category',
    'update employee category',
    'delete employee category',
    'create employee designation',
    'update employee designation',
    'delete employee designation',
    'create benefits and reward',
    'edit benefits and reward',
    'approve benefits and reward',
    'create disciplinary',
    'edit disciplinary',
    'approve disciplinary',
    'view all leave types',
    'view leave type detail',
    'create leave type',
    'edit leave type',
    'delete leave type',
    'view all leave requests',
    'view all leave entitled',
    'view leave request detail',
    'create leave request',
    'edit leave request',
    'delete leave request',
    'cancel leave request',
    'view all exemption requests',
    'view exemption request detail',
    'create exemption request',
    'edit exemption request',
    'delete exemption request',
    'view all loan types',
    'view loan type detail',
    'create loan type',
    'edit loan type',
    'delete loan type',
    'view all loan requests',
    'view loan request detail',
    'create loan request',
    'edit loan request',
    'cancel loan request',
    'treat loan request',
    'delete loan request',
    'override maximum loan amount',
    'override loan approval',
    'generate loan request report',
    'view all loan disbursement',
    'view loan disbursement detail',
    'create loan disbursement',
    'edit loan disbursement',
    'delete loan disbursement',
    'view all statutory deductions',
    'view statutory deduction',
    'create statutory deduction',
    'edit statutory deduction',
    'delete statutory deduction',
    'view all payroll constants',
    'view payroll constant',
    'create payroll constant',
    'edit payroll constant',
    'delete payroll constants',
    'view all pay packages',
    'view pay package',
    'create pay package',
    'edit pay package',
    'delete pay packages',
    'view all allowances',
    'view allowance',
    'create allowance',
    'edit allowance',
    'delete allowance',
    'view all company contributions',
    'view company contribution',
    'create company contribution',
    'edit company contribution',
    'delete company contribution',
    'view all batchings and groupings',
    'view batching and grouping',
    'create batching and grouping',
    'edit batching and grouping',
    'delete batching and grouping',
    'attach loan cap',
    'fetch loancap',
    'fetch all loancaps',
    'remove loancap',
    'view all benefits and deductions',
    'view all benefit and deduction types',
    'view benefit and deduction',
    'view benefit and deduction type',
    'create benefit and deduction',
    'create benefit and deduction type',
    'edit benefit and deduction',
    'edit benefit and deduction type',
    'delete benefits and deductions',
    'delete benefit and deduction types',
    'set benefit and deduction approvals',
    'view all employee loan payment',
    'view employee loan payment detail',
    'create employee loan payment',
    'edit employee loan payment',
    'approve employee loan payment',
    'delete employee loan payment',
    'create loan payment for another employee',
    'view all salary schedules',
    'upload salary schedules',
    'view payment upload tracks',
    'view payment upload track',
    'treat employee salaries',
    'export employee salaries',
    'export employee salary report',
    'generate employee payslip',
    'view all appraisals',
    'view appraisal detail',
    'create appraisal',
    'edit appraisal',
    'delete appraisal',
    'view all appraisal tasks',
    'view all appraisal tasks by appraisal id',
    'view appraisal task detail',
    'create appraisal task',
    'edit appraisal task',
    'delete appraisal task',
    'create appraisal reviewer',
    'edit appraisal reviewer',
    'fetch appraisal reviewers',
    'delete appraisal reviewers',
    'create appraisal ratings',
    'edit appraisal ratings',
    'fetch appraisal ratings',
    'soft delete appraisal ratings',
    'store appraisal template',
    'fetch appraisal template',
    'soft delete appraisal template',
    'store appraisal template section',
    'fetch appraisal template section',
    'soft delete appraisal template section',
    'store appraisal template comment',
    'fetch appraisal template comment',
    'soft delete appraisal template comment',
    'store appraisal template recommendation',
    'fetch appraisal template recommendation',
    'soft delete appraisal template recommendation',
    'store appraisal template question',
    'fetch appraisal template question',
    'soft delete appraisal template question',
    'create attendance setting',
    'view attendance setting',
    'create role',
    'edit role',
    'view roles',
    'delete role',
    'assign role to permissions',
    'fetch single role',
    'fetch user by role',
    'assign role to user',
    'unassign user from role',
    'view permissions',
    'edit permissions',
    'fetch permissions by role',
    'view user reports',
    'fetch constants',
    'create employee transfer',
    'view employee transfer',
    'edit employee transfer',
    'fetch employee transfer',
    'delete employee transfer',
    'create training',
    'edit training',
    'delete training',
    'view all trainings',
    'view training',
    'create training category',
    'edit training category',
    'delete training category',
    'view all training categories',
    'view training category',
    'view all device',
    'view single device',
    'create device',
    'edit device',
    'view shift type',
    'save shift type',
    'delete shift type',
    'view regular shifts',
    'create regular shift',
    'update regular shift',
    'assign shift',
    'view assigned shift',
    'delete regular shift',
    'create clock settings',
    'get clock settings',
    'get employee shift',
    'save employee shift',
    'upload employee shift',
    'download shift roster',
    'view simple report',
    'view workforce report',
    'view absentee report',
    'view lateness report',
    'view punctuality report',
    'view summary report',
    'get all appraisals',
    'get one appraisal',
    'update appraisal',
    'grade an appraisal',
    'grade my appraisal',
    'fetch my appraisals',
    'fetch my appraisal',
    'initiate appraisals',
    'approve appraisals',
    'reject appraisals',
    'end appraisals',
    'get my surveys',
    'get one survey',
    'get all surveys',
    'create surveys',
    'update appraisal grade settings',
    'get appraisal grade settings',
    'update appraisal general settings',
    'get appraisal general settings',
    'view all appraiser setting',
    'view an appraiser setting',
    'create appraiser setting',
    'edit appraiser setting',
    'delete appraiser setting',
    'generate performance report',
    'get all projects',
    'get one project',
    'create projects',
    'create project task',
    'create task status',
    'get my projects',
    'get my tasks',
    'get one job application',
    'get all job applications',
    'delete job applications',
    'update job application status',
    'create job posting',
    'get one job posting',
    'get all job postings',
    'delete job posting',
    'publish job posting',
    'create talent request',
    'get all talent requests',
    'create job board settings',
    'get all recruitment email templates',
    'get one recruitment email template',
    'update recruitment email template',
    'preview recruitment email template',
    'get recruitment settings',
    'update recruitment settings',
    'upload recruitment cv template',
    'remove recruitment cv template',
    'approve talent request',
    'get lateness deduction settings',
    'update lateness deduction settings',
    'get company statutory settings',
    'update company statutory settings',
  ]
  employee: {
    id: number
    first_name: string
    last_name: string
    email: string
    date_of_birth: null
    gender: null
    blood_group: null
    nationality: null
    religion: null
    marital_status: null
    show_in_organogram: number
    employee_type_id: null
    employee_category_id: null
    employee_designation_id: null
    employee_grade_id: number
    pin: number
    user_id: number
    company_id: number
    station_id: number
    department_id: number
    pay_package_id: null
    is_active: 1
    appointment_date: null
    created_at: string
    updated_at: string
    custom_employee_id: null
    state: null
    local_government: null
    genotype: null
    custom_fields: null
    mobile_number: string
    next_of_kin: null
    last_employment_date: null
    last_employer: null
    guarantor_name: null
    guarantor_phone_number: null
    last_qualification: null
    qualification_date: null
    qualification_document: null
    bank_name: null
    account_number: string
    account_type: null
    deleted_at: null
    country: null
    city: null
    account_name: string
    salutation: string
    address: null
    picture: null
    bank_id: string
    bank_branch: null
    pension_fund_administrator: null
    rsa_pin: null
    tax_id: null
    staff_id: null
    tax_location: null
    mobile_number2: string
    signature: null
    alt_mobile_number: null
    means_of_identity: null
    id_no: null
    id_expiration: null
    emergency_contact_name: null
    emergency_contact_rel: null
    emergency_contact_no: null
    emergency_contact_address: null
    bank_code: string
    recipient_code: string
    company: {
      id: number
      company_name: string
      legal_name: null
      slug: string
      is_active: number
      company_logo: string
      company_type_id: number
      created_at: string
      updated_at: string
      deleted_at: null
      head_station_id: number
      account_type: string
      expires_at: string
      reseller_id: null
    }
    branch: {
      id: number
      station_name: string
      parent_station_id: null
      station_type_id: number
      is_hq: number
      station_head_id: number
      station_hr_manager_id: null
      station_account_manager_id: null
      company_id: number
      created_at: string
      updated_at: string
      deleted_at: null
    }
  }
  managingBranches: {
    id: number
    station_name: string
    is_hq: number
  }[]
  subscription: {}
  packageModules: {
    module_id: number
    module_name: string
    slug: string
    parent_module_id: null
    package_name: string
    subscribed: number
    is_parent_module: number
    subModules: []
  }[]
  employee_has_invite: boolean
  employee_profile_completed: boolean
}
