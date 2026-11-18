import { z } from 'zod/v4'
import { performanceEmployeeColumns } from '#/lib/constants/performanceReports'

export const performanceReportSchema = z
  .object({
    fetch_by: z.enum(['branch', 'department', 'team', 'grade', 'employee']),
    fetch_by_id: z
      .array(z.number().int().positive())
      .min(1, 'Select at least one recipient'),
    branch_id: z.number().int().positive().optional(),
    columns: z.array(
      z
        .string()
        .refine(
          (column) =>
            [
              'first_name',
              'last_name',
              ...performanceEmployeeColumns.map((item) => item.value),
            ].includes(column),
          'Unsupported report column',
        ),
    ),
    year: z.number().int().min(1900).max(9999),
    group_by: z.literal('employee'),
    page: z.number().int().positive().default(1),
    perPage: z.number().int().min(1).max(100).default(10),
  })
  .superRefine((value, context) => {
    if (
      ['department', 'team', 'grade'].includes(value.fetch_by) &&
      !value.branch_id
    ) {
      context.addIssue({
        code: 'custom',
        path: ['branch_id'],
        message: 'Select a branch',
      })
    }
  })
