import { useState } from 'react'
import dayjs from 'dayjs'
import { z } from 'zod/v4'
import { useSchedules, useSchedulerAccess } from '#/lib/api/services/scheduler'
import type {
  SchedulerEmployee,
  SchedulerParams,
} from '#/lib/types/api/scheduler'
import type { TamsTableColumn } from '#/lib/types'
import type { ShiftRecipientsValue } from '#/components/organisms/attendance/ShiftRecipients'

const filtersSchema = z
  .object({
    start_date: z.iso.date(),
    end_date: z.iso.date(),
  })
  .refine(
    (value) =>
      value.end_date >= value.start_date &&
      dayjs(value.end_date).diff(value.start_date, 'day') < 93,
    { message: 'Choose a period of 1 to 93 days' },
  )

export default function useHandleAttendanceScheduler() {
  const access = useSchedulerAccess()
  const [recipients, setRecipients] = useState<ShiftRecipientsValue>({
    type: 'company',
    ids: [],
    branchId: null,
  })
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().startOf('month').format('YYYY-MM-DD'),
  )
  const [endDate, setEndDate] = useState<string | null>(
    dayjs().endOf('month').format('YYYY-MM-DD'),
  )
  const [params, setParams] = useState<SchedulerParams | null>(null)
  const [error, setError] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState<
    SchedulerEmployee[]
  >([])
  const query = useSchedules(params)
  const columns: TamsTableColumn[] = [
    ...(access.canSave
      ? [{ label: '', accessor: 'select', type: 'checkbox' as const }]
      : []),
    { label: 'Employee', accessor: 'name' },
    { label: 'PIN', accessor: 'pin' },
    ...(query.data?.data.dates.map((date) => ({
      label: dayjs(date.date).format('DD MMM'),
      accessor: date.date,
    })) ?? []),
  ]
  const tableData =
    query.data?.data.results.map((employee) => ({
      id: employee.employee_id,
      name: employee.name,
      pin: employee.pin ?? 'No PIN',
      ...Object.fromEntries(
        (query.data?.data.dates ?? []).map((date) => {
          const shift = employee.shift_days.find(
            (day) => day.shift_date_start.slice(0, 10) === date.date,
          )
          return [
            date.date,
            shift
              ? shift.shift_type_id === 0
                ? 'Off day'
                : (shift.shift_type_name ?? 'Assigned shift')
              : 'No saved schedule',
          ]
        }),
      ),
    })) ?? []
  const handleGenerate = () => {
    const parsed = filtersSchema.safeParse({
      start_date: startDate,
      end_date: endDate,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (
      recipients.type === 'department' ||
      (recipients.type !== 'company' && !recipients.ids.length)
    ) {
      setError('Select branches or individual employees')
      return
    }
    setError('')
    setParams({
      ...parsed.data,
      page: 1,
      perPage: 10,
      fetch_by: recipients.type,
      ...(recipients.type !== 'company'
        ? { fetch_by_id: recipients.ids.map(Number) }
        : {}),
    })
  }
  const handleAssign = (ids: number[]) => {
    setSelectedEmployees(
      query.data?.data.results.filter((employee) =>
        ids.includes(employee.employee_id),
      ) ?? [],
    )
  }
  return {
    access,
    recipients,
    setRecipients,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    params,
    setParams,
    error,
    query,
    columns,
    tableData,
    handleGenerate,
    handleAssign,
    selectedEmployees,
    closeAssignment: () => setSelectedEmployees([]),
  }
}
