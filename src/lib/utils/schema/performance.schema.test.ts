import { describe, expect, it, vi } from 'vitest'
import {
  createPerformanceTrainingSchema,
  createPerformanceTaskManagementTaskSchema,
  editPerformanceTaskManagementTaskSchema,
} from './performance.schema'
import {
  KanbanIssueTypes,
  KanbanTaskPriority,
} from '#/lib/types/api/performance'

vi.mock('#/lib/constants', () => ({
  performanceTrainingTypes: [
    { label: 'General', value: 'general' },
    { label: 'Performance Improvement', value: 'performance_improvement' },
  ],
}))

const schema = createPerformanceTrainingSchema.pick({ duration_days: true })

describe('performance training duration', () => {
  it.each([1, 14, 2147483647, '14'])(
    'returns numeric whole-day duration for %s',
    (duration) => {
      expect(schema.parse({ duration_days: duration })).toEqual({
        duration_days: Number(duration),
      })
    },
  )

  it.each([0, -1, 1.5, 2147483648, '2 weeks', '', null, undefined, Infinity])(
    'rejects invalid duration %s',
    (duration) => {
      expect(schema.safeParse({ duration_days: duration }).success).toBe(false)
    },
  )
})

describe.each([
  ['create', createPerformanceTaskManagementTaskSchema, {}],
  ['edit', editPerformanceTaskManagementTaskSchema, { id: 1 }],
])('%s task parent validation', (_name, taskSchema, extra) => {
  const task = {
    project_id: 1,
    title: 'Task',
    description: '',
    priority: Object.values(KanbanTaskPriority)[0],
    issue_type: Object.values(KanbanIssueTypes)[0],
    actors: [1],
    ...extra,
  }

  it.each([undefined, null, '', '  '])(
    'allows a missing parent %s for a regular task',
    (parent_task_id) => {
      expect(
        taskSchema.safeParse({ ...task, is_sub_task: false, parent_task_id })
          .success,
      ).toBe(true)
    },
  )

  it.each([undefined, null, '', '  '])(
    'requires a missing parent %s for a subtask',
    (parent_task_id) => {
      const result = taskSchema.safeParse({
        ...task,
        is_sub_task: true,
        parent_task_id,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['parent_task_id'],
              message: 'Parent task is required for a subtask',
            }),
          ]),
        )
      }
    },
  )

  it.each([1, '12'])(
    'accepts a valid parent %s for a subtask',
    (parent_task_id) => {
      expect(
        taskSchema.parse({ ...task, is_sub_task: true, parent_task_id })
          .parent_task_id,
      ).toBe(Number(parent_task_id))
    },
  )

  it.each([0, -1, 1.5, 'abc'])(
    'rejects invalid supplied parent %s',
    (parent_task_id) => {
      expect(
        taskSchema.safeParse({ ...task, is_sub_task: true, parent_task_id })
          .success,
      ).toBe(false)
    },
  )
})
