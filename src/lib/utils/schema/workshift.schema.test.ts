import { describe, expect, it } from 'vitest'
import {
  clockSchema,
  rosterFilterSchema,
  shiftTypesSchema,
  workshiftAssignmentSchema,
  workshiftSchema,
} from './workshift.schema'

const shift = {
  name: 'Day shift',
  branch_id: '4',
  excludeWeekend: false,
  shift_days: Array.from({ length: 7 }, (_, index) => ({
    day_id: index + 1,
    shift_type_id: '2',
  })),
}
const type = {
  id: 2,
  name: 'Morning',
  day_span: 1,
  shift_start: '09:00:00',
  shift_end: '17:00:00',
  color_code: '#066aff',
}
const roster = {
  fetch_by: 'company',
  fetch_by_id: [7],
  start_date: '2026-10-01',
  end_date: '2026-10-31',
}

describe('work shift validation', () => {
  it('accepts branch or all-branch shifts with weekdays or weekends', () => {
    expect(workshiftSchema.safeParse(shift).success).toBe(true)
    expect(
      workshiftSchema.safeParse({ ...shift, branch_id: 'all' }).success,
    ).toBe(true)
    expect(
      workshiftSchema.safeParse({
        ...shift,
        excludeWeekend: true,
        shift_days: shift.shift_days.slice(0, 5),
      }).success,
    ).toBe(true)
  })
  it.each(['', '0', '-1', 'abc'])(
    'rejects invalid branch ID %s',
    (branch_id) => {
      expect(workshiftSchema.safeParse({ ...shift, branch_id }).success).toBe(
        false,
      )
    },
  )
  it('rejects missing shift days and unselected shift types', () => {
    expect(
      workshiftSchema.safeParse({ ...shift, shift_days: [] }).success,
    ).toBe(false)
    expect(
      workshiftSchema.safeParse({
        ...shift,
        shift_days: [{ day_id: 8, shift_type_id: '' }],
      }).success,
    ).toBe(false)
  })
  it('strips display labels from assignment payloads', () => {
    expect(
      workshiftAssignmentSchema.parse({
        regular_shift_id: 3,
        assignables: [{ type: 'department', type_id: 8, type_name: 'HR' }],
      }),
    ).toEqual({
      regular_shift_id: 3,
      assignables: [{ type: 'department', type_id: 8 }],
    })
  })
  it('rejects empty assignment batches and invalid recipient IDs', () => {
    expect(
      workshiftAssignmentSchema.safeParse({
        regular_shift_id: 3,
        assignables: [],
      }).success,
    ).toBe(false)
    expect(
      workshiftAssignmentSchema.safeParse({
        regular_shift_id: 3,
        assignables: [{ type: 'employee', type_id: 0 }],
      }).success,
    ).toBe(false)
  })
})
describe('shift types and clock windows', () => {
  it('preserves overnight and multi-day shifts', () => {
    expect(
      shiftTypesSchema.safeParse({
        shift_types: [
          {
            ...type,
            day_span: 2,
            shift_start: '22:00:00',
            shift_end: '06:00:00',
          },
        ],
      }).success,
    ).toBe(true)
  })
  it('normalizes browser time inputs and removes UI-only keys', () => {
    expect(
      shiftTypesSchema.parse({
        shift_types: [{ ...type, shift_start: '09:30', key: 'ui' }],
      }).shift_types,
    ).toEqual([{ ...type, shift_start: '09:30:00' }])
  })
  it.each(['24:00:00', '25:01', '', '00:00:00', '00:00'])(
    'rejects invalid or silently-discarded start time %s',
    (shift_start) => {
      expect(
        shiftTypesSchema.safeParse({ shift_types: [{ ...type, shift_start }] })
          .success,
      ).toBe(false)
    },
  )
  it.each([0, 15, 1.5])('rejects unsupported day span %s', (day_span) => {
    expect(
      shiftTypesSchema.safeParse({ shift_types: [{ ...type, day_span }] })
        .success,
    ).toBe(false)
  })
  it('validates the actual service clock-hour limits including zero', () => {
    const clock = {
      clock_in: { hours_before_start: 0, hours_after_start: 30 },
      clock_out: { hours_before_start: 3, hours_after_start: 3 },
    }
    expect(clockSchema.safeParse(clock).success).toBe(true)
    expect(
      clockSchema.safeParse({
        ...clock,
        clock_in: { hours_before_start: -1, hours_after_start: 31 },
      }).success,
    ).toBe(false)
  })
})
describe('roster filters', () => {
  it('accepts all four recipient modes and requires department branch context', () => {
    for (const fetch_by of ['company', 'branch', 'employee']) {
      expect(
        rosterFilterSchema.safeParse({ ...roster, fetch_by }).success,
      ).toBe(true)
    }
    expect(
      rosterFilterSchema.safeParse({ ...roster, fetch_by: 'department' })
        .success,
    ).toBe(false)
    expect(
      rosterFilterSchema.safeParse({
        ...roster,
        fetch_by: 'department',
        branch_id: 4,
      }).success,
    ).toBe(true)
  })
  it('rejects empty recipients, invalid calendar dates and reversed ranges', () => {
    expect(
      rosterFilterSchema.safeParse({ ...roster, fetch_by_id: [] }).success,
    ).toBe(false)
    expect(
      rosterFilterSchema.safeParse({ ...roster, start_date: '2026-02-30' })
        .success,
    ).toBe(false)
    expect(
      rosterFilterSchema.safeParse({ ...roster, start_date: '2026-11-01' })
        .success,
    ).toBe(false)
  })
})
