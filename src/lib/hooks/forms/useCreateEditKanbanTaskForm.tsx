import {
  useCreateProjectKanbanTask,
  useFetchProjectKanbanStatuses,
  useFetchTasksByProjectId,
  useUpdateProjectKanbanTask,
} from '#/lib/api'
import {
  createKanbanTaskInitials,
  editKanbanTaskInitials,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { capitalize } from '#/lib/utils'
import useTamsForm from '../useTamsForm'
import { useEffect, useState } from 'react'
import {
  createPerformanceTaskManagementTaskSchema,
  editPerformanceTaskManagementTaskSchema,
} from '#/lib/utils/schema/performance.schema'
import type { TCreatePerformanceTaskManagementTaskPayload } from '#/lib/utils/schema/performance.schema'
import type { TProjectKanbanTask } from '#/lib/types/api/performance'
import {
  KanbanIssueTypes,
  KanbanTaskPriority,
} from '#/lib/types/api/performance'

type Props = {
  type: 'create' | 'edit'
  id?: number
  initialTask?: TProjectKanbanTask | null
  closeActionWidget: () => void
  employeesFromTeams: { label: string; value: string }[] | undefined
  projectId: number
  opened: boolean
}

const useCreateEditKanbanTaskForm = ({
  type,
  closeActionWidget,
  employeesFromTeams,
  projectId,
  id,
  initialTask,
  opened,
}: Props) => {
  const [isDirty, setIsDirty] = useState(false)

  const form = useTamsForm({
    defaultValues:
      type === 'edit'
        ? { ...editKanbanTaskInitials, project_id: projectId }
        : { ...createKanbanTaskInitials, project_id: projectId },
    schema:
      type === 'edit'
        ? editPerformanceTaskManagementTaskSchema
        : createPerformanceTaskManagementTaskSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        setIsDirty(true)
      } else {
        setIsDirty(false)
      }
    },
    transformValues: (values) => {
      return {
        ...values,
      }
    },
  })

  const { data: tasksByProjectIdData } = useFetchTasksByProjectId(
    {
      project_id: projectId,
    },
    (data) =>
      data.data.map((task) => ({
        value: task.id.toString(),
        label: task.title,
      })),
  )

  const { data: kanbanStatuses } = useFetchProjectKanbanStatuses(
    {
      project_id: projectId,
    },
    (data) =>
      data.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
  )

  const createProjectKanbanTaskMutation = useCreateProjectKanbanTask()
  const updateProjectKanbanTaskMutation = useUpdateProjectKanbanTask()

  useEffect(() => {
    if (type === 'create' && opened) {
      form.reset()
      setIsDirty(false)
    }

    if (type === 'edit' && id && initialTask && opened) {
      const vals = {
        id,
        project_id: projectId,
        title: initialTask.title,
        description: initialTask.description,
        priority: initialTask.priority,
        issue_type: initialTask.issue_type,
        status_id: initialTask.status_id,
        start_date: initialTask.start_date
          ? new Date(initialTask.start_date)
          : new Date(),
        due_date: initialTask.due_date
          ? new Date(initialTask.due_date)
          : new Date(),
        is_sub_task: Boolean(initialTask.parent_task_id),
        parent_task_id: initialTask.parent_task_id ?? undefined,
        actors: initialTask.actors.map((actor) => actor.employee_id),
      }
      form.setValues(vals)
      setIsDirty(false)
    }
  }, [initialTask, id, projectId, type, opened])

  const isSubTask = form.useWatchValue('is_sub_task')
  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Task type Information',
      fields: [
        {
          label: 'Task title',
          name: 'title',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Status',
          name: 'status_id',
          type: 'select',
          cols: 6,
          options: kanbanStatuses,
          required: true,
        },
        {
          label: 'Priority',
          name: 'priority',
          type: 'select',
          cols: 6,
          options: Object.values(KanbanTaskPriority).map((priority) => ({
            value: priority,
            label: capitalize(priority),
          })),
          required: true,
        },
        {
          label: 'Issue Type',
          name: 'issue_type',
          type: 'select',
          cols: 6,
          options: Object.values(KanbanIssueTypes).map((issueType) => ({
            value: issueType,
            label: capitalize(issueType),
          })),
          required: true,
        },
        {
          label: 'Description',
          name: 'description',
          type: 'textarea',
          cols: 12,
        },
        {
          label: 'Start Date',
          name: 'start_date',
          type: 'date',
          cols: 6,
          required: true,
        },
        {
          label: 'Due Date',
          name: 'due_date',
          type: 'date',
          cols: 6,
          required: true,
        },
        {
          label: 'Check as sub-task',
          name: 'is_sub_task',
          type: 'checkbox',
          cols: 6,
        },
        {
          label: 'Parent Task',
          name: 'parent_task_id',
          type: 'select',
          cols: 6,
          required: true,
          options: tasksByProjectIdData,
          hidden: !isSubTask,
        },
      ],
    },
    {
      title: 'Primary Assignee Info',
      fields: [
        {
          label: 'Employees',
          name: 'actors',
          type: 'multi-select-searchable',
          options: employeesFromTeams ?? [],
          cols: 12,
          required: true,
        },
      ],
    },
  ]

  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const { is_sub_task, ...restPayload } =
            values as TCreatePerformanceTaskManagementTaskPayload
          if (type === 'create') {
            await createProjectKanbanTaskMutation.mutateAsync(restPayload)
            form.reset()
            closeActionWidget()
          }
          if (type === 'edit' && id) {
            const startDate = restPayload.start_date as Date | string | null
            const dueDate = restPayload.due_date as Date | string | null
            await updateProjectKanbanTaskMutation.mutateAsync({
              id,
              project_id: projectId,
              title: restPayload.title,
              description: restPayload.description,
              priority: restPayload.priority,
              issue_type: restPayload.issue_type,
              actors: restPayload.actors,
              parent_task_id: restPayload.parent_task_id ?? null,
              start_date:
                startDate instanceof Date
                  ? startDate.toISOString()
                  : (startDate ?? undefined),
              due_date:
                dueDate instanceof Date
                  ? dueDate.toISOString()
                  : (dueDate ?? undefined),
            })
          }
          closeActionWidget()
        } catch (error) {
          console.error(error)
        }
      },
      (errors) => {
        console.error('errors', errors)
      },
    )()
  }

  const handleCancel = () => {
    form.reset()
  }
  return {
    isDetailLoading: false,
    isDirty,
    form,
    fields,
    handleSubmit,
    handleCancel,
    loading: createProjectKanbanTaskMutation.isPending,
    isUpdating: true,
  }
}

export default useCreateEditKanbanTaskForm
