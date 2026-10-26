import { TamsButton } from '#/components'
import {
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useGetEmployeeCategories,
  useGetEmployeeDesignations,
  useGetEmployeeGrades,
  useGetEmployeeRoles,
  useGetEmployeeTypes,
  useGetNextFreePin,
  useInviteEmployee,
} from '#/lib/api'
import { inviteEmployeeInitials } from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { inviteEmployeeSchema } from '#/lib/utils'
import type { TInviteEmployeesPayload } from '#/lib/utils'
import useTamsForm from '../useTamsForm'
import { useState } from 'react'

type Props = {
  closeActionWidget: () => void
}

const useCreateEditHrmExemptionApproverForm = ({
  closeActionWidget,
}: Props) => {
  const [isDirty, setIsDirty] = useState(false)

  const form = useTamsForm({
    defaultValues: inviteEmployeeInitials,
    schema: inviteEmployeeSchema,

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

  const { data: organizationBranchesData } = useFetchOrganizationBranches(
    undefined,
    (data) =>
      data.data.results.map((branch) => ({
        value: branch.id.toString(),
        label: branch.station_name,
      })),
  )

  const { data: organizationDepartments } = useFetchOrganizationDepartments(
    undefined,
    (data) => data.data.results,
  )

  const { data: employeeGrades } = useGetEmployeeGrades(
    (data) => data.data.results,
  )

  const { data: employeeRoles } = useGetEmployeeRoles((data) =>
    data.data.results.map((role) => ({
      value: role.id.toString(),
      label: role.name,
    })),
  )

  const generateNewPin = useGetNextFreePin()

  const inviteEmployee = useInviteEmployee()

  const { data: employeeType } = useGetEmployeeTypes(
    (data) => data.data.results,
  )

  const { data: employeeCategory } = useGetEmployeeCategories(
    (data) => data.data.results,
  )

  const { data: employeeDesignation } = useGetEmployeeDesignations(
    (data) => data.data.results,
  )

  const organizationDepartmentsData = organizationDepartments
    ?.filter(
      (department) =>
        department.station_id === Number(form.getValues()['branch_id']),
    )
    .map((department) => ({
      value: department.id.toString(),
      label: department.department_name,
    }))

  const employeeGradesData = employeeGrades
    ?.filter(
      (grade) => grade.station_id == Number(form.getValues()['branch_id']),
    )
    .map((grade) => ({
      value: grade.id.toString(),
      label: grade.grade_name,
    }))

  const employeeTypes = employeeType
    ?.filter((type) => type.station_id == Number(form.getValues()['branch_id']))
    .map((type) => ({
      value: type.id.toString(),
      label: type.type_name,
    }))

  const employeeCategories = employeeCategory
    ?.filter(
      (category) =>
        category.station_id == Number(form.getValues()['branch_id']),
    )
    .map((category) => ({
      value: category.id.toString(),
      label: category.category_name,
    }))

  const employeeDesignations = employeeDesignation
    ?.filter(
      (designation) =>
        designation.station_id == Number(form.getValues()['branch_id']),
    )
    .map((designation) => ({
      value: designation.id.toString(),
      label: designation.designation_name,
    }))

  const handleGenerateNewPin = async () => {
    try {
      const response = await generateNewPin.mutateAsync({
        excludePins: JSON.stringify([]),
      })
      form.setFieldValue('pin', response.data.pin)
    } catch (error) {
      console.error('Failed to generate new PIN:', error)
    }
  }

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Personal Information',
      fields: [
        {
          label: 'First Name',
          name: 'first_name',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Last Name',
          name: 'last_name',
          type: 'text',
          cols: 6,
          required: true,
        },
      ],
    },
    {
      title: 'Employment Information',
      fields: [
        {
          label: 'Branch',
          name: 'branch_id',
          type: 'select',
          cols: 6,
          options: organizationBranchesData,
          required: true,
        },
        {
          label: 'Department',
          name: 'department_id',
          type: 'select',
          cols: 6,
          options: organizationDepartmentsData,
          required: true,
        },
        {
          label: 'Employee Grade',
          name: 'employee_grade_id',
          type: 'select',
          cols: 6,
          options: employeeGradesData,
          required: true,
        },
        {
          label: 'Employee Designation',
          name: 'employee_designation_id',
          type: 'select',
          cols: 6,
          options: employeeDesignations,
          required: true,
        },
        {
          label: 'Employee Type',
          name: 'employee_type_id',
          type: 'select',
          cols: 6,
          options: employeeTypes,
          required: true,
        },
        {
          label: 'Employee Category',
          name: 'employee_category_id',
          type: 'select',
          cols: 6,
          options: employeeCategories,
          required: true,
        },
      ],
    },
    {
      title: 'User Information',
      fields: [
        {
          label: 'Email',
          name: 'email',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Roles',
          name: 'roles',
          type: 'multi-select',
          cols: 6,
          options: employeeRoles,
          required: true,
        },
        {
          label: 'Pin',
          name: 'pin',
          type: 'number',
          readonly: true,
          cols: 9,
          required: true,
        },
        {
          label: '',
          name: '',
          type: 'list',
          cols: 3,
          listItems: (
            <div className="flex h-full">
              <TamsButton
                onClick={handleGenerateNewPin}
                className="mt-auto block"
              >
                Generate new pin
              </TamsButton>
            </div>
          ),
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const payload = values as TInviteEmployeesPayload

          await inviteEmployee.mutateAsync(payload)

          form.reset()
          closeActionWidget()
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
    loading: inviteEmployee.isPending,
    isUpdating: true,
  }
}

export default useCreateEditHrmExemptionApproverForm
