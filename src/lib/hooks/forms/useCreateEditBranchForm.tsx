import {
  organizationClient,
  useCreateOrganizationBranch,
  useFetchOrganizationBranchDetails,
  useFetchOrganizationBranches,
  useGetBranchTypes,
  useGetCountries,
  useGetStates,
  useSearchOrganizationEmployees,
  useUpdateOrganizationBranch,
} from '#/lib/api'
import { createBranchInitials } from '#/lib/constants'
import type {
  TamsBy2ColsFormFields,
  TCreateBranchPayload,
  TUpdateBranchPayload,
} from '#/lib/types'
import { createBranchSchema } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'

type Props = {
  type: 'create' | 'edit'
  branchId?: number
}

const useCreateEditBranchForm = ({ type, branchId }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()
  const { data: branchTypes } = useGetBranchTypes((data) =>
    data.data.map((branchType) => ({
      label: branchType.type,
      value: branchType.id.toString(),
    })),
  )

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) =>
    data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    })),
  )

  const { data: countries } = useGetCountries((data) =>
    data.data.map((item) => ({ label: item.name, value: item.id.toString() })),
  )

  const form = useTamsForm({
    defaultValues: createBranchInitials,
    schema: createBranchSchema,
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
      branch_type_id: Number(values.branch_type_id),
      // 0 is not a valid branch id, treat unselected as no parent
      parent_branch_id: values.parent_branch_id
        ? Number(values.parent_branch_id)
        : null,
      branch_head_id: Number(values.branch_head_id),
      country: countries?.find((c) => c.value === values.country)?.label || '',
      state:
        states?.find(
          (s: { value: string; label: string }) => s.value === values.state,
        )?.label || '',
    }),
  })

  const { data: states } = useGetStates(
    { country_id: Number(form.getValues().country) },
    (data) =>
      data.data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      })),
  )

  const { data: employees } = useSearchOrganizationEmployees(
    { query: form.getValues().search_branch_head },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const {
    mutateAsync: createOrganizationBranchAsync,
    isPending: isCreatingOrganizationBranch,
  } = useCreateOrganizationBranch()

  const {
    mutateAsync: updateOrganizationBranchAsync,
    isPending: isUpdatingOrganizationBranch,
  } = useUpdateOrganizationBranch()

  const {
    data: branchDetails,
    isLoading: isLoadingBranchDetails,
    isError,
  } = useFetchOrganizationBranchDetails(
    {
      branch_id: branchId as number,
    },
    (data) => data.data,
  )

  useEffect(() => {
    const initializeForm = async () => {
      if (branchId && branchDetails) {
        const country =
          countries?.find((c) => c.label === branchDetails.country)?.value ||
          '160'
        const statesi = await organizationClient.fetchStates({
          country_id: Number(country),
        })
        const state = statesi.data
          .find((s) => s.name === branchDetails.state)
            ?.id.toString() as string
          
        const phone = branchDetails.branch_phone_no
          ? branchDetails.branch_phone_no.startsWith('+')
            ? branchDetails.branch_phone_no
            : branchDetails.branch_phone_no.split('-')[1]
          : ''

        const phoneNoAlt = branchDetails.branch_alt_phone_no
          ? branchDetails.branch_alt_phone_no.startsWith('+')
            ? branchDetails.branch_alt_phone_no
            : branchDetails.branch_alt_phone_no.split('-')[1]
          : ''
        const initials = {
          address: branchDetails.address || '',
          branch_head_id: branchDetails.station_head_id,
          branch_name: branchDetails.station_name,
          branch_type_id: branchDetails.station_type_id,
          city: branchDetails.city,
          description: branchDetails.additional_info as string,
          branch_phone_no: phone,
          branch_alt_phone_no: phoneNoAlt,
          search_branch_head: branchDetails.branch_head_name,
          country,
          state: state,
          parent_branch_id: branchDetails.parent_station_id
            ? branchDetails.parent_station_id
            : branchDetails.id,
        }
        form.initialize(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [branchDetails, branchId])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Branch Information',
      fields: [
        {
          label: 'Branch Name',
          name: 'branch_name',
          type: 'text',
          cols: 12,
          required: true,
        },
        {
          label: 'Branch Type',
          name: 'branch_type_id',
          type: 'select',
          cols: 6,
          required: true,
          options: branchTypes,
        },
        {
          label: 'Parent Branch',
          name: 'parent_branch_id',
          type: 'select',
          cols: 6,
          options: branches,
        },
      ],
    },
    {
      title: 'Geographic Information',
      fields: [
        {
          label: 'Address',
          name: 'address',
          type: 'text',
          cols: 12,
          required: true,
        },
        {
          label: 'Country',
          name: 'country',
          type: 'select',
          cols: 6,
          options: countries,
          required: true,
        },
        {
          label: 'State',
          name: 'state',
          type: 'select',
          options: states,
          cols: 6,
          required: true,
        },
        {
          label: 'City',
          name: 'city',
          type: 'text',
          cols: 12,
          required: true,
        },
        {
          label: 'Branch Phone Number',
          name: 'branch_phone_no',
          type: 'phone',
          cols: 12,
          required: true,
        },
        {
          label: 'Alt Phone Number',
          name: 'branch_alt_phone_no',
          type: 'phone',
          cols: 12,
        },
      ],
    },
    {
      title: 'Branch Staff Information',
      fields: [
        {
          label: 'Branch Head',
          name: 'search_branch_head',
          type: 'search-dropdown',
          alias: 'branch_head_id',
          cols: 12,
          options: employees,
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
          if (type === 'create') {
            const { search_branch_head, ...payload } = values
            await createOrganizationBranchAsync(payload as TCreateBranchPayload)
            form.reset()
          }
          if (type === 'edit' && branchId) {
            const { search_branch_head, ...payload } = values
            console.log('opp', payload)
            await updateOrganizationBranchAsync({
              ...payload,
              id: branchId,
            } as TUpdateBranchPayload)
          }
          closeActionWidget()
        } catch (error) {
          console.error('Error submitting form', error)
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
    loading: isCreatingOrganizationBranch || isUpdatingOrganizationBranch,
    isLoadingBranchDetails,
    isError,
  }
}

export default useCreateEditBranchForm
