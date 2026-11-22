import {
  BuildingOfficeIcon,
  CalendarDotsIcon,
  ChalkboardTeacherIcon,
  ChartLineUpIcon,
  ClipboardTextIcon,
  DevicesIcon,
  DoorOpenIcon,
  ExcludeIcon,
  FilesIcon,
  FingerprintIcon,
  FolderUserIcon,
  LockKeyIcon,
  MoneyWavyIcon,
  SlidersHorizontalIcon,
  SpeedometerIcon,
  SquaresFourIcon,
  TargetIcon,
  UsersThreeIcon,
  WarehouseIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { TamsNavigation } from '../types'

export const pageHeaderNav: Record<
  string,
  { title: string; icon?: Icon; description: string } | undefined
> = {
  organization: {
    title: 'Organization',
    icon: BuildingOfficeIcon,
    description: 'Manage the overall organization structure',
  },
  branch: {
    title: 'Branch management',
    icon: BuildingOfficeIcon,
    description: 'Manage branches within the organization',
  },
  department: {
    title: 'Department management',
    icon: WarehouseIcon,
    description: 'Manage departments within the organization',
  },
  teams: {
    title: 'Team management',
    icon: UsersThreeIcon,
    description: 'Manage teams within the organization',
  },
  employees: {
    title: 'Employee management',
    icon: FolderUserIcon,
    description: 'Manage employees within the organization',
  },
  reports: {
    title: 'Reports',
    icon: ChartLineUpIcon,
    description: 'Manage organization users reports',
  },
  'system-settings': {
    title: 'System settings',
    icon: SlidersHorizontalIcon,
    description: 'Manage organization system settings',
  },
  'employee-settings': {
    title: 'Employee settings',
    icon: UsersThreeIcon,
    description: 'Manage employee related system settings',
  },
  'roles-and-permissions-settings': {
    title: 'Roles and Permissions Settings',
    icon: LockKeyIcon,
    description: 'Manage roles and permissions within the organization',
  },
  'account-settings': {
    title: 'Account settings',
    icon: SlidersHorizontalIcon,
    description: 'Manage organization account settings',
  },

  // hrm module
  exemption: {
    title: 'Hrm Exemption',
    icon: ExcludeIcon,
    description: 'Manage HRM exemptions within the organization',
  },
  leave: {
    title: 'Hrm Leave',
    icon: DoorOpenIcon,
    description: 'Manage HRM leaves within the organization',
  },
  'hrm-reports': {
    title: 'Hrm Reports',
    icon: ChartLineUpIcon,
    description: 'Manage HRM reports within the organization',
  },
  'hrm-settings': {
    title: 'Hrm System Settings',
    icon: SlidersHorizontalIcon,
    description: 'Manage HRM system settings within the organization',
  },
  'leaves-settings': {
    title: 'Hrm Leaves Settings',
    icon: DoorOpenIcon,
    description: 'Manage HRM leaves settings within the organization',
  },
  'exemptions-settings': {
    title: 'Hrm Exemptions Approvals Settings',
    icon: ExcludeIcon,
    description:
      'Manage HRM exemptions settings approvals within the organization',
  },

  // attendance module
  'attendance-reports': {
    title: 'Attendance Reports',
    icon: ChartLineUpIcon,
    description:
      'Generate attendance reports, inspect records and export results',
  },
  workshift: {
    title: 'Attendance Workshifts',
    icon: CalendarDotsIcon,
    description: 'Manage weekly workshifts, assignments and employee calendars',
  },
  devices: {
    title: 'Attendance Devices',
    icon: DevicesIcon,
    description: 'Manage attendance devices within the organization',
  },
  scheduler: {
    title: 'Attendance Scheduler',
    icon: CalendarDotsIcon,
    description: 'Preview and assign employee schedules for specific dates',
  },

  // performance module
  'performance-reports': {
    title: 'Performance Reports',
    icon: ChartLineUpIcon,
    description:
      'Generate appraisal scorecard reports and inspect performance areas',
  },
  'performance-settings': {
    title: 'Performance System Settings',
    icon: SlidersHorizontalIcon,
    description: 'Manage performance system settings within the organization',
  },
  'appraisal-settings': {
    title: 'Performance Appraisal Settings',
    icon: SpeedometerIcon,
    description:
      'Manage performance appraisal settings within the organization',
  },
  training: {
    title: 'Performance Training',
    icon: ChalkboardTeacherIcon,
    description: 'Manage performance training within the organization',
  },
  'task-management': {
    title: 'Performance Task Management',
    icon: ClipboardTextIcon,
    description: 'Manage tasks within the organization',
  },
  board: {
    title: 'Project Kanban Board',
    icon: FingerprintIcon,
    description: 'View and manage tasks on the project kanban board',
  },
  feedback: {
    title: 'Performance Feedback',
    icon: TargetIcon,
    description: 'View and manage feedback surveys within the organization',
  },
  appraisal: {
    title: 'Performance Appraisal',
    icon: FilesIcon,
    description: 'View and manage appraisal groups within the organization',
  },
}

export const adminNavigation: TamsNavigation[] = [
  {
    id: 1,
    name: 'Dashboard',
    url: 'index',
    img: SquaresFourIcon,
    children: [],
  },
  {
    id: 2,
    name: 'Organization',
    url: '/organization',
    img: BuildingOfficeIcon,
    children: [
      {
        id: 7,
        name: 'Overview',
        url: 'index',
      },
      {
        id: 8,
        name: 'Branch',
        url: '/branch',
      },
      {
        id: 9,
        name: 'Department',
        url: '/department',
      },
      {
        id: 10,
        name: 'Teams',
        url: '/teams',
      },
      {
        id: 11,
        name: 'Employees',
        url: '/employees',
      },
      {
        id: 12,
        name: 'Reports',
        url: '/reports',
      },
      {
        id: 13,
        name: 'System settings',
        url: '/system-settings',
      },
    ],
  },
  {
    id: 3,
    name: 'HRM',
    url: '/hrm',
    img: UsersThreeIcon,
    children: [
      {
        id: 14,
        name: 'Overview',
        url: 'index',
      },
      {
        id: 8,
        name: 'Exemptions',
        url: '/exemption',
      },
      {
        id: 9,
        name: 'Leave',
        url: '/leave',
      },
      {
        id: 16,
        name: 'Reports',
        url: '/hrm-reports',
      },
      {
        id: 190,
        name: 'Settings',
        url: '/hrm-settings',
      },
    ],
  },
  {
    id: 4,
    name: 'Attendance',
    url: '/attendance',
    img: CalendarDotsIcon,
    children: [
      {
        id: 20,
        name: 'Overview',
        url: 'index',
      },
      {
        id: 21,
        name: 'Workshift',
        url: '/workshift',
      },
      {
        id: 22,
        name: 'Scheduler',
        url: '/scheduler',
      },
      {
        id: 23,
        name: 'Devices',
        url: '/devices',
      },
      ...(import.meta.env.NODE_ENV !== 'production'
        ? [
            {
              id: 25,
              name: 'Overtime',
              url: '/overtime',
            },
          ]
        : []),
      {
        id: 24,
        name: 'Reports',
        url: '/attendance-reports',
      },
    ],
  },
  {
    id: 9,
    name: 'Performance',
    url: '/performance',
    img: ChartLineUpIcon,
    children: [
      {
        id: 91,
        name: 'Overview',
        url: 'index',
      },
      {
        id: 92,
        name: 'Appraisal',
        url: '/appraisal',
      },
      {
        id: 93,
        name: 'Feedback',
        url: '/feedback',
      },
      {
        id: 95,
        name: 'Task Management',
        url: '/task-management',
      },
      {
        id: 96,
        name: 'Training',
        url: '/training',
      },
      {
        id: 94,
        name: 'Reports',
        url: '/report',
      },
      {
        id: 97,
        name: 'Settings',
        url: '/performance-settings',
      },
    ],
  },
  {
    id: 5,
    name: 'Payroll',
    url: '/admin/payroll',
    img: MoneyWavyIcon,
    children: [
      {
        id: 40,
        name: 'Dashboard',
        url: '/admin/payroll/dashboard',
      },
      {
        id: 41,
        name: 'Loan',
        url: '/admin/payroll/loan',
      },
      {
        id: 45,
        name: 'Pay-Package',
        url: '/admin/payroll/pay-package',
      },
      {
        id: 42,
        name: 'Payment-Management',
        url: '/admin/payroll/salary-management',
      },
      {
        id: 43,
        name: 'Benefit & Deduction',
        url: '/admin/payroll/benefit-deduction',
      },
      {
        id: 47,
        name: 'Payment Wallet',
        url: '/admin/payroll/payment-wallet',
      },
      {
        id: 44,
        name: 'Reports',
        url: '/admin/payroll/report',
      },
      {
        id: 46,
        name: 'Audit Trail',
        url: '/admin/payroll/audit-trail',
      },
    ],
  },
  {
    id: 10,
    name: 'Recruitment',
    url: '/admin/recruitment',
    img: FolderUserIcon,
    children: [
      {
        id: 101,
        name: 'Dashboard',
        url: '/admin/recruitment/dashboard',
      },
      {
        id: 102,
        name: 'Talent Requisition',
        url: '/admin/recruitment/talent-requisition',
      },
      {
        id: 103,
        name: 'Job Posting',
        url: '/admin/recruitment/job-posting',
      },
      {
        id: 104,
        name: 'Applicant Tracking System',
        url: '/admin/recruitment/tracking',
      },
      {
        id: 105,
        name: 'Recruiter Settings',
        url: '/admin/recruitment/settings',
      },
    ],
  },
]

export const essNavigation: TamsNavigation[] = [
  {
    id: 1,
    name: 'Home',
    url: 'index',
    img: SquaresFourIcon,
    hideSide: true,
    children: [],
  },
  {
    id: 99,
    url: '/change-password',
    name: 'changePassword',
    img: LockKeyIcon,
    hide: true,
    children: [
      {
        id: 130,
        name: 'Change Password',
        url: '',
        hide: true,
      },
    ],
  },
  // {
  //   id: 2,
  //   name: "Dashboard",
  //   url: "/ess/dashboard",
  //   img: "/img/dashboard-w.svg",
  //   children: []
  // },
  {
    id: 3,
    name: 'HRM',
    url: '/hrm',
    img: UsersThreeIcon,
    children: [
      {
        id: 8,
        name: 'Exemption',
        img: ExcludeIcon,
        url: '/exemption',
      },
      {
        id: 9,
        name: 'Leave',
        img: DoorOpenIcon,
        url: '/leave',
      },
      {
        id: 16,
        name: 'Reports',
        img: ChartLineUpIcon,
        url: '/hrm-reports',
      },
      ...(process.env.NODE_ENV !== 'production'
        ? [
            {
              id: 15,
              name: 'Appraisal',
              img: FilesIcon,
              url: '/appraisal',
            },
          ]
        : []),
    ],
  },
  {
    id: 4,
    name: 'Attendance',
    url: '/attendance',
    img: CalendarDotsIcon,
    children: [
      {
        id: 100,
        name: 'Calendar',
        url: '/calendar',
        img: CalendarDotsIcon,
      },
      {
        id: 132,
        name: 'Mobile Clocks',
        url: '/mobile-clocks',
        img: DevicesIcon,
      },
      {
        id: 102,
        name: 'Overtime',
        url: '/overtime',
        img: CalendarDotsIcon,
      },
      {
        id: 101,
        name: 'Reports',
        url: '/reports',
        img: ChartLineUpIcon,
      },
    ],
  },
  {
    id: 5,
    name: 'Payroll',
    url: '/payroll',
    img: MoneyWavyIcon,
    children: [
      {
        id: 40,
        name: 'Dashboard',
        url: '/dashboard',
        img: SquaresFourIcon,
      },
      {
        id: 41,
        name: 'Loan',
        url: '/loan',
        img: MoneyWavyIcon,
      },
      {
        id: 42,
        name: 'Payslip',
        url: '/payslip',
        img: FilesIcon,
      },
      {
        id: 44,
        name: 'Reports',
        url: '/report',
        img: ChartLineUpIcon,
      },
    ],
  },
  {
    id: 9,
    name: 'Performance',
    url: '/performance',
    img: ChartLineUpIcon,
    children: [
      {
        id: 91,
        name: 'Dashboard',
        url: '/dashboard',
        img: SquaresFourIcon,
      },
      {
        id: 92,
        name: 'Performance Appraisal',
        url: '/appraisal',
        img: FilesIcon,
      },
      {
        id: 93,
        name: 'Feedback',
        url: '/feedback',
        img: TargetIcon,
      },
      {
        id: 94,
        name: 'Task Management',
        url: '/task-management',
        img: ClipboardTextIcon,
      },
      {
        id: 95,
        name: 'Training',
        url: '/training',
        img: ChalkboardTeacherIcon,
      },
    ],
  },
  {
    id: 6,
    name: 'Canteen',
    url: '/canteen',
    img: BuildingOfficeIcon,
    children: [],
  },
  {
    id: 7,
    name: 'Support',
    url: '/support',
    img: DoorOpenIcon,
    hide: true,
    children: [
      {
        id: 120,
        name: '',
        url: '',
      },
    ],
  },
  {
    id: 12,
    name: 'Employees',
    url: '/profile',
    img: FolderUserIcon,
    hide: true,
    children: [
      {
        id: 600,
        name: 'Employees',
        url: '',
        hide: true,
      },
    ],
  },

  {
    id: 8,
    name: 'Activity History',
    url: '/activity-history',
    img: FingerprintIcon,
    children: [],
  },
]
