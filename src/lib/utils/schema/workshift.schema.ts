import { z } from 'zod/v4'

export const shiftDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
const id = z.number().int().positive()
const selectedId = z.string().regex(/^[1-9]\d*$/, 'Select an option')
export const workshiftSchema = z.object({
  name: z.string().trim().min(3, 'Enter at least 3 characters'),
  branch_id: z.union([selectedId, z.literal('all')]),
  excludeWeekend: z.boolean(),
  shift_days: z
    .array(
      z.object({
        day_id: z.number().int().min(1).max(7),
        shift_type_id: selectedId,
      }),
    )
    .min(1, 'Choose at least one shift day'),
})
export const workshiftAssignmentSchema = z.object({
  regular_shift_id: id,
  assignables: z
    .array(
      z.object({
        type: z.enum(['company', 'branch', 'department', 'team', 'employee']),
        type_id: id,
        branch_id: id.optional(),
      }),
    )
    .min(1, 'Select at least one assignment'),
})
const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Enter a valid time')
  .transform((value) => (value.length === 5 ? `${value}:00` : value))
export const shiftTypesSchema = z.object({
  shift_types: z
    .array(
      z.object({
        id: id.optional(),
        name: z.string().trim().min(1, 'Enter a shift name'),
        day_span: z.number().int().min(1).max(14),
        shift_start: time.refine(
          (value) => value !== '00:00:00',
          'The attendance service cannot save a midnight start',
        ),
        shift_end: time.refine(
          (value) => value !== '00:00:00',
          'The attendance service cannot save a midnight end',
        ),
        color_code: z.string().regex(/^#[0-9a-f]{6}$/i, 'Choose a color'),
      }),
    )
    .min(1, 'Add at least one shift type'),
})
const hours = z.number().min(0).max(30)
export const clockSchema = z.object({
  clock_in: z.object({ hours_before_start: hours, hours_after_start: hours }),
  clock_out: z.object({ hours_before_start: hours, hours_after_start: hours }),
})
export const rosterFilterSchema = z
  .object({
    start_date: z.iso.date(),
    end_date: z.iso.date(),
    fetch_by: z.enum(['company', 'branch', 'department', 'employee']),
    fetch_by_id: z.array(id).min(1, 'Select at least one recipient'),
    branch_id: id.optional(),
  })
  .refine((value) => value.end_date >= value.start_date, {
    path: ['end_date'],
    message: 'End date must be on or after start date',
  })
  .refine((value) => value.fetch_by !== 'department' || !!value.branch_id, {
    path: ['branch_id'],
    message: 'Select a branch for the departments',
  })
