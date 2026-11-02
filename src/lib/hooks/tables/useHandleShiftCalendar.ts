import { useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import type { ScheduleViewLevel } from '@mantine/schedule'
import dayjs from 'dayjs'
import {
  useShiftCalendar,
  useShiftEmployeeSearch,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import { useTamsStore } from '#/lib/store'
import {
  shiftCalendarEvents,
  shiftCalendarRange,
} from '#/lib/utils/helpers/shiftCalendar'

export default function useHandleShiftCalendar() {
  const { canView } = useWorkshiftAccess()
  const user = useTamsStore((state) => state.user)
  const [employee, setEmployee] = useState({
    value: String(user?.employee.id ?? ''),
    label: user?.name ?? 'My calendar',
  })
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [view, setView] = useState<ScheduleViewLevel>('month')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 300)
  const employees = useShiftEmployeeSearch(canView ? debounced : '')
  const query = useShiftCalendar({
    employee_id: Number(employee.value),
    ...shiftCalendarRange(date, view),
  })
  const days = query.data?.data ?? []
  const events = shiftCalendarEvents(days)
  const selected = days.find(
    (day) => day.shift_date_start.slice(0, 10) === selectedDate,
  )
  const options = [
    employee,
    ...(employees.data?.data
      .filter((item) => String(item.id) !== employee.value)
      .map((item) => ({ value: String(item.id), label: item.name })) ?? []),
  ]
  return {
    canView,
    employee,
    setEmployee,
    date,
    setDate,
    view,
    setView,
    selectedDate,
    setSelectedDate,
    search,
    setSearch,
    employees,
    query,
    events,
    selected,
    options,
  }
}
