import {
  useCreateHrmProject,
  useFetchHrmProjectById,
  useFetchOrganizationBranches,
  useFetchOrganizationTeams,
  useUpdateHrmProject,
} from '#/lib/api'
import {
  createPerformanceTaskManagementProjectInitials,
  editPerformanceTaskManagementProjectInitials,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import {
  createPerformanceTaskManagementProjectSchema,
  editPerformanceTaskManagementProjectSchema,
} from '#/lib/utils/schema/performance.schema'
import type { TPerformanceTaskManagementProjectPayload } from '#/lib/utils/schema/performance.schema'
import { useNavigate } from '@tanstack/react-router'
import { newDayjs } from '#/lib/utils'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const useCreateEditPerformanceTaskManagementProjectForm = ({
  type,
  id,
}: Props) => {
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
        ? createPerformanceTaskManagementProjectInitials
        : editPerformanceTaskManagementProjectInitials,
    schema:
      type === 'create'
        ? createPerformanceTaskManagementProjectSchema
        : editPerformanceTaskManagementProjectSchema,
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
      }
    },
  })

  const { data: teams } = useFetchOrganizationTeams(
    {
      page: 1,
      perPage: 50,
      branch_id: form.getValues().branch_id
        ? Number(form.getValues().branch_id)
        : undefined,
    },
    (data) => {
      return data.data.results.map((team) => ({
        label: team.team_name,
        value: team.id.toString(),
      }))
    },
  )

  const mutateAsyncCreatePerformanceProject = useCreateHrmProject()
  const mutateAsyncUpdatePerformanceProject = useUpdateHrmProject()

  const {
    data: details,
    isLoading: isLoadingDetails,
    isError,
  } = useFetchHrmProjectById(id as number, (data) => data.data)

  useEffect(() => {
    const initializeForm = async () => {
      const data = details
      if (id && data) {
        const initials = {
          id,
          name: data.name,
          description: data.description,
          team_ids: data.teams.map((team) => team.id),
          status: data.status,
          priority: data.priority,
          date_from: newDayjs(data.date_from).toDate(),
          date_to: newDayjs(data.date_to).toDate(),
          branch_id: data.branch_id ?? undefined,
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
      title: 'Project Information',
      fields: [
        {
          label: 'Project Name',
          name: 'name',
          type: 'text',
          cols: 6,
          required: true,
          description: 'Enter the project name',
        },
        {
          label: 'Priority',
          name: 'priority',
          type: 'number',
          cols: 6,
          required: true,
          maxNumber: 5,
          description: 'Priority must be between 1 (lowest) and 5 (highest)',
        },
        {
          label: 'Description',
          name: 'description',
          type: 'textarea',
          cols: 12,
        },
        {
          label: 'Date From',
          name: 'date_from',
          type: 'date-picker-input',
          cols: 6,
          required: true,
        },
        {
          label: 'Date To',
          name: 'date_to',
          type: 'date-picker-input',
          cols: 6,
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
          label: 'Teams',
          name: 'team_ids',
          type: 'multi-select',
          cols: 6,
          required: true,
          options: teams,
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const payload = values as TPerformanceTaskManagementProjectPayload
          if (type === 'create') {
            const response =
              await mutateAsyncCreatePerformanceProject.mutateAsync(payload)
            if (response?.data?.id) {
              navigate({
                to: '/admin-dashboard/performance/task-management/edit',
                search: { projectId: response.data.id },
              })
            }
          }
          if (type === 'edit' && id) {
            await mutateAsyncUpdatePerformanceProject.mutateAsync({
              ...payload,
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
      mutateAsyncCreatePerformanceProject.isPending ||
      mutateAsyncUpdatePerformanceProject.isPending,
    isLoadingDetails,
    isError,
  }
}

export default useCreateEditPerformanceTaskManagementProjectForm
