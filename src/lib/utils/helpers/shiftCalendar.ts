import dayjs from 'dayjs'
import type { ScheduleEventData, ScheduleViewLevel } from '@mantine/schedule'
import type { CalendarDay } from '#/lib/types/api/workshift'

export function shiftCalendarRange(date: string, view: ScheduleViewLevel) {
  const unit = view === 'year' ? 'year' : 'month'
  return {
    date_start: dayjs(date)
      .startOf(unit)
      .subtract(14, 'day')
      .format('YYYY-MM-DD'),
    date_end: dayjs(date).endOf(unit).add(7, 'day').format('YYYY-MM-DD'),
  }
}

export function shiftCalendarEvents(days: CalendarDay[]): ScheduleEventData[] {
  return days
    .filter((day) => day.shift !== 'NA' && day.shift_type_id !== undefined)
    .map((day) => {
      const date = day.shift_date_start.slice(0, 10)
      const off = day.shift_type_id === 0
      const start = `${date} ${off ? '00:00:00' : (day.shift_start ?? '00:00:00')}`
      let end = off
        ? `${dayjs(date).add(1, 'day').format('YYYY-MM-DD')} 00:00:00`
        : `${day.shift_date_end?.slice(0, 10) ?? date} ${day.shift_end ?? '00:00:00'}`
      if (!off && !dayjs(end).isAfter(start)) {
        end = dayjs(end).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      }
      return {
        id: date,
        title: off ? 'Off day' : (day.shift_type_name ?? 'Assigned shift'),
        start,
        end,
        color: off ? 'gray' : (day.color_code ?? 'blue'),
      }
    })
}
