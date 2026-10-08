import type z from 'zod'
import {
  dateSchema,
  numberSchema,
  stringSchema,
  zodObjectSchema,
} from './zod.schema'

export const createHrmExemptionSchema = zodObjectSchema({
  employee_id: numberSchema().min(1, 'Employee ID is required'),
  employee_search: stringSchema().optional(),
  exemption_type: stringSchema().nonempty('Exemption type is required'),
  exemption_date: dateSchema('Exemption date is required')
    .array()
    .min(1, 'At least one exemption date is required'),
  reason: stringSchema().nonempty('Reason is required'),
  branch_id: numberSchema().optional(),
})

export type TCreateHrmExemptionPayload = z.infer<
  typeof createHrmExemptionSchema
>

export const editHrmExemptionSchema = zodObjectSchema({
  ...createHrmExemptionSchema.shape,
  id: numberSchema().min(1, 'ID is required'),
})

export type TEditHrmExemptionPayload = z.infer<typeof editHrmExemptionSchema>
