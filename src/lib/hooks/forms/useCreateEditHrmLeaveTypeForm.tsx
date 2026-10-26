import {
  useCreateHrmLeaveType,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useGetEmployeeGrades,
  useGetHrmLeaveTypeById,
  useSearchOrganizationEmployees,
  useUpdateHrmLeaveType,
} from '#/lib/api'
import {
  createHrmLeaveTypeInitials,
  editHrmLeaveTypeInitials,
  hrmLeaveTypeCategory,
} from '#/lib/constants'
import type { TamsBy2ColsFormField, TamsBy2ColsFormFields } from '#/lib/types'
import {
  createHrmLeaveTypeSchema,
  editHrmLeaveTypeSchema,
  getErrorMessage,
} from '#/lib/utils'
import type { TCreateHrmLeaveTypePayload } from '#/lib/utils'
import { notifications } from '@mantine/notifications'
import useTamsForm from '../useTamsForm'
import { useEffect, useState } from 'react'

type Props = {
  type: 'create' | 'edit'
  id?: number
  closeActionWidget: () => void
}

const useCreateEditHrmLeaveTypeForm = ({
  type,
  id,
  closeActionWidget,
}: Props) => {
  const [isDirty, setIsDirty] = useState(false)

  const form = useTamsForm({
    defaultValues:
      type === 'create' ? createHrmLeaveTypeInitials : editHrmLeaveTypeInitials,
    schema:
      type === 'create' ? createHrmLeaveTypeSchema : editHrmLeaveTypeSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        setIsDirty(true)
      } else {
        setIsDirty(false)
      }
    },
    transformValues: (values) => {
      if (values.category_type === 'all_users') {
        delete values['employees']
        delete values['departments']
        delete values['grades']
        return values
      }

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

  const { data: organizationDepartmentsData } = useFetchOrganizationDepartments(
    undefined,
    (data) =>
      data.data.results.map((department) => ({
        value: department.id.toString(),
        label: department.department_name,
      })),
  )

  const { data: employeeGradesData } = useGetEmployeeGrades((data) =>
    data.data.results.map((grade) => ({
      value: grade.id.toString(),
      label: grade.grade_name,
    })),
  )

  const { data: organizationEmployeesData } = useSearchOrganizationEmployees(
    { query: form.getValues()['employee_query'] as string },
    (data) =>
      data.data.map((employee) => ({
        value: employee.id.toString(),
        label: employee.name,
      })),
  )

  const { data: hrmLeaveTypeDetailsData } = useGetHrmLeaveTypeById(
    id as number,
    (data) => data.data,
  )

  const createHrmLeaveTypeMutation = useCreateHrmLeaveType()
  const updateHrmLeaveTypeMutation = useUpdateHrmLeaveType()

  useEffect(() => {
    const initializeForm = async () => {
      if (id && hrmLeaveTypeDetailsData) {
        const initials = {
          id: hrmLeaveTypeDetailsData.id,
          leave_name: hrmLeaveTypeDetailsData.leave_name,
          period_type: hrmLeaveTypeDetailsData.period_type,
          applicable_days: hrmLeaveTypeDetailsData.applicable_days,
          exclude_public_holidays: Boolean(
            hrmLeaveTypeDetailsData.exclude_public_holidays,
          ),
          weekend:
            hrmLeaveTypeDetailsData.weekend === 'No Weekend'
              ? []
              : hrmLeaveTypeDetailsData.weekend === 'Weekend'
                ? ['Saturday', 'Sunday']
                : ([hrmLeaveTypeDetailsData.weekend] as string[]),
          note: hrmLeaveTypeDetailsData.note,
          is_paid: Boolean(hrmLeaveTypeDetailsData.is_paid),
          isGenderBased: Boolean(hrmLeaveTypeDetailsData.gender),
          gender: !hrmLeaveTypeDetailsData.gender
            ? ''
            : hrmLeaveTypeDetailsData.gender,
          category_type: hrmLeaveTypeDetailsData.category_type,
          branch_id: hrmLeaveTypeDetailsData.station_id,
          is_generic: hrmLeaveTypeDetailsData.is_generic,
          isApplicableToAllBranches: Boolean(
            !hrmLeaveTypeDetailsData.station_id,
          ),
          departments: hrmLeaveTypeDetailsData.departments,
          grades: hrmLeaveTypeDetailsData.employeeGrades,
          employees: hrmLeaveTypeDetailsData.employees,
        }
        form.initialize(initials)
        form.setValues(initials)
      }
    }
    initializeForm()
  }, [hrmLeaveTypeDetailsData, id])

  const isGenderBased = form.getValues()['isGenderBased']
  const categoryType = form.getValues()['category_type']

  form.watch('isApplicableToAllBranches', ({ value }) => {
    form.setValues({ is_generic: value ? 1 : 0 })
  })

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Leave type Information',
      fields: [
        {
          label: 'Leave type name',
          name: 'leave_name',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Duration (in days)',
          name: 'applicable_days',
          type: 'number',
          cols: 6,
          required: true,
        },
        {
          label: 'Exclude Public Holidays',
          name: 'exclude_public_holidays',
          type: 'switch',
          cols: 6,
        },
        {
          label: 'Include Weekends',
          name: 'weekend',
          type: 'multi-select',
          cols: 6,
          options: [
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' },
          ],
        },
        {
          label: 'Description',
          name: 'note',
          type: 'textarea',
          cols: 12,
        },
        {
          label: 'Is a Paid Leave?',
          name: 'is_paid',
          type: 'switch',
          cols: isGenderBased ? 4 : 6,
        },
        {
          label: 'Is a Gender Based Leave?',
          name: 'isGenderBased',
          type: 'switch',
          cols: isGenderBased ? 5 : 6,
        },
        ...(isGenderBased
          ? ([
              {
                label: 'Select Gender',
                name: 'gender',
                type: 'select',
                cols: isGenderBased ? 3 : 0,
                options: [
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ],
              },
            ] satisfies TamsBy2ColsFormField[])
          : []),
      ],
    },
    {
      title: 'Apply Leave type to',
      fields: [
        {
          label: 'Apply to all branches',
          name: 'isApplicableToAllBranches',
          type: 'switch',
          cols: 6,
        },
        ...(form.getValues()['isApplicableToAllBranches'] === false
          ? ([
              {
                label: 'Select Branch',
                name: 'branch_id',
                type: 'select',
                cols: 6,
                options: organizationBranchesData, // Populate with branch options
              },
            ] satisfies TamsBy2ColsFormField[])
          : []),
      ],
    },
    {
      title: 'Assign Leave Type to',
      description:
        'who is eligible for this leave type? All employees, specific departments or specific employees',
      fields: [
        {
          label: 'Category Type',
          name: 'category_type',
          type: 'select',
          cols: 6,
          options: hrmLeaveTypeCategory,
        },
        ...(categoryType !== 'all_users'
          ? ([
              {
                label:
                  categoryType === 'department'
                    ? 'Select Department'
                    : categoryType === 'station_grade'
                      ? 'Select Grade'
                      : 'Select Employee',
                name:
                  categoryType === 'department'
                    ? 'departments'
                    : categoryType === 'station_grade'
                      ? 'grades'
                      : 'employees',
                type:
                  categoryType === 'employees'
                    ? 'multi-select-searchable'
                    : 'select',
                cols: 6,
                options:
                  categoryType === 'department'
                    ? organizationDepartmentsData
                    : categoryType === 'station_grade'
                      ? employeeGradesData
                      : organizationEmployeesData,
                alias: 'employee_query',
              },
            ] satisfies TamsBy2ColsFormField[])
          : []),
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const {
            isGenderBased: is_gender_based,
            employee_query,
            isApplicableToAllBranches,
            ...restPayload
          } = values as TCreateHrmLeaveTypePayload
          if (type === 'create') {
            await createHrmLeaveTypeMutation.mutateAsync(restPayload)

            form.reset()
            closeActionWidget()
          }
          if (type === 'edit' && id) {
            restPayload.gender = is_gender_based ? values.gender : null
            await updateHrmLeaveTypeMutation.mutateAsync({ id, ...restPayload })
          }
          closeActionWidget()
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          notifications.show({
            title: 'Error',
            message: errorMessage,
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
  }
  return {
    isDetailLoading: false,
    isDirty,
    form,
    fields,
    handleSubmit,
    handleCancel,
    loading: createHrmLeaveTypeMutation.isPending,
    isUpdating: true,
  }
}

export default useCreateEditHrmLeaveTypeForm
