import { describe, expect, it } from 'vitest'
import { attendanceReportSchema } from './attendanceReports.schema'
import type { AttendanceReportParams } from '#/lib/types/api/attendanceReports'

export const reportParams: AttendanceReportParams = {
  type: 'simple',
  fetch_by: 'branch',
  fetch_by_id: 'all',
  branch_id: 'all',
  columns: ['pin', 'name'],
  date_from: '2026-11-01',
  date_to: '2026-11-30',
  group_by: 'employee',
  exclude_weekend: false,
  exclude_public_holiday: false,
  only_sunday: false,
  hourly_view: false,
  page: 1,
  per_page: 10,
}

describe('attendance report filter validation', () => {
  it('accepts inclusive valid dates and canonical earlyIn', () => {
    expect(
      attendanceReportSchema.safeParse({ ...reportParams, type: 'earlyIn' })
        .success,
    ).toBe(true)
    expect(
      attendanceReportSchema.safeParse({
        ...reportParams,
        date_from: '2026-11-02',
        date_to: '2026-11-02',
      }).success,
    ).toBe(true)
  })
  it.each([
    { date_from: '2026-02-30' },
    { date_to: '2026-10-31' },
    { date_to: '2027-02-02' },
    { page: 0 },
    { per_page: 101 },
    { fetch_by: 'employee', fetch_by_id: 'all' },
    { fetch_by_id: [] },
    { fetch_by: 'department', fetch_by_id: [5], branch_id: undefined },
    { only_sunday: true, exclude_weekend: true },
    { type: 'earlyOut' },
  ])('rejects invalid filters %j', (invalid) => {
    expect(
      attendanceReportSchema.safeParse({ ...reportParams, ...invalid }).success,
    ).toBe(false)
  })
  it('allows exactly 93 days but not 94', () => {
    expect(
      attendanceReportSchema.safeParse({
        ...reportParams,
        date_from: '2026-01-01',
        date_to: '2026-04-03',
      }).success,
    ).toBe(true)
    expect(
      attendanceReportSchema.safeParse({
        ...reportParams,
        date_from: '2026-01-01',
        date_to: '2026-04-04',
      }).success,
    ).toBe(false)
  })
})
