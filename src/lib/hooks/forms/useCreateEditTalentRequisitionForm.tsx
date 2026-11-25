import {
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
} from '#/lib/api'
import {
  createTalentRequisitionInitials,
  editTalentRequisitionInitials,
  jobTypeOptions,
  workModeOptions,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  createTalentRequisitionSchema,
  editTalentRequisitionSchema,
} from '#/lib/utils/schema/recruitment.schema'
import type { TCreateTalentRequisitionPayload } from '#/lib/utils/schema/recruitment.schema'
import {
  useCreateRecruitmentTalentRequest,
  useEditRecruitmentTalentRequest,
  useRecruitmentTalentRequestById,
} from '#/lib/api/services/recruitment'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const useCreateEditTalentRequisitionForm = ({ type, id }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const navigate = useNavigate()

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) => {
    return data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    }))
  })

  const form = useTamsForm({
    defaultValues:
      type === 'create'
        ? createTalentRequisitionInitials
        : editTalentRequisitionInitials,
    schema:
      type === 'create'
        ? createTalentRequisitionSchema
        : editTalentRequisitionSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        openActionWidget()
      } else {
        closeActionWidget()
      }
    },
    transformValues: (values) => {
      return {
        ...values,
        salary_range: `${values.salary_min}-${values.salary_max}`,
      }
    },
  })

  const branchId = form.useWatchValue('branch_id')

  const { data: departments } = useFetchOrganizationDepartments(
    undefined,
    (data) => {
      return data.data.results
        .filter((department) => department.station_id === Number(branchId))
        .map((department) => ({
          label: department.department_name,
          value: department.id.toString(),
        }))
    },
  )

  const mutateAsyncCreateTalentRequest = useCreateRecruitmentTalentRequest()
  const mutateAsyncUpdateTalentRequest = useEditRecruitmentTalentRequest()

  const {
    data: details,
    isLoading: isLoadingDetails,
    isError,
  } = useRecruitmentTalentRequestById(id as number)

  useEffect(() => {
    const initializeForm = async () => {
      const data = details?.data
      if (id && data) {
        const initials = {
          id,
          description: data.description ?? '',
          department_id: Number(data.department_id ?? 0),
          role: data.role,
          salary_min: Number(data.salary_range?.split('-')[0] ?? 0),
          salary_max: Number(data.salary_range?.split('-')[1] ?? 0),
          work_mode: data.work_mode,
          type: data.type,
          reason: data.reason,
          branch_id: data.station_id ?? undefined,
        }
        form.initialize(initials)
        form.resetDirty(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [details, id])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Talent Request Information',
      fields: [
        {
          label: 'Role',
          name: 'role',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Work Mode',
          name: 'work_mode',
          type: 'select',
          cols: 6,
          required: true,
          options: workModeOptions,
        },
        {
          label: 'Job Type',
          name: 'type',
          type: 'select',
          cols: 6,
          required: true,
          options: jobTypeOptions,
        },
        {
          label: 'Salary Range',
          name: 'salary_min-salary_max',
          placeholder: 'Min-Max',
          type: 'currency-range',
          cols: 6,
          required: true,
        },
        {
          label: 'Description',
          name: 'description',
          type: 'textarea',
          cols: 12,
        },
        {
          label: 'Reason',
          name: 'reason',
          type: 'textarea',
          cols: 12,
          required: true,
        },
      ],
    },
    {
      title: 'Assignment Information',
      fields: [
        {
          label: 'Branch',
          name: 'branch_id',
          type: 'select',
          cols: 6,
          required: true,
          options: branches,
        },
        {
          label: 'Department',
          name: 'department_id',
          type: 'select',
          cols: 6,
          required: true,
          options: departments,
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const { salary_min, salary_max, branch_id, ...rest } =
            values as TCreateTalentRequisitionPayload
          if (type === 'create') {
            const response =
              await mutateAsyncCreateTalentRequest.mutateAsync(rest)
            if (response?.data?.id) {
              navigate({
                to: '/admin-dashboard/recruitment/talent-requisition/edit',
                search: { talentRequestId: response.data.id },
              })
            }
          }
          if (type === 'edit' && id) {
            await mutateAsyncUpdateTalentRequest.mutateAsync({
              ...rest,
              id: id,
            })
          }
          closeActionWidget()
        } catch (error) {
          console.error('Error submitting form', error)
        }
      },
      (errors) => {
        console.error('errors', errors)
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
    loading:
      mutateAsyncCreateTalentRequest.isPending ||
      mutateAsyncUpdateTalentRequest.isPending,
    isLoadingDetails,
    isError,
  }
}

export default useCreateEditTalentRequisitionForm
