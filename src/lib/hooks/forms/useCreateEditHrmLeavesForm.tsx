import {
  useCreateHrmLeave,
  useGetHrmLeaveById,
  useGetHrmLeaveTypesByEmployeeId,
  useSearchOrganizationEmployees,
  useUpdateHrmLeave,
} from '#/lib/api'
import { createHrmLeavesInitials, editHrmLeavesInitials } from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import {
  createHrmLeavesSchema,
  editHrmLeavesSchema,
  getErrorMessage,
  newDayjs,
} from '#/lib/utils'
import type { TCreateHrmLeavesPayload } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notifications } from '@mantine/notifications'

type Props = {
  type: 'create' | 'edit'
  leaveId?: number
}

const useCreateEditHrmLeavesForm = ({ type, leaveId }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()
  const navigate = useNavigate()
  const form = useTamsForm({
    defaultValues:
      type === 'create' ? createHrmLeavesInitials : editHrmLeavesInitials,
    schema: type === 'create' ? createHrmLeavesSchema : editHrmLeavesSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        openActionWidget()
      } else {
        closeActionWidget()
      }
    },
    transformValues: (values) => ({
      ...values,
    }),
  })

  const { data: employees } = useSearchOrganizationEmployees(
    {
      query: form.getValues().employee_search as string,
    },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
        value2: employee.branch_id,
      })),
  )

  const { data: reliefEmployees } = useSearchOrganizationEmployees(
    {
      query: form.getValues().handover_search as string,
    },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
        value2: employee.branch_id,
      })),
  )

  const { data: getLeaveTypeForEmployee } = useGetHrmLeaveTypesByEmployeeId(
    {
      employee_id: form.getValues().employee_id,
    },
    (data) =>
      data.data.map((it) => ({
        label: it.leave_name,
        value: it.id.toString(),
      })),
  )

  const { mutateAsync: createHrmLeaveAsync, isPending: isCreatingHrmLeave } =
    useCreateHrmLeave()

  const { mutateAsync: updateHrmLeaveAsync, isPending: isUpdatingHrmLeave } =
    useUpdateHrmLeave()

  const {
    data: leaveDetails,
    isLoading: isLoadingLeaveDetails,
    isError,
  } = useGetHrmLeaveById(leaveId as number, (data) => data.data)

  useEffect(() => {
    const initializeForm = async () => {
      if (leaveId && leaveDetails) {
        const initials = {
          id: leaveDetails.id || 1,
          employee_id: leaveDetails.employee_id || 1,
          employee_search: leaveDetails.employee_name || '',
          handover_search: leaveDetails.relief || '',
          date_range: [
            new Date(leaveDetails.start_date),
            new Date(leaveDetails.end_date),
          ],
          handover_to: leaveDetails.handover_to || 1,
          leave_type_id: leaveDetails.leave_id || 1,
          note: leaveDetails.note || '',
        }
        form.initialize(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [leaveDetails, leaveId])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Leave Information',
      fields: [
        {
          label: 'Employee',
          name: 'employee_search',
          type: 'search-dropdown',
          alias: 'employee_id',
          cols: 12,
          options: employees,
          required: true,
        },
        {
          label: 'Leave Type',
          name: 'leave_type_id',
          type: 'select',
          cols: 12,
          required: true,
          options: getLeaveTypeForEmployee,
        },
        {
          label: 'Leave Date(s)',
          name: 'date_range',
          type: 'date-picker-input',
          cols: 12,
          required: true,
          dateType: 'range',
        },
        {
          label: 'Reason for Leave',
          name: 'note',
          type: 'textarea',
          cols: 12,
        },
        {
          label: 'Relief Staff',
          name: 'handover_search',
          type: 'search-dropdown',
          alias: 'handover_to',
          cols: 12,
          options: reliefEmployees,
          required: true,
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          if (type === 'create') {
            const { employee_search, handover_search, date_range, ...payload } =
              values as TCreateHrmLeavesPayload
            const response = await createHrmLeaveAsync({
              ...payload,
              start_date: newDayjs(date_range[0]).format('YYYY-MM-DD'),
              end_date: newDayjs(date_range[1]).format('YYYY-MM-DD'),
            })
            navigate({
              to: `/admin-dashboard/hrm/leave/edit?leaveId=${response.data.id}`,
            })
          }
          if (type === 'edit' && leaveId) {
            const { employee_search, handover_search, date_range, ...payload } =
              values as TCreateHrmLeavesPayload
            await updateHrmLeaveAsync({
              ...payload,
              start_date: newDayjs(date_range[0]).format('YYYY-MM-DD'),
              end_date: newDayjs(date_range[1]).format('YYYY-MM-DD'),
              id: leaveId,
            })
          }
          closeActionWidget()
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          notifications.show({
            title: 'Error',
            message:
              errorMessage || 'An error occurred while submitting the form.',
            color: 'red',
          })
        }
      },
      (errors) => {
        console.log('errors', errors)
      },
    )()
  }
  const handleCancel = () => {
    form.reset()
    closeActionWidget()
  }
  return {
    form,
    fields,
    openedActionWidget,
    openActionWidget,
    closeActionWidget,
    handleSubmit,
    handleCancel,
    loading: isCreatingHrmLeave || isUpdatingHrmLeave,
    isLoadingLeaveDetails,
    isError,
  }
}

export default useCreateEditHrmLeavesForm
