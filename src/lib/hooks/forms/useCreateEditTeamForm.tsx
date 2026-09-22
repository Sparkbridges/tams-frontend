import {
  useCreateOrganizationTeam,
  useFetchOrganizationAllEmployees,
  useFetchOrganizationBranches,
  useFetchOrganizationTeamDetails,
  useSearchOrganizationEmployees,
  useUpdateOrganizationTeam,
} from '#/lib/api'
import { createTeamInitials } from '#/lib/constants'
import type {
  TamsBy2ColsFormFields,
  TCreateTeamPayload,
  TUpdateTeamPayload,
} from '#/lib/types'
import { createTeamSchema } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'

type Props = {
  type: 'create' | 'edit'
  teamId?: number
}

const useCreateEditTeamForm = ({ type, teamId }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) => {
    const revamped = data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    }))
    return [{ label: 'All', value: '0' }, ...revamped]
  })

  const form = useTamsForm({
    defaultValues: createTeamInitials,
    schema: createTeamSchema,
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
      branch_id:
        Number(values.branch_id) === 0 ? 'all' : Number(values.branch_id),
      team_head_id: Number(values.team_head_id),
      team_members: values.team_members.map((member) => Number(member)),
    }),
  })

  const { data: employees } = useSearchOrganizationEmployees(
    { query: form.getValues().search_branch_head },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const { data: allEmployees } = useFetchOrganizationAllEmployees(
    { page: 1, perPage: 1000 },
    (data) =>
      data.data.results.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const {
    mutateAsync: createOrganizationTeamAsync,
    isPending: isCreatingOrganizationTeam,
  } = useCreateOrganizationTeam()

  const {
    mutateAsync: updateOrganizationTeamAsync,
    isPending: isUpdatingOrganizationTeam,
  } = useUpdateOrganizationTeam()

  const {
    data: teamDetails,
    isLoading: isLoadingTeamDetails,
    isError,
  } = useFetchOrganizationTeamDetails(
    { team_id: teamId as number },
    (data) => data.data,
  )

  form.watch('team_head_id', ({ value }) => {
    const doesExist = form.getValues().team_members.includes(value.toString())
    if (!doesExist) {
      form.setValues({
        team_members: [...form.getValues().team_members, value.toString()],
      })
    }
  })

  useEffect(() => {
    const initializeForm = async () => {
      if (teamId && teamDetails) {
        const initials = {
          team_head_id: teamDetails.team_head_id,
          team_name: teamDetails.team_name,
          description: teamDetails.description,
          search_branch_head: teamDetails.team_head_name,
          branch_id: teamDetails.station_id,
          team_members: teamDetails.members.map((member) =>
            member.id.toString(),
          ),
        }
        form.initialize(initials)
        form.resetDirty(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [teamDetails, teamId])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Department Information',
      fields: [
        {
          label: 'Team Name',
          name: 'team_name',
          type: 'text',
          cols: 12,
          required: true,
        },
        {
          label: 'Branch Name',
          name: 'branch_id',
          type: 'select',
          options: branches,
          cols: 6,
          required: true,
        },
        {
          label: 'Team Lead',
          name: 'search_branch_head',
          type: 'search-dropdown',
          alias: 'team_head_id',
          cols: 12,
          options: employees,
          required: true,
        },
        {
          label: 'Team Members',
          name: 'team_members',
          type: 'multi-select',
          cols: 12,
          options: allEmployees,
          required: true,
        },
        {
          label: 'Description',
          name: 'description',
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
          const { search_branch_head, ...payload } = values
          if (type === 'create') {
            await createOrganizationTeamAsync(payload as TCreateTeamPayload)
            form.reset()
          }
          if (type === 'edit' && teamId) {
            await updateOrganizationTeamAsync({
              ...payload,
              id: teamId,
            } as TUpdateTeamPayload)
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
    loading: isCreatingOrganizationTeam || isUpdatingOrganizationTeam,
    isLoadingTeamDetails,
    isError,
  }
}

export default useCreateEditTeamForm
