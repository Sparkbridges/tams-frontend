import { performanceTrainingTypes } from '#/lib/constants'
import z from 'zod'
import {
  booleanSchema,
  dateSchema,
  enumSchema,
  numberSchema,
  stringSchema,
  urlsSchema,
  zodObjectSchema,
} from './zod.schema'
import {
  KanbanIssueTypes,
  KanbanTaskPriority,
} from '#/lib/types/api/performance'

export const createPerformanceTrainingSchema = zodObjectSchema({
  title: stringSchema().nonempty({ message: 'Title is required' }),
  duration_days: numberSchema()
    .int({ message: 'Duration must be a whole number of days' })
    .min(1, { message: 'Duration must be at least 1 day' })
    .max(2147483647, { message: 'Duration must not exceed 2147483647 days' }),
  type: enumSchema(performanceTrainingTypes.map((type) => type.value)),
  description: stringSchema().nonempty({ message: 'Description is required' }),
  file_url: urlsSchema(),
  is_generic: booleanSchema(),
  branch_id: numberSchema().nullable(),
  search_employee: stringSchema().optional(),
  assignment_category: stringSchema().nonempty({
    message: 'Assignment category is required',
  }),
  assignment_ids: numberSchema()
    .array()
    .nonempty({ message: 'Assignment IDs are required' }),
})

export type TCreatePerformanceTrainingPayload = z.infer<
  typeof createPerformanceTrainingSchema
>

export const editPerformanceTrainingSchema = zodObjectSchema({
  ...createPerformanceTrainingSchema.shape,
  id: numberSchema().int().min(1, { message: 'ID must be a positive integer' }),
})

export type TEditPerformanceTrainingPayload = z.infer<
  typeof editPerformanceTrainingSchema
>

export const createFeedbackSurveySchema = zodObjectSchema({
  name: stringSchema().nonempty({ message: 'Feedback title is required' }),
  description: stringSchema().nonempty({
    message: 'Description is required',
  }),
  allow_participants_view_answers: booleanSchema(),
  assign_to_category: enumSchema([
    'employees',
    'department',
    'grade',
    'branch',
    'team',
  ]),
  assign_to_ids: z.array(z.string()),
  apply_to_category: enumSchema([
    'employees',
    'department',
    'grade',
    'branch',
    'team',
  ]),
  apply_to_ids: z.array(z.string()),
  assign_search: stringSchema().optional(),
  apply_search: stringSchema().optional(),
  survey_questions: z.array(
    z.object({
      question: stringSchema(),
      required: booleanSchema(),
      type: enumSchema(['text', 'dropdown', 'multiple_choice', 'checkbox']),
      type_value: z.array(z.string()).optional(),
    }),
  ),
})

export type TCreateFeedbackSurveyFormPayload = z.infer<
  typeof createFeedbackSurveySchema
>

export const editFeedbackSurveySchema = zodObjectSchema({
  ...createFeedbackSurveySchema.shape,
  id: numberSchema().int().min(1, { message: 'ID must be a positive integer' }),
})

export const createAppraisalGroupSchema = zodObjectSchema({
  id: numberSchema(),
  name: stringSchema().nonempty({
    message: 'Appraisal group name is required',
  }),
  description: stringSchema(),
  appraisal_period_id: numberSchema().nullable(),
  appraiser_settings_id: numberSchema().nullable(),
  approver_settings_id: numberSchema().nullable(),
  appraisal_year: numberSchema()
    .int()
    .min(2000, { message: 'Enter a valid appraisal year' }),
  apply_grade_settings: booleanSchema(),
  is_active: booleanSchema(),
  performance_areas: z.array(z.unknown()),
})

export const createPerformanceTaskManagementProjectSchema = zodObjectSchema({
  name: stringSchema().nonempty({ message: 'Name is required' }),
  description: stringSchema(),
  team_ids: numberSchema()
    .array()
    .nonempty({ message: 'Team IDs are required' }),
  status: stringSchema().nonempty({ message: 'Status is required' }),
  priority: numberSchema()
    .int()
    .min(1, { message: 'Priority must be at least 1' }),
  date_from: dateSchema('Date from is required'),
  date_to: dateSchema('Date to is required'),
  branch_id: numberSchema().int().positive().optional(),
})

export type TPerformanceTaskManagementProjectPayload = z.infer<
  typeof createPerformanceTaskManagementProjectSchema
>

export const editPerformanceTaskManagementProjectSchema = zodObjectSchema({
  ...createPerformanceTaskManagementProjectSchema.shape,
  id: numberSchema().int().min(1, { message: 'ID must be a positive integer' }),
})

export type TEditPerformanceTaskManagementProjectPayload = z.infer<
  typeof editPerformanceTaskManagementProjectSchema
>

const performanceTaskManagementTaskShape = {
  project_id: numberSchema()
    .int()
    .min(1, { message: 'Project ID must be a positive integer' }),
  title: stringSchema().nonempty({ message: 'Title is required' }),
  description: stringSchema(),
  priority: enumSchema(Object.values(KanbanTaskPriority)),
  issue_type: enumSchema(Object.values(KanbanIssueTypes)),
  is_sub_task: booleanSchema().optional(),
  actors: numberSchema().array().nonempty({ message: 'Actors are required' }),
  parent_task_id: z.preprocess(
    (value) =>
      value === null || (typeof value === 'string' && !value.trim())
        ? undefined
        : value,
    numberSchema()
      .int()
      .min(1, { message: 'Parent task ID must be a positive integer' })
      .optional(),
  ),
  status_id: numberSchema()
    .int()
    .min(1, { message: 'Status ID must be a positive integer' })
    .optional(),
  start_date: dateSchema('Start date is required'),
  due_date: dateSchema('Due date is required'),
}

const requireParentForSubtask = (value: {
  is_sub_task?: boolean
  parent_task_id?: number
}) => !value.is_sub_task || value.parent_task_id !== undefined

const parentTaskError = {
  path: ['parent_task_id'],
  message: 'Parent task is required for a subtask',
}

export const createPerformanceTaskManagementTaskSchema = zodObjectSchema(
  performanceTaskManagementTaskShape,
).refine(requireParentForSubtask, parentTaskError)

export type TCreatePerformanceTaskManagementTaskPayload = z.infer<
  typeof createPerformanceTaskManagementTaskSchema
>

export const editPerformanceTaskManagementTaskSchema = zodObjectSchema({
  ...performanceTaskManagementTaskShape,
  id: numberSchema().int().min(1, { message: 'ID must be a positive integer' }),
}).refine(requireParentForSubtask, parentTaskError)

export type TEditPerformanceTaskManagementTaskPayload = z.infer<
  typeof editPerformanceTaskManagementTaskSchema
>
