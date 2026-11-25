import type z from 'zod'
import { numberSchema, stringSchema, zodObjectSchema } from './zod.schema'

export const createTalentRequisitionSchema = zodObjectSchema({
  department_id: numberSchema().int().positive(),
  role: stringSchema().nonempty('Role is required'),
  salary_range: stringSchema().optional(),
  salary_min: numberSchema().int().positive(),
  salary_max: numberSchema().int().positive(),
  work_mode: stringSchema().nonempty('Work mode is required'),
  type: stringSchema().nonempty('Job type is required'),
  reason: stringSchema().nonempty('Reason is required'),
  description: stringSchema(),
  branch_id: numberSchema().int().positive().optional(),
}).refine((data) => data.salary_min <= data.salary_max, {
  message: 'Minimum salary must be less than or equal to maximum salary',
  path: ['salary_min'],
})

export const editTalentRequisitionSchema = zodObjectSchema({
  ...createTalentRequisitionSchema.shape,
  id: numberSchema().int().positive(),
})

export type TCreateTalentRequisitionPayload = z.infer<
  typeof createTalentRequisitionSchema
>
export type TEditTalentRequisitionPayload = z.infer<
  typeof editTalentRequisitionSchema
>
