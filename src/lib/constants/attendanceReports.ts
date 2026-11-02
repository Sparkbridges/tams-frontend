import type { AttendanceReportDefinition } from '#/lib/types/api/attendanceReports'

const date = { value: 'checkdate', label: 'Date' }
const clockin = { value: 'clockin', label: 'Clock in' }
const clockout = { value: 'clockout', label: 'Clock out' }
const hours = { value: 'hours_worked', label: 'Hours worked' }
const shift = { value: 'shift_name', label: 'Shift' }
const summary = [
  { value: 'expected_total_hours', label: 'Expected hours' },
  { value: 'expected_total_days', label: 'Expected days' },
  hours,
  { value: 'days_clockin_and_out', label: 'Complete punch days' },
  { value: 'days_clockin_or_out', label: 'Days with punches' },
  { value: 'num_lateness', label: 'Late days' },
  { value: 'hours_late', label: 'Hours late' },
  { value: 'no_clockin', label: 'Missing clock-ins' },
  { value: 'no_clockout', label: 'Missing clock-outs' },
  { value: 'num_days_absent', label: 'Absent days (includes leave)' },
]

export const attendanceReportTypes: AttendanceReportDefinition[] = [
  {
    value: 'simple',
    label: 'Simple',
    description: 'Same-day first clock-in and last clock-out. Not shift-aware.',
    columns: [date, clockin, clockout, hours],
  },
  {
    value: 'workforce',
    label: 'Workforce',
    description: 'Saved shifts, actual punches and attendance status.',
    columns: [
      date,
      shift,
      clockin,
      clockout,
      { value: 'shift_date_start', label: 'Shift start date' },
      { value: 'shift_date_end', label: 'Shift end date' },
      { value: 'expected_work_hours', label: 'Expected hours' },
      hours,
      { value: 'status', label: 'Status' },
      { value: 'leave_status', label: 'Leave status' },
      { value: 'leave_type', label: 'Leave type' },
    ],
  },
  {
    value: 'lateness',
    label: 'Lateness',
    description: 'Clock-ins after the scheduled shift start.',
    columns: [
      date,
      shift,
      clockin,
      { value: 'expected_clockin', label: 'Expected clock-in' },
      { value: 'lost_time', label: 'Late duration' },
    ],
  },
  {
    value: 'earlyIn',
    label: 'Early In',
    description: 'Clock-ins before the scheduled shift start.',
    columns: [
      date,
      shift,
      clockin,
      { value: 'expected_clockin', label: 'Expected clock-in' },
      { value: 'gained_time', label: 'Early duration' },
    ],
  },
  {
    value: 'absentee',
    label: 'Absentee',
    description:
      'Absence against saved shifts, with approved leave identified.',
    columns: [
      date,
      shift,
      { value: 'shift_date_start', label: 'Shift start date' },
      { value: 'shift_date_end', label: 'Shift end date' },
      { value: 'leave_status', label: 'Leave status' },
      { value: 'leave_type', label: 'Leave type' },
    ],
  },
  {
    value: 'punctuality',
    label: 'Punctuality',
    description: 'Employee punctuality count and average clock-in.',
    employeeOnly: true,
    columns: [
      { value: 'num_punctuality', label: 'Punctual days' },
      { value: 'average_clocktime', label: 'Average clock-in' },
    ],
  },
  {
    value: 'summary',
    label: 'Attendance Summary',
    description: 'Employee totals over the selected attendance period.',
    employeeOnly: true,
    columns: [
      ...summary,
      { value: 'num_days_on_leave', label: 'Approved leave on absent dates' },
    ],
  },
  {
    value: 'logs',
    label: 'Logs',
    description: 'Individual device punches, without inferring worked hours.',
    columns: [
      date,
      { value: 'clocktime', label: 'Clock time' },
      { value: 'clocktype', label: 'Punch type' },
      { value: 'device_name', label: 'Device' },
      { value: 'serial_no', label: 'Serial number' },
      { value: 'upload_time', label: 'Upload time' },
    ],
  },
  {
    value: 'breaktime',
    label: 'Break Time',
    description: 'Paired and unpaired break punches and total break duration.',
    columns: [
      date,
      { value: 'first_break_out_readable', label: 'First break out' },
      { value: 'last_break_in_readable', label: 'Last break in' },
      { value: 'total_break_time', label: 'Total break time' },
      { value: 'break_sessions', label: 'Break sessions' },
      { value: 'completed_break_sessions', label: 'Completed sessions' },
      { value: 'unpaired_break_sessions', label: 'Unpaired sessions' },
    ],
  },
  {
    value: 'offday',
    label: 'Off Day',
    description: 'Explicit off days recorded in saved shifts.',
    columns: [date, shift],
  },
  {
    value: 'overtime_summary',
    label: 'Overtime Summary',
    description:
      'Attendance-derived extra hours; not an approved payment report.',
    employeeOnly: true,
    columns: [
      ...summary,
      { value: 'overtime_with_shift', label: 'Overtime with shift' },
      { value: 'overtime_without_shift', label: 'Overtime without shift' },
    ],
  },
  {
    value: 'overtime',
    label: 'Approved Overtime',
    description: 'Approved overtime hours and amounts from overtime records.',
    employeeOnly: true,
    columns: [
      { value: 'date', label: 'Date' },
      { value: 'overtime_in_hour', label: 'Overtime hours' },
      { value: 'pay_per_hour', label: 'Rate per hour' },
      { value: 'amount', label: 'Amount' },
    ],
  },
]

export const attendanceEmployeeColumns = [
  { value: 'pin', label: 'PIN' },
  { value: 'name', label: 'Employee' },
  { value: 'branch', label: 'Branch' },
  { value: 'department', label: 'Department' },
]

export const attendanceOvertimeTotalColumns = [
  { value: 'total_overtime_hour', label: 'Approved overtime hours' },
  { value: 'total_amount', label: 'Approved amount' },
]
