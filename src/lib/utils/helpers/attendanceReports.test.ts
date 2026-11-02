import { describe, expect, it } from 'vitest'
import {
  attendanceExportRows,
  flattenAttendanceReports,
  reportCell,
} from './attendanceReports'

describe('attendance report normalization', () => {
  it('flattens employee days without losing zero values or long durations', () => {
    const rows = flattenAttendanceReports(
      [
        {
          employee_details: { name: 'Ada', pin: 12, station_name: 'HQ' },
          days: [
            {
              checkdate: '2026-11-02',
              hours_worked: '126:30:00',
              missing_clockout: 0,
            },
          ],
        },
      ],
      'workforce',
    )
    expect(rows).toEqual([
      {
        name: 'Ada',
        pin: 12,
        station_name: 'HQ',
        branch: 'HQ',
        checkdate: '2026-11-02',
        hours_worked: '126:30:00',
        missing_clockout: 0,
      },
    ])
    expect(reportCell(rows[0].hours_worked)).toBe('126:30:00')
    expect(reportCell(rows[0].missing_clockout)).toBe(0)
  })
  it('flattens date groups and preserves individual raw log punches', () => {
    const employees = [
      {
        employee_details: { name: 'Ada', pin: 12 },
        clocktime: '08:00:00',
        clocktype: '0',
      },
      {
        employee_details: { name: 'Ada', pin: 12 },
        clocktime: '08:01:00',
        clocktype: '0',
      },
    ]
    const rows = flattenAttendanceReports(
      [{ date: '2026-11-02', employees }],
      'logs',
    )
    expect(rows).toHaveLength(2)
    expect(rows[1]).toMatchObject({
      name: 'Ada',
      checkdate: '2026-11-02',
      clocktime: '08:01:00',
    })
  })
  it('does not turn missing punches or unscheduled days into zero hours or absence', () => {
    const rows = flattenAttendanceReports(
      [
        {
          employee_details: { name: 'Ada' },
          days: [{ checkdate: '2026-11-02', clockout: null }],
        },
      ],
      'simple',
    )
    expect(reportCell(rows[0].clockout)).toBe('Not available')
    expect(rows[0].hours_worked).toBeUndefined()
    expect(rows[0].status).toBeUndefined()
  })
  it('preserves aggregate summary metrics without calculating new totals', () => {
    const rows = flattenAttendanceReports(
      [
        {
          employee_details: { name: 'Ada', pin: 12 },
          hours_worked: '200:00:00',
          num_days_absent: 0,
          num_days_on_leave: 2,
        },
      ],
      'summary',
    )
    expect(rows[0]).toMatchObject({
      name: 'Ada',
      hours_worked: '200:00:00',
      num_days_absent: 0,
      num_days_on_leave: 2,
    })
  })
  it('keeps approved overtime separate from attendance-derived overtime', () => {
    const rows = flattenAttendanceReports(
      [
        {
          employee_details: { name: 'Ada' },
          overtime_reports: [
            { date: '2026-11-02', overtime_in_hour: 2.5, amount: 1250 },
          ],
        },
      ],
      'overtime',
    )
    expect(rows[0]).toMatchObject({
      name: 'Ada',
      overtime_in_hour: 2.5,
      amount: 1250,
    })
  })
  it('resolves requested employee aliases without exporting nested relation objects', () => {
    const rows = flattenAttendanceReports(
      [
        {
          employee_details: {
            name: 'Ada',
            branch: { station_name: 'HQ' },
            department: { department_name: 'HR' },
          },
          days: [{ checkdate: '2026-11-02' }],
        },
      ],
      'simple',
    )
    expect(rows[0]).toMatchObject({
      name: 'Ada',
      branch: 'HQ',
      department: 'HR',
    })
  })
  it('exports selected scalar columns rather than object-valued report cells', () => {
    expect(
      attendanceExportRows(
        [{ name: 'Ada', num_days_absent: 0 }],
        [
          { value: 'name', label: 'Employee' },
          { value: 'num_days_absent', label: 'Absent days' },
        ],
      ),
    ).toEqual([{ Employee: 'Ada', 'Absent days': 0 }])
    expect(() =>
      flattenAttendanceReports([{ days: [null] }], 'simple'),
    ).toThrow('Invalid attendance report record')
  })
})
