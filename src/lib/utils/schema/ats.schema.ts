import { z } from 'zod'

export const applicantSearchSchema = z.object({
  page: z.number().int().positive().catch(1).optional(),
  tab: z
    .enum(['all', 'pending', 'shortlisted', 'completed', 'rejected'])
    .catch('all')
    .optional(),
  search: z.string().max(200).catch('').optional(),
  source: z.enum(['website', 'upload']).optional().catch(undefined),
  minimum: z.number().min(0).optional().catch(undefined),
  maximum: z.number().min(0).optional().catch(undefined),
})
export type TApplicantSearch = z.infer<typeof applicantSearchSchema>
export const applicantStatusLabels = {
  pending: 'Pending',
  shortlisted: 'Interview',
  completed: 'Hired',
  rejected: 'Rejected',
}
