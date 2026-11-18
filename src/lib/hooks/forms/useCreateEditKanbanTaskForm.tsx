import {
  useCreateProjectKanbanTask,
  useFetchProjectKanbanStatuses,
  useFetchTasksByProjectId,
} from '#/lib/api'
import {
  createKanbanTaskInitials,
  editKanbanTaskInitials,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { capitalize } from '#/lib/utils'
import useTamsForm from '../useTamsForm'
import { useState } from 'react'
import {
  createPerformanceTaskManagementTaskSchema,
  editPerformanceTaskManagementTaskSchema,
} from '#/lib/utils/schema/performance.schema'
import type { TCreatePerformanceTaskManagementTaskPayload } from '#/lib/utils/schema/performance.schema'
import {
  KanbanIssueTypes,
  KanbanTaskPriority,
} from '#/lib/types/api/performance'

type Props = {
  type: 'create' | 'edit'
  id?: number
  closeActionWidget: () => void
  employeesFromTeams: { label: string; value: string }[] | undefined
  projectId: number
}

const useCreateEditKanbanTaskForm = ({
  type,
  closeActionWidget,
  employeesFromTeams,
  projectId,
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

  /*  useEffect(() => {
    const initializeForm = async () => {
      if (id && hrmLeaveApproverDetailsData) {
        const initials = {
          id: hrmLeaveApproverDetailsData.id,
          name: hrmLeaveApproverDetailsData.name,
          approval_types: hrmLeaveApproverDetailsData.approval_types,
          category_type: hrmLeaveApproverDetailsData.category_type as
            'employees' | 'department' | 'station_grade' | 'branch',
          employees: hrmLeaveApproverDetailsData.employees?.map(
            (employee) => employee.id,
          ),
          category_branch_id: hrmLeaveApproverDetailsData.station_id,
          no_approvals: hrmLeaveApproverDetailsData.no_approvals,
          departments: hrmLeaveApproverDetailsData.departments?.map(
            (department) => department.id,
          ),
          grades: hrmLeaveApproverDetailsData.employeeGrades?.map(
            (grade) => grade.id,
          ),
          branches: hrmLeaveApproverDetailsData.branches?.map(
            (branch) => branch.id,
          ),
          approver_details:
            hrmLeaveApproverDetailsData.approvalLevels?.map((level) => ({
              approver_person_id: level.approval_person_id,
              alt_approver_person_id: level.alt_approval_person_id,
              searchValue: level.approval_person_name,
              searchValueAlt: level.alt_approval_person,
            })) ?? [],
        }
        form.initialize(initials as any)
        form.setValues(initials as any)
      }
    }
    initializeForm()
  }, [hrmLeaveApproverDetailsData, id])
 */
  /* (alias) const editKanbanTaskInitials: {
 id: number;
} */
  const isSubTask = form.useWatchValue('is_sub_task')
  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Leave type Information',
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
          /* if (type === 'edit' && id) {
            await updateHrmExemptionApproverMutation.mutateAsync({
              id: payloadId,
              ...restPayload,
            })
          } */
          closeActionWidget()
        } catch (error) {
          console.error(error)
        }
      },
      (errors) => {
        console.log('errors', errors)
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
