import type { TReportFilter } from '../types'

export const ExemptionType = [
  {
    label: 'Clock In',
    value: 'CLOCK_IN',
  },
  {
    label: 'Clock Out',
    value: 'CLOCK_OUT',
  },
  {
    label: 'Clock In/Out',
    value: 'CLOCK_IN_OUT',
  },
]

export const hrmReportsFilter: TReportFilter[] = [
  {
    label: 'Pin',
    value: 'pin',
    description: 'Personal Identification Number',
  },
  {
    label: 'Email',
    value: 'email',
    description: 'Email Address of Employee',
  },
  {
    label: 'Gender',
    value: 'gender',
    description: 'Demographic Information of Employee',
  },
  {
    label: 'Employee Grade',
    value: 'employee_grade',
    description: 'Grade of Employee',
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
    label: 'Mobile Number',
    value: 'mobile_number',
    description: 'Mobile Number of Employee',
  },
  {
    label: 'Employee Category',
    value: 'employee_category',
    description: 'Category of Employee',
  },
]

export const hrmSystemSettingsOptions = [
  {
    label: 'Exemptions',
    value: 'exemptions-settings',
    description: 'Exemptions related settings',
    image: '/images/svg/exemptions.svg',
  },
  {
    label: 'Leaves',
    value: 'leaves-settings',
    description: 'Leaves related settings',
    image: '/images/svg/leaves.svg',
  },
]

export const hrmLeaveTypeCategory = [
  {
    label: 'All Users',
    value: 'all_users',
  },
  {
    label: 'Specific Department',
    value: 'department',
  },
  {
    label: 'Specific Grade',
    value: 'station_grade',
  },
  {
    label: 'Specific Employees',
    value: 'employees',
  },
]

export const hrmLeaveApproverTypes = [
  {
    label: 'Concurrent Approval',
    value: 'Concurrent',
  },
  {
    label: 'Sequential Approval',
    value: 'Sequential',
  },
]

export const hrmLeaveApproverCategory = [
  {
    label: 'Employees',
    value: 'employees',
  },
  {
    label: 'Department',
    value: 'department',
  },
  {
    label: 'Grade',
    value: 'station_grade',
  },
  {
    label: 'Branch',
    value: 'branch',
  },
]
