import type z from 'zod'
import {
  ACCEPTED_FILE_TYPES,
  booleanSchema,
  createFileOrStringSchema,
  enumSchema,
  numberSchema,
  stringSchema,
  zodObjectSchema,
} from './zod.schema'
import { answerTypes, jobTypeOptions, workModeOptions } from '#/lib/constants'

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

export const createJobPostingSchema = zodObjectSchema({
  role: stringSchema().nonempty('Role is required'),
  job_request_id: numberSchema().int().positive(),
  work_mode: enumSchema(workModeOptions.map((option) => option.value)),
  type: enumSchema(jobTypeOptions.map((option) => option.value)),
  description: stringSchema().nonempty('Description is required'),
  job_location_country_id: numberSchema().int().positive(),
  job_location_state_id: numberSchema().int().positive(),
  custom_fields: stringSchema(),
  items: zodObjectSchema({
    question: stringSchema().nonempty('Question is required'),
    answer_type: enumSchema(answerTypes.map((option) => option.value)),
    required: booleanSchema().default(false),
    options: stringSchema().array().optional(),
    key: stringSchema().nonempty('Key is required'),
  })
    .array()
    .optional(),
  required_documents: zodObjectSchema({
    name: stringSchema().nonempty('Name is required'),
    size: numberSchema().int().positive(),
    required: booleanSchema().default(false),
    data: stringSchema().nonempty('Data is required'),
  })
    .array()
    .optional(),
  files: createFileOrStringSchema({
    maxSizeMB: 5,
    acceptedTypes: ACCEPTED_FILE_TYPES,
    required: false,
  })
    .array()
    .optional()
    .or(
      zodObjectSchema({
        url: stringSchema().optional(),
        name: stringSchema().optional(),
        required: booleanSchema().default(false),
      })
        .array()
        .optional(),
    ),
})

export const editJobPostingSchema = zodObjectSchema({
  ...createJobPostingSchema.shape,
  id: numberSchema().int().positive(),
})

export type TCreateJobPostingPayload = z.infer<typeof createJobPostingSchema>
export type TEditJobPostingPayload = z.infer<typeof editJobPostingSchema>
