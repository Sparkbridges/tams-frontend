import { z } from 'zod/v4'
import dayjs from 'dayjs'

export const schedulerFormSchema = z
  .object({
    employees: z
      .array(z.string().regex(/^[1-9]\d*$/))
      .min(1, 'Select employees')
      .max(100, 'Select at most 100 employees'),
    shift_type_id: z.string().regex(/^\d+$/, 'Select a shift type'),
    start_date: z.iso.date(),
    end_date: z.iso.date(),
    repeat: z.enum(['once', 'daily', 'weekly']),
    weekdays: z.array(z.string().regex(/^[0-6]$/)),
    on_conflict: z.enum(['skip', 'replace']),
  })
  .refine(
    (value) => value.repeat === 'once' || value.end_date >= value.start_date,
    {
      path: ['end_date'],
      message: 'End date must be on or after start date',
    },
  )
  .refine(
    (value) =>
      value.repeat === 'once' ||
      dayjs(value.end_date).diff(value.start_date, 'day') < 93,
    {
      path: ['end_date'],
      message: 'Choose a period of at most 93 days',
    },
  )
  .refine((value) => value.repeat !== 'weekly' || value.weekdays.length > 0, {
    path: ['weekdays'],
    message: 'Select at least one weekday',
  })
