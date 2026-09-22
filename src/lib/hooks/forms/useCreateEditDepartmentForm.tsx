import {
  useCreateOrganizationDepartment,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartmentDetails,
  useFetchOrganizationDepartments,
  useSearchOrganizationEmployees,
  useUpdateOrganizationDepartment,
} from '#/lib/api'
import { createDepartmentInitials } from '#/lib/constants'
import type {
  TamsBy2ColsFormFields,
  TCreateDepartmentPayload,
  TUpdateDepartmentPayload,
} from '#/lib/types'
import { createDepartmentSchema } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'

type Props = {
  type: 'create' | 'edit'
  departmentId?: number
}

const useCreateEditDepartmentForm = ({ type, departmentId }: Props) => {
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

  const { data: departments } = useFetchOrganizationDepartments(
    {
      page: 1,
      perPage: 1000,
    },
    (data) =>
      data.data.results.map((department) => ({
        label: department.department_name,
        value: department.id.toString(),
      })),
  )

  const form = useTamsForm({
    defaultValues: createDepartmentInitials,
    schema: createDepartmentSchema,
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
      department_head_id: Number(values.department_head_id),
      department_name: values.department_name,
      is_generic: Number(values.is_generic),
      notes: values.notes,
      parent_department_id: Number(values.parent_department_id),
      search_branch_head: values.search_branch_head,
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

  const {
    mutateAsync: createOrganizationDepartmentAsync,
    isPending: isCreatingOrganizationDepartment,
  } = useCreateOrganizationDepartment()

  const {
    mutateAsync: updateOrganizationDepartmentAsync,
    isPending: isUpdatingOrganizationDepartment,
  } = useUpdateOrganizationDepartment()

  const {
    data: departmentDetails,
    isLoading: isLoadingDepartmentDetails,
    isError
  } = useFetchOrganizationDepartmentDetails(
    { department_id: departmentId as number },
    (data) => data.data,
  )

  useEffect(() => {
    const initializeForm = async () => {
      if (departmentId && departmentDetails) {
        const initials = {
          department_head_id: departmentDetails.department_head_id,
          department_name: departmentDetails.department_name,
          notes: departmentDetails.notes,
          search_branch_head: departmentDetails.department_head_name,
          parent_department_id: departmentDetails.parent_department_id
            ? departmentDetails.parent_department_id
            : departmentDetails.id,
          is_generic: departmentDetails.is_generic,
          branch_id: departmentDetails.branch_id,
        }
        form.initialize(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [departmentDetails, departmentId])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Department Information',
      fields: [
        {
          label: 'Department Name',
          name: 'department_name',
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
          label: 'Group Department',
          name: 'parent_department_id',
          type: 'select',
          cols: 6,
          options: departments,
        },
        {
          label: 'Department Head',
          name: 'search_branch_head',
          type: 'search-dropdown',
          alias: 'department_head_id',
          cols: 12,
          options: employees,
          required: true,
        },
        {
          label: 'Description',
          name: 'notes',
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
            await createOrganizationDepartmentAsync(
              payload as TCreateDepartmentPayload,
            )
            form.reset()
          }
          if (type === 'edit' && departmentId) {
            await updateOrganizationDepartmentAsync({
              ...payload,
              id: departmentId,
            } as TUpdateDepartmentPayload)
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
    loading: isCreatingOrganizationDepartment || isUpdatingOrganizationDepartment,
    isLoadingDepartmentDetails,
    isError,
  }
}

export default useCreateEditDepartmentForm
