import { z } from 'zod'
import {
  booleanSchema,
  dateSchema,
  enumSchema,
  numberSchema,
  stringSchema,
  zodObjectSchema,
} from './zod.schema'
import { hrmLeaveApproverTypes, hrmLeaveTypeCategory } from '#/lib/constants'

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

export const createHrmLeavesSchema = zodObjectSchema({
  employee_id: numberSchema().min(1, 'Employee ID is required'),
  employee_search: stringSchema().optional(),
  handover_search: stringSchema().optional(),
  leave_type_id: numberSchema().min(1, 'Leave type is required'),
  date_range: dateSchema('Leave date is required')
    .array()
    .max(2, 'At most two leave dates are allowed'),
  handover_to: numberSchema().min(1, 'Handover to is required'),
  note: stringSchema().optional(),
})

export type TCreateHrmLeavesPayload = z.infer<typeof createHrmLeavesSchema>

export const editHrmLeavesSchema = zodObjectSchema({
  ...createHrmLeavesSchema.shape,
  id: numberSchema().min(1, 'ID is required'),
})

export type TEditHrmLeavesPayload = z.infer<typeof editHrmLeavesSchema>

export const createHrmLeaveTypeSchema = zodObjectSchema({
  leave_name: stringSchema().nonempty('Leave name is required'),
  period_type: stringSchema().nonempty('Period type is required'),
  weekend: stringSchema().array().optional(),
  exclude_public_holidays: booleanSchema().default(false),
  applicable_days: numberSchema().min(0, 'Applicable days is required'),
  note: stringSchema().optional(),
  is_generic: numberSchema().min(0).max(1),
  is_paid: booleanSchema().default(true),
  gender: stringSchema().nullable().optional(),
  isGenderBased: booleanSchema().default(false).optional(),
  isApplicableToAllBranches: booleanSchema().default(true).optional(),
  departments: numberSchema().array().optional(),
  grades: numberSchema().array().optional(),
  employees: numberSchema().array().optional(),
  category_type: enumSchema(hrmLeaveTypeCategory.map((option) => option.value)),
  branch_id: numberSchema().nullable(),
  employee_query: stringSchema().optional(),
})

export type TCreateHrmLeaveTypePayload = z.infer<
  typeof createHrmLeaveTypeSchema
>

export const editHrmLeaveTypeSchema = zodObjectSchema({
  ...createHrmLeaveTypeSchema.shape,
  id: numberSchema().min(1, 'ID is required'),
})

export type TEditHrmLeaveTypePayload = z.infer<typeof editHrmLeaveTypeSchema>

const baseApproverSchema = zodObjectSchema({
  id: numberSchema().optional(),
  description: stringSchema().nonempty('Description is required'),
  approval_types: enumSchema(
    hrmLeaveApproverTypes.map((option) => option.value),
  ),
  no_approvals: numberSchema().min(0, 'Number of approvals is required'),
  branch_id: numberSchema().nullable(),
  approver_details: zodObjectSchema({
    approver_person_id: numberSchema().min(1, 'Approver person ID is required'),
    alt_approver_person_id: numberSchema(),
    searchValue: stringSchema().optional(),
    searchValueAlt: stringSchema().optional(),
  })
    .array()
    .optional(),
  employee_query: stringSchema().optional(),
})

export const createHrmLeaveApproverSchema = z.discriminatedUnion(
  'category_type',
  [
    baseApproverSchema.extend({
      category_type: z.literal('employees'),
      employees: numberSchema().array().min(1, 'Select at least one employee'),
    }),
    baseApproverSchema.extend({
      category_type: z.literal('branch'),
      branches: numberSchema().array().min(1, 'Select at least one branch'),
    }),
    baseApproverSchema.extend({
      category_type: z.literal('department'),
      departments: numberSchema()
        .array()
        .min(1, 'Select at least one department'),
      branch_id: numberSchema(),
    }),
    baseApproverSchema.extend({
      category_type: z.literal('station_grade'),
      grades: numberSchema().array().min(1, 'Select at least one grade'),
      branch_id: numberSchema(),
    }),
    /* baseApproverSchema.extend({
    category_type: z.literal('branches'), // <- your real value for the branch_id case
    branch_id: numberSchema(), // required (non-null) in this branch
  }), */
  ],
)

export type TCreateHrmLeaveApproverPayload = z.infer<
  typeof createHrmLeaveApproverSchema
>

export type TEditHrmLeaveApproverPayload = z.infer<
  typeof createHrmLeaveApproverSchema
>

export const baseExemptionApproverSchema = zodObjectSchema({
  ...baseApproverSchema.omit({ branch_id: true, description: true }).shape,
  category_branch_id: numberSchema().nullable(),
  name: stringSchema().nonempty('Approval list name is required'),
})

export const createHrmExemptionApproverSchema = z.discriminatedUnion(
  'category_type',
  [
    baseExemptionApproverSchema.extend({
      category_type: z.literal('employees'),
      employees: numberSchema().array().min(1, 'Select at least one employee'),
    }),
    baseExemptionApproverSchema.extend({
      category_type: z.literal('branch'),
      branches: numberSchema().array().min(1, 'Select at least one branch'),
    }),
    baseExemptionApproverSchema.extend({
      category_type: z.literal('department'),
      departments: numberSchema()
        .array()
        .min(1, 'Select at least one department'),
      category_branch_id: numberSchema(),
    }),
    baseExemptionApproverSchema.extend({
      category_type: z.literal('station_grade'),
      grades: numberSchema().array().min(1, 'Select at least one grade'),
      category_branch_id: numberSchema(),
    }),
  ],
)

export type TCreateEditHrmExemptionApproverPayload = z.infer<
  typeof createHrmExemptionApproverSchema
>
