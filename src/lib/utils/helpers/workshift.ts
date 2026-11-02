import type { CalendarDay, RosterResult } from '#/lib/types/api/workshift'

export function calendarMonthRange(year: number, month: number) {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  const date = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
  return { date_start: date(start), date_end: date(end) }
}

export function calendarCells(
  year: number,
  month: number,
  days: CalendarDay[],
) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  return {
    offset,
    days: Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, index) => {
        const day = index + 1
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return {
          day,
          date,
          shift: days.find(
            (item) => item.shift_date_start.slice(0, 10) === date,
          ),
        }
      },
    ),
  }
}

export function rosterTableRows(data: RosterResult) {
  return data.results.map((employee, index) => ({
    id: `${employee.pin ?? 'no-pin'}:${index}`,
    pin: employee.pin ?? 'No PIN',
    name: employee.name,
    ...Object.fromEntries(
      data.rosterDates.map((date) => [
        date.date,
        employee.roster.find(
          (shift) =>
            shift.shift_date_start.slice(0, 10) === date.date.slice(0, 10),
        )?.shift ?? 'NA',
      ]),
    ),
  }))
}
