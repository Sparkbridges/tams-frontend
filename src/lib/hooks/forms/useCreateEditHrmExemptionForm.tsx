import {
  useCreateHrmExemption,
  useGetHrmExemptionById,
  useSearchOrganizationEmployees,
  useUpdateHrmExemption,
} from '#/lib/api'
import {
  createHrmExemptionInitials,
  editHrmExemptionInitials,
  ExemptionType,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import {
  createHrmExemptionSchema,
  editHrmExemptionSchema,
  getErrorMessage,
} from '#/lib/utils'
import type {
  TCreateHrmExemptionPayload,
  TEditHrmExemptionPayload,
} from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notifications } from '@mantine/notifications'

type Props = {
  type: 'create' | 'edit'
  exemptionId?: number
}

const useCreateEditHrmExemptionForm = ({ type, exemptionId }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()
  const navigate = useNavigate()
  const form = useTamsForm({
    defaultValues:
      type === 'create' ? createHrmExemptionInitials : editHrmExemptionInitials,
    schema:
      type === 'create' ? createHrmExemptionSchema : editHrmExemptionSchema,
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
      branch_id: values.employee_id
        ? employees?.find((emp) => emp.value === values.employee_search)?.value2
        : null,
    }),
  })

  const { data: employees } = useSearchOrganizationEmployees(
    { query: form.getValues().employee_search as string },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
        value2: employee.branch_id,
      })),
  )

  const {
    mutateAsync: createHrmExemptionAsync,
    isPending: isCreatingHrmExemption,
  } = useCreateHrmExemption()

  const {
    mutateAsync: updateHrmExemptionAsync,
    isPending: isUpdatingHrmExemption,
  } = useUpdateHrmExemption()

  const {
    data: exemptionDetails,
    isLoading: isLoadingExemptionDetails,
    isError,
  } = useGetHrmExemptionById(exemptionId as number, (data) => data.data)

  useEffect(() => {
    const initializeForm = async () => {
      if (exemptionId && exemptionDetails) {
        const initials = {
          reason: exemptionDetails.reason || '',
          exemption_type: exemptionDetails.exemption_type || '',
          employee_id: exemptionDetails.employee_id || 1,
          id: exemptionDetails.id || '',
          exemption_date: exemptionDetails.exemptionsdate.map(
            (date) => new Date(date.exemption_date),
          ),
          employee_search: exemptionDetails.employees[0]?.employee_name || '',
          branch_id: exemptionDetails.station_id,
        }
        form.initialize(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [exemptionDetails, exemptionId])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Exemption Information',
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
          label: 'Exemption Type',
          name: 'exemption_type',
          type: 'select',
          cols: 12,
          required: true,
          options: ExemptionType,
        },
        {
          label: 'Exemption Date',
          name: 'exemption_date',
          type: 'date-picker-input',
          cols: 12,
          required: true,
          dateType: 'multiple',
        },
        {
          label: 'Reason for Exemption',
          name: 'reason',
          type: 'textarea',
          cols: 12,
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          if (type === 'create') {
            console.log('Creating HRM Exemption with values:', employees)
            const { employee_search, ...payload } = values
            const response = await createHrmExemptionAsync(
              payload as TCreateHrmExemptionPayload,
            )
            navigate({
              to: `/admin-dashboard/hrm/exemption/edit?exemptionId=${response.data.id}`,
            })
          }
          if (type === 'edit' && exemptionId) {
            const { employee_search, ...payload } = values
            await updateHrmExemptionAsync({
              ...payload,
              id: exemptionId,
              branch_id: exemptionDetails?.station_id,
            } as TEditHrmExemptionPayload)
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
    loading: isCreatingHrmExemption || isUpdatingHrmExemption,
    isLoadingExemptionDetails,
    isError,
  }
}

export default useCreateEditHrmExemptionForm
