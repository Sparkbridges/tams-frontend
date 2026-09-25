import type { TLabelValueWithoutNull, TReportFilter } from '../types'

export const RELIGION_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Christianity', value: 'christianity' },
  { label: 'Islam', value: 'islam' },
  { label: 'Other', value: 'other' },
]

export const GENDER_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const BLOOD_GROUP_TYPES: TLabelValueWithoutNull[] = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
]

export const MARITAL_STATUS_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
]

export const GENOTYPE_TYPES: TLabelValueWithoutNull[] = [
  { label: 'AA', value: 'AA' },
  { label: 'AS', value: 'AS' },
  { label: 'SS', value: 'SS' },
  { label: 'AC', value: 'AC' },
  { label: 'SC', value: 'SC' },
  { label: 'CC', value: 'CC' },
  { label: 'Other', value: 'other' },
]

export const IDENTITY_TYPES: TLabelValueWithoutNull[] = [
  { label: 'National ID', value: 'national_id' },
  { label: 'Passport', value: 'passport' },
  { label: 'Driver License', value: 'driver_license' },
  { label: 'Voter Card', value: 'voter_card' },
  { label: 'Other', value: 'other' },
]

export const SALUTATION_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Mr.', value: 'mr' },
  { label: 'Mrs.', value: 'mrs' },
  { label: 'Miss', value: 'miss' },
  { label: 'Dr.', value: 'dr' },
  { label: 'Prof.', value: 'prof' },
  { label: 'Other', value: 'other' },
]

export const EMERGENCY_CONTACT_RELATIONSHIP_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Parent', value: 'parent' },
  { label: 'Sibling', value: 'sibling' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Friend', value: 'friend' },
  { label: 'Other', value: 'other' },
]

export const reportsFilter: TReportFilter[] = [
  {
    label: 'Pin',
    value: 'pin',
    description: 'Personal Identification Number',
  },
  {
    label: 'Name',
    value: 'name',
    description: 'Full Name of Employee',
  },
  {
    label: 'Email',
    value: 'email',
    description: 'Email Address of Employee',
  },
  {
    label: 'Employee Type',
    value: 'employee_type',
    description: 'Type of Employee',
  },
  {
    label: 'Grade',
    value: 'employee_grade',
    description: 'Grade of Employee',
  },
  {
    label: 'Gender',
    value: 'gender',
    description: 'Demographic Information of Employee',
  },
  {
    label: 'Department',
    value: 'department',
    description: 'Operational Unit of Employee',
  },
  {
    label: 'Branch',
    value: 'branch',
    description: 'Branch of Employee',
  },
  {
    label: 'Birthday',
    value: 'date_of_birth',
    description: 'Date of Birth of Employee',
  },
  {
    label: 'Address',
    value: 'address',
    description: 'Residential Address of Employee',
  },
  {
    label: 'Account Name',
    value: 'account_name',
    description: 'Bank Account Name of Employee',
  },
  {
    label: 'Genotype',
    value: 'genotype',
    description: 'Genotype of Employee',
  },
  {
    label: 'Mobile Number',
    value: 'mobile_number',
    description: 'Mobile Number of Employee',
  },
  {
    label: 'Local Government',
    value: 'local_government',
    description: 'Local Government Area of Employee',
  },
  {
    label: 'City',
    value: 'city',
    description: 'City of Residence of Employee',
  },
  {
    label: 'State',
    value: 'state',
    description: 'State of Residence of Employee',
  },
  {
    label: 'Country',
    value: 'country',
    description: 'Country of Residence of Employee',
  },
  {
    label: 'Employment Date',
    value: 'appointment_date',
    description: 'Date of Employment of Employee',
  },
  {
    label: 'Blood Group',
    value: 'blood_group',
    description: 'Blood Group of Employee',
  },
  {
    label: 'Nationality',
    value: 'nationality',
    description: 'Nationality of Employee',
  },
  {
    label: 'Religion',
    value: 'religion',
    description: 'Religion of Employee',
  },
  {
    label: 'Marital Status',
    value: 'marital_status',
    description: 'Marital Status of Employee',
  },
  {
    label: 'Employee Category',
    value: 'employee_category',
    description: 'Category of Employee',
  },
  {
    label: 'Employee Designation',
    value: 'employee_designation',
    description: 'Designation of Employee',
  },
  {
    label: 'Bank Name',
    value: 'bank',
    description: 'Bank Name of Employee',
  },
  {
    label: 'Account Number',
    value: 'account_number',
    description: 'Bank Account Number of Employee',
  },
  {
    label: 'Bank Branch',
    value: 'bank_branch',
    description: 'Bank Branch of Employee',
  },
  {
    label: 'Tax Id',
    value: 'tax_id',
    description: 'Tax Identification Number of Employee',
  },
  {
    label: 'PFA',
    value: 'pension_fund_administrator',
    description: 'Pension Fund Administrator of Employee',
  },
  {
    label: 'RSA Pin',
    value: 'rsa_pin',
    description: 'RSA Pin of Employee',
  },
]

export const segmentedControlData = [
  { label: 'All Employees', value: 'all' },
  { label: 'By Branch', value: 'branch' },
  { label: 'By Department', value: 'department' },
  { label: 'Individuals', value: 'employee' },
]

export const reportDateOptions = [
  {
    label: 'All time',
    value: 'all',
    description: 'Includes all available data',
  },
  {
    label: 'Last 30 days',
    value: 'last_30_days',
    description: 'Includes data from the last 30 days',
  },
  {
    label: 'Custom Range',
    value: 'custom_range',
    description: 'Select a custom date range',
  },
]

export const systemSettingsOptions = [
  {
    label: 'Account',
    value: 'account-settings',
    description: 'Account related settings',
    image: '/images/svg/account.svg',
  },
  {
    label: 'Roles and Permissions',
    value: 'roles-and-permissions-settings',
    description: 'Roles and Permissions related settings',
    image: '/images/svg/roles.svg',
  },
  {
    label: 'Employee',
    value: 'employee-settings',
    description: 'Employee related settings',
    image: '/images/svg/employees.svg',
  },
]
