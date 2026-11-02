import { describe, expect, it } from 'vitest'
import { calendarCells, calendarMonthRange, rosterTableRows } from './workshift'

describe('work shift date presentation', () => {
  it('calculates month boundaries across leap years and year changes', () => {
    expect(calendarMonthRange(2024, 1)).toEqual({
      date_start: '2024-02-01',
      date_end: '2024-02-29',
    })
    expect(calendarMonthRange(2026, 1)).toEqual({
      date_start: '2026-02-01',
      date_end: '2026-02-28',
    })
    expect(calendarMonthRange(2026, 12)).toEqual({
      date_start: '2027-01-01',
      date_end: '2027-01-31',
    })
    expect(calendarMonthRange(2026, -1)).toEqual({
      date_start: '2025-12-01',
      date_end: '2025-12-31',
    })
  })
  it('starts Monday in column one and Sunday in column seven', () => {
    expect(calendarCells(2026, 5, []).offset).toBe(0)
    expect(calendarCells(2026, 1, []).offset).toBe(6)
  })
  it('places unsorted service shifts by their actual dates rather than array position', () => {
    const morning = {
      shift_date_start: '2026-10-03T00:00:00.000Z',
      shift_type_name: 'Morning',
    }
    const cells = calendarCells(2026, 9, [morning])
    expect(cells.days).toHaveLength(31)
    expect(cells.days[0].shift).toBeUndefined()
    expect(cells.days[2].shift).toBe(morning)
  })
  it('aligns sparse roster entries by date and marks missing dates NA', () => {
    const rows = rosterTableRows({
      results: [
        {
          pin: null,
          name: 'Ada',
          roster: [
            { shift: 'Night', shift_date_start: '2026-10-02T00:00:00Z' },
          ],
        },
      ],
      total: 1,
      rosterDates: [
        { date: '2026-10-01', readable_date: '1 Oct', is_past: false },
        { date: '2026-10-02', readable_date: '2 Oct', is_past: false },
      ],
    })
    expect(rows[0]).toMatchObject({
      name: 'Ada',
      pin: 'No PIN',
      '2026-10-01': 'NA',
      '2026-10-02': 'Night',
    })
  })
})
