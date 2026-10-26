import {
  useCreateHrmLeaveApprover,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useGetEmployeeGrades,
  useGetHrmLeaveApproversById,
  useSearchOrganizationEmployees,
  useUpdateHrmLeaveApprover,
} from '#/lib/api'
import {
  createHrmLeaveApproverInitials,
  editHrmLeaveApproverInitials,
  hrmLeaveApproverCategory,
  hrmLeaveApproverTypes,
} from '#/lib/constants'
import type { TamsBy2ColsFormField, TamsBy2ColsFormFields } from '#/lib/types'
import { createHrmLeaveApproverSchema, getErrorMessage } from '#/lib/utils'
import type { TCreateHrmLeaveApproverPayload } from '#/lib/utils'
import { notifications } from '@mantine/notifications'
import useTamsForm from '../useTamsForm'
import { useEffect, useState } from 'react'
import { ActionIcon, Group } from '@mantine/core'
import { TamsButton, TamsSelectInput } from '#/components'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { randomId } from '@mantine/hooks'

type Props = {
  type: 'create' | 'edit'
  id?: number
  closeActionWidget: () => void
  opened?: boolean
}

const useCreateEditHrmLeaveApproverForm = ({
  type,
  id,
  closeActionWidget,
  opened,
}: Props) => {
  const [isDirty, setIsDirty] = useState(false)
  const [listIndex, setListIndex] = useState<number>(0)

  const form = useTamsForm({
    defaultValues:
      type === 'create'
        ? {
            ...createHrmLeaveApproverInitials,
            approver_details: [
              {
                approver_person_id: 0,
                alt_approver_person_id: 0,
                key: randomId(),
                searchValue: '',
                searchValueAlt: '',
              },
            ] as {
              approver_person_id: number
              alt_approver_person_id: number
              key: string
              searchValue: string
              searchValueAlt: string
            }[],
          }
        : {
            ...editHrmLeaveApproverInitials,
            approver_details: [
              {
                approver_person_id: 0,
                alt_approver_person_id: 0,
                key: randomId(),
                searchValue: '',
                searchValueAlt: '',
              },
            ] as {
              approver_person_id: number
              alt_approver_person_id: number
              key: string
              searchValue: string
              searchValueAlt: string
            }[],
          },
    schema: createHrmLeaveApproverSchema,

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
        no_approvals: Number(values.approver_details?.length),
        approver_details: values.approver_details?.map((i) => ({
          approver_person_id: Number(i.approver_person_id),
          alt_approver_person_id: Number(i.alt_approver_person_id),
        })),
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

  const { data: organizationEmployeesData } = useSearchOrganizationEmployees(
    { query: form.getValues()['employee_query'] as string },
    (data) =>
      data.data.map((employee) => ({
        value: employee.id.toString(),
        label: employee.name,
      })),
  )

  const { data: organizationEmployeesDataForListItems } =
    useSearchOrganizationEmployees(
      {
        query: form.getValues()?.approver_details?.[listIndex]
          ?.searchValue as string,
      },
      (data) =>
        data.data.map((employee) => ({
          value: employee.id.toString(),
          label: employee.name,
        })),
    )

  const { data: organizationEmployeesDataForListItemsAlt } =
    useSearchOrganizationEmployees(
      {
        query: form.getValues()?.approver_details?.[listIndex]
          ?.searchValueAlt as string,
      },
      (data) =>
        data.data.map((employee) => ({
          value: employee.id.toString(),
          label: employee.name,
        })),
    )

  const { data: hrmLeaveApproverDetailsData } = useGetHrmLeaveApproversById(
    id as number,
    (data) => data.data,
    opened,
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

  const createHrmLeaveApproverMutation = useCreateHrmLeaveApprover()
  const updateHrmLeaveApproverMutation = useUpdateHrmLeaveApprover()

  useEffect(() => {
    const initializeForm = async () => {
      if (id && hrmLeaveApproverDetailsData) {
        const initials = {
          id: hrmLeaveApproverDetailsData.id,
          description: hrmLeaveApproverDetailsData.description,
          approval_types: hrmLeaveApproverDetailsData.approval_types,
          category_type: hrmLeaveApproverDetailsData.category_type as
            'employees' | 'department' | 'station_grade' | 'branch',
          employees: hrmLeaveApproverDetailsData.employees?.map(
            (employee) => employee.id,
          ),
          branch_id: hrmLeaveApproverDetailsData.station_id,
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

  const categoryType = form.getValues()['category_type']

  const listItems = (
    <section className="space-y-2">
      <div className="space-y-2.5">
        {form.getValues().approver_details?.map((_, index) => (
          <Group key={index} align="flex-end" mt="xs">
            <TamsSelectInput
              placeholder="Select Approver"
              label="Approver"
              onFocusCapture={() => setListIndex(index)}
              withAsterisk
              style={{ flex: 1 }}
              key={form.key(`approver_details.${index}.approver_person_id`)}
              {...form.getInputProps(
                `approver_details.${index}.approver_person_id`,
              )}
              searchable
              onSearchChange={(v) =>
                form.setFieldValue(`approver_details.${index}.searchValue`, v)
              }
              searchValue={
                form.getValues()?.approver_details?.[index]?.searchValue
              }
              data={organizationEmployeesDataForListItems}
            />

            <TamsSelectInput
              placeholder="Select Alt Approver"
              label="Alt Approver"
              onFocusCapture={() => {
                setListIndex(index)
              }}
              style={{ flex: 1 }}
              key={form.key(`approver_details.${index}.alt_approver_person_id`)}
              {...form.getInputProps(
                `approver_details.${index}.alt_approver_person_id`,
              )}
              onSearchChange={(v) =>
                form.setFieldValue(
                  `approver_details.${index}.searchValueAlt`,
                  v,
                )
              }
              searchValue={
                form.getValues()?.approver_details?.[index]?.searchValueAlt
              }
              searchable
              data={organizationEmployeesDataForListItemsAlt}
            />

            <ActionIcon
              color="red"
              variant="light"
              onClick={() => form.removeListItem('approver_details', index)}
            >
              <TrashIcon size={16} />
            </ActionIcon>
          </Group>
        ))}
      </div>
      <div>
        <TamsButton
          leftSection={<PlusIcon size={16} />}
          variant="outline"
          onClick={() =>
            form.insertListItem('approver_details', {
              approver_person_id: 0,
              alt_approver_person_id: 0,
              key: randomId(),
            })
          }
        >
          Add Approver
        </TamsButton>
      </div>
    </section>
  )

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Leave type Information',
      fields: [
        {
          label: 'Approval List name',
          name: 'description',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Approval Types',
          name: 'approval_types',
          type: 'select',
          cols: 6,
          options: hrmLeaveApproverTypes,
          required: true,
        },
        {
          label: 'Category Type',
          name: 'category_type',
          type: 'select',
          cols: 4,
          options: hrmLeaveApproverCategory,
          required: true,
        },
        ...(categoryType
          ? ([
              {
                label:
                  categoryType === 'employees'
                    ? 'Select Employees'
                    : categoryType === 'branch'
                      ? 'Select Branches'
                      : 'Select a Branch',

                name:
                  categoryType === 'employees'
                    ? 'employees'
                    : categoryType === 'branch'
                      ? 'branches'
                      : 'branch_id',
                type:
                  categoryType === 'employees'
                    ? 'multi-select-searchable'
                    : categoryType === 'branch'
                      ? 'multi-select'
                      : 'select',
                cols: 8,
                required: true,
                options:
                  categoryType === 'employees'
                    ? organizationEmployeesData
                    : organizationBranchesData,

                alias:
                  categoryType === 'employees' ? 'employee_query' : undefined,
              },
            ] satisfies TamsBy2ColsFormField[])
          : []),
        ...(categoryType === 'department' || categoryType === 'station_grade'
          ? ([
              {
                label:
                  categoryType === 'department'
                    ? 'Select Departments'
                    : 'Select Grades',
                name: categoryType === 'department' ? 'departments' : 'grades',
                type: 'multi-select',
                cols: 12,
                required: true,
                options:
                  categoryType === 'department'
                    ? organizationDepartmentsData
                    : employeeGradesData,
              },
            ] satisfies TamsBy2ColsFormField[])
          : []),
      ],
    },
    {
      title: 'Approver Details',
      fields: [
        {
          label: 'Apply to all branches',
          name: 'isApplicableToAllBranches',
          type: 'list',
          cols: 12,
          listItems,
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const { employee_query, ...restPayload } =
            values as TCreateHrmLeaveApproverPayload
          if (type === 'create') {
            await createHrmLeaveApproverMutation.mutateAsync(restPayload)

            form.reset()
            closeActionWidget()
          }
          if (type === 'edit' && id) {
            await updateHrmLeaveApproverMutation.mutateAsync({
              id,
              ...restPayload,
            })
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
    loading:
      createHrmLeaveApproverMutation.isPending ||
      updateHrmLeaveApproverMutation.isPending,
    isUpdating: true,
  }
}

export default useCreateEditHrmLeaveApproverForm
