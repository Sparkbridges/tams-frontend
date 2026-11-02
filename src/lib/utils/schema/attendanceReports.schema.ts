import { z } from 'zod/v4'
import { attendanceReportTypes } from '#/lib/constants/attendanceReports'

const ids = z
  .array(z.number().int().positive())
  .min(1, 'Select at least one recipient')
export const attendanceReportSchema = z
  .object({
    type: z.enum(attendanceReportTypes.map((report) => report.value)),
    fetch_by: z.enum(['branch', 'department', 'team', 'grade', 'employee']),
    fetch_by_id: z.union([ids, z.literal('all')]),
    branch_id: z.union([ids, z.literal('all')]).optional(),
    columns: z.array(z.string()).min(1, 'Select at least one employee column'),
    date_from: z.iso.date('Select a valid start date'),
    date_to: z.iso.date('Select a valid end date'),
    group_by: z.enum(['date', 'employee']),
    exclude_weekend: z.boolean(),
    exclude_public_holiday: z.boolean(),
    only_sunday: z.boolean(),
    hourly_view: z.boolean(),
    page: z.number().int().positive(),
    per_page: z.number().int().min(1).max(100),
  })
  .superRefine((value, ctx) => {
    if (value.date_to < value.date_from)
      ctx.addIssue({
        code: 'custom',
        path: ['date_to'],
        message: 'End date must be on or after start date',
      })
    const days =
      (Date.parse(value.date_to) - Date.parse(value.date_from)) / 86400000 + 1
    if (days > 93)
      ctx.addIssue({
        code: 'custom',
        path: ['date_to'],
        message: 'Select at most 93 days per report',
      })
    if (value.fetch_by !== 'branch' && value.fetch_by_id === 'all')
      ctx.addIssue({
        code: 'custom',
        path: ['fetch_by_id'],
        message: 'Select recipients for this scope',
      })
    if (
      ['department', 'team', 'grade'].includes(value.fetch_by) &&
      !value.branch_id
    )
      ctx.addIssue({
        code: 'custom',
        path: ['branch_id'],
        message: 'Select a branch',
      })
    if (value.only_sunday && value.exclude_weekend)
      ctx.addIssue({
        code: 'custom',
        path: ['only_sunday'],
        message: 'Sunday-only reports cannot exclude weekends',
      })
  })
