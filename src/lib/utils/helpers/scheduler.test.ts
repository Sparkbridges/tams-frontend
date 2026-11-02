import { describe, expect, it } from 'vitest'
import { expandSchedule, schedulePreview } from './scheduler'
import { schedulerFormSchema } from '../schema/scheduler.schema'
import { shiftCalendarEvents, shiftCalendarRange } from './shiftCalendar'

const base = {
  employees: ['1', '2'],
  shift_type_id: '0',
  start_date: '2026-11-02',
  end_date: '2026-11-08',
  repeat: 'weekly' as const,
  weekdays: ['1', '3'],
  on_conflict: 'skip' as const,
}
describe('schedule repeats and preview', () => {
  it('expands selected weekdays inclusively for each employee and keeps off-day zero', () => {
    const rows = expandSchedule(base)
    expect(rows).toHaveLength(4)
    expect(rows.map((row) => row.shift_date_start)).toEqual([
      '2026-11-02',
      '2026-11-04',
      '2026-11-02',
      '2026-11-04',
    ])
    expect(rows.every((row) => row.shift_type_id === 0)).toBe(true)
  })
  it('does not repeat a one-off even when an old end date is earlier', () => {
    const values = { ...base, repeat: 'once' as const, end_date: '2026-10-01' }
    expect(schedulerFormSchema.safeParse(values).success).toBe(true)
    expect(expandSchedule(values)).toHaveLength(2)
  })
  it('accepts exactly 93 days and 100 employees but not 94 days or 101 employees', () => {
    const values = {
      ...base,
      repeat: 'daily' as const,
      end_date: '2027-02-02',
      employees: Array.from({ length: 100 }, (_, index) => String(index + 1)),
    }
    expect(schedulerFormSchema.safeParse(values).success).toBe(true)
    expect(
      schedulerFormSchema.safeParse({ ...values, end_date: '2027-02-03' })
        .success,
    ).toBe(false)
    expect(
      schedulerFormSchema.safeParse({
        ...values,
        employees: [...values.employees, '101'],
      }).success,
    ).toBe(false)
  })
  it('daily repetition crosses year boundaries without inventing dates', () => {
    const rows = expandSchedule({
      ...base,
      employees: ['1'],
      repeat: 'daily',
      start_date: '2026-12-31',
      end_date: '2027-01-02',
    })
    expect(rows.map((row) => row.shift_date_start)).toEqual([
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
    ])
  })
  it.each([
    { end_date: '2026-10-01' },
    { end_date: '2027-05-01' },
    { weekdays: [] },
    { employees: [] },
    { shift_type_id: '' },
  ])('rejects invalid bounded repeats %j', (change) => {
    expect(schedulerFormSchema.safeParse({ ...base, ...change }).success).toBe(
      false,
    )
  })
  it('matches conflicts by employee and date, including off days', () => {
    const rows = schedulePreview(expandSchedule(base), [
      {
        employee_id: 1,
        pin: 42,
        name: 'Ada',
        shift_days: [{ shift_type_id: 0, shift_date_start: '2026-11-04' }],
      },
    ])
    expect(rows[1].existing).toBe('Off day')
    expect(rows[3].existing).toBeNull()
  })
})
describe('saved calendar event mapping', () => {
  it('ignores placeholders, preserves off days and represents overnight shifts across midnight', () => {
    const rows = shiftCalendarEvents([
      { shift: 'NA', shift_date_start: '2026-11-01' },
      { shift_type_id: 0, shift_date_start: '2026-11-02' },
      {
        shift_type_id: 2,
        shift_type_name: 'Night',
        shift_date_start: '2026-11-03',
        shift_start: '22:00:00',
        shift_end: '06:00:00',
      },
    ])
    expect(rows).toHaveLength(2)
    expect(rows[0].title).toBe('Off day')
    expect(rows[1].end).toBe('2026-11-04 06:00:00')
  })
  it('uses the saved end date for multi-day shifts', () => {
    expect(
      shiftCalendarEvents([
        {
          shift_type_id: 3,
          shift_date_start: '2026-11-03',
          shift_date_end: '2026-11-05',
          shift_start: '09:00:00',
          shift_end: '17:00:00',
        },
      ])[0].end,
    ).toBe('2026-11-05 17:00:00')
  })
  it('fetches adjacent month cells and carry-over days, and full years for year view', () => {
    expect(shiftCalendarRange('2026-11-02', 'month')).toEqual({
      date_start: '2026-10-18',
      date_end: '2026-12-07',
    })
    expect(shiftCalendarRange('2026-11-02', 'year')).toEqual({
      date_start: '2025-12-18',
      date_end: '2027-01-07',
    })
  })
})
