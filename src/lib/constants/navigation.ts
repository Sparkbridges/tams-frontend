import {
  BuildingOfficeIcon,
  CalendarDotsIcon,
  ChartLineUpIcon,
  FolderUserIcon,
  MoneyWavyIcon,
  SquaresFourIcon,
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
        url: 'system-settings',
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
        name: 'Dashboard',
        url: 'index',
      },
      {
        id: 8,
        name: 'Exemption',
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
        url: '/reports',
      },
      ...(import.meta.env.NODE_ENV !== 'production'
        ? [
            {
              id: 15,
              name: 'Appraisal',
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
        url: '/admin/attendance/scheduler',
      },
      {
        id: 23,
        name: 'Devices',
        url: '/admin/attendance/devices',
      },
      {
        id: 25,
        name: 'Overtime',
        url: '/admin/attendance/overtime',
      },
      {
        id: 24,
        name: 'Reports',
        url: '/admin/attendance/reports',
      },
    ],
  },
  {
    id: 9,
    name: 'Performance',
    url: '/admin/performance',
    img: ChartLineUpIcon,
    children: [
      {
        id: 91,
        name: 'Dashboard',
        url: '/admin/performance/dashboard',
      },
      {
        id: 92,
        name: 'Performance Appraisal',
        url: '/admin/performance/appraisal',
      },
      {
        id: 93,
        name: 'Feedback',
        url: '/admin/performance/feedback',
      },
      {
        id: 94,
        name: 'Reports',
        url: '/admin/performance/report',
      },
      {
        id: 95,
        name: 'Task Management',
        url: '/admin/performance/task-management',
      },
      {
        id: 96,
        name: 'Training',
        url: '/admin/performance/training',
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

export const essNavigation = [
  {
    id: 1,
    name: 'Home',
    url: '/ess/home',
    img: '/img/home-w.svg',
    hideSide: true,
    children: [],
  },
  {
    id: 99,
    url: '/ess/change-password',
    name: 'changePassword',
    img: 'img/password.svg',
    hide: true,
    children: [
      {
        id: 130,
        name: 'Change Password',
        url: '',
        img: '',
        hide: true,
      },
    ],
    // hide: true,
    // showSub: true
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
    url: '/ess/hrm',
    img: '/img/hrm.svg',
    children: [
      {
        id: 8,
        name: 'Exemption',
        img: '/img/exemption-w.svg',
        url: '/ess/hrm/exemption',
      },
      {
        id: 9,
        name: 'Leave',
        img: '/img/leave-w.svg',
        url: '/ess/hrm/leave',
      },
      {
        id: 16,
        name: 'Reports',
        img: '/img/reports.svg',
        url: '/ess/hrm/reports',
      },
      ...(process.env.NODE_ENV !== 'production'
        ? [
            {
              id: 15,
              name: 'Appraisal',
              img: '/img/appraisal-w.svg',
              url: '/ess/hrm/appraisal',
            },
          ]
        : []),
    ],
  },
  {
    id: 4,
    name: 'Attendance',
    url: '/ess/attendance',
    img: '/img/attendance.svg',
    children: [
      {
        id: 100,
        name: 'Calendar',
        url: '/ess/attendance/calendar',
        img: '/img/calendar-w.svg',
      },

      {
        id: 132,
        name: 'Mobile Clocks',
        url: '/ess/attendance/mobile-clocks',
        img: '/img/mobile-clocks.svg',
      },
      {
        id: 102,
        name: 'Overtime',
        url: '/ess/attendance/overtime',
        img: '/img/overtime.svg',
      },
      {
        id: 101,
        name: 'Reports',
        url: '/ess/attendance/reports',
        img: '/img/reports.svg',
      },
    ],
  },
  {
    id: 5,
    name: 'Payroll',
    url: '/ess/payroll',
    img: '/img/payroll.svg',
    children: [
      {
        id: 40,
        name: 'Dashboard',
        url: '/ess/payroll/dashboard',
        img: '/img/dashboard-w.svg',
      },
      {
        id: 41,
        name: 'Loan',
        url: '/ess/payroll/loan',
        img: '/img/loan.png',
      },
      {
        id: 42,
        name: 'Payslip',
        url: '/ess/payroll/payslip',
        img: '/img/pay-package.svg',
      },
      {
        id: 44,
        name: 'Reports',
        url: '/ess/payroll/report',
        img: '/img/reports.svg',
      },
    ],
  },
  {
    id: 9,
    name: 'Performance',
    url: '/ess/performance',
    img: '/img/performance.svg',
    children: [
      {
        id: 91,
        name: 'Dashboard',
        url: '/ess/performance/dashboard',
        img: '/img/dashboard-w.svg',
      },
      {
        id: 92,
        name: 'Performance Appraisal',
        url: '/ess/performance/appraisal',
        img: '/img/appraisal.svg',
      },
      {
        id: 93,
        name: 'Feedback',
        url: '/ess/performance/feedback',
        img: '/img/feedback-w.svg',
      },
      {
        id: 94,
        name: 'Task Management',
        url: '/ess/performance/task-management',
        img: '/img/task.svg',
      },
      {
        id: 95,
        name: 'Training',
        url: '/ess/performance/training',
        img: '/img/training.svg',
      },
    ],
  },
  {
    id: 6,
    name: 'Canteen',
    url: '/ess/canteen',
    img: '/img/canteen.svg',
    children: [],
  },
  {
    id: 7,
    name: 'Support',
    url: '/ess/support',
    img: '/img/leave-w.svg',
    hide: true,
    children: [
      {
        id: 120,
        name: '',
        url: '',
        img: '',
      },
    ],
  },
  {
    id: 12,
    name: 'Employees',
    url: '/ess/profile',
    img: '',
    hide: true,
    children: [
      {
        id: 600,
        name: 'Employees',
        url: '',
        img: '',
        hide: true,
      },
    ],
  },

  {
    id: 8,
    name: 'Activity History',
    url: '/ess/activity-history',
    img: '/img/time-history.svg',
    children: [],
  },
]
