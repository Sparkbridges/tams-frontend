import dayjs from 'dayjs'
import type { z } from 'zod/v4'
import type {
  ScheduleAssignment,
  SchedulerEmployee,
} from '#/lib/types/api/scheduler'
import type { schedulerFormSchema } from '../schema/scheduler.schema'

export function expandSchedule(
  values: z.infer<typeof schedulerFormSchema>,
): ScheduleAssignment[] {
  const dates: string[] = []
  const end = values.repeat === 'once' ? values.start_date : values.end_date
  for (
    let date = dayjs(values.start_date);
    !date.isAfter(end, 'day');
    date = date.add(1, 'day')
  ) {
    if (
      values.repeat !== 'weekly' ||
      values.weekdays.includes(String(date.day()))
    ) {
      dates.push(date.format('YYYY-MM-DD'))
    }
    if (values.repeat === 'once') break
  }
  return [...new Set(values.employees)].flatMap((employee) =>
    dates.map((shift_date_start) => ({
      employee_id: Number(employee),
      shift_type_id: Number(values.shift_type_id),
      shift_date_start,
    })),
  )
}

export function schedulePreview(
  assignments: ScheduleAssignment[],
  employees: SchedulerEmployee[],
) {
  return assignments.map((assignment) => {
    const employee = employees.find(
      (item) => item.employee_id === assignment.employee_id,
    )
    const existing = employee?.shift_days.find(
      (day) =>
        day.shift_date_start.slice(0, 10) === assignment.shift_date_start,
    )
    return {
      ...assignment,
      name: employee?.name ?? `Employee #${assignment.employee_id}`,
      existing: existing
        ? existing.shift_type_id === 0
          ? 'Off day'
          : (existing.shift_type_name ?? 'Assigned shift')
        : null,
    }
  })
}
