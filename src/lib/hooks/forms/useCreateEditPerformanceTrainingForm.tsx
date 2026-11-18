import {
  useCreatePerformanceTraining,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useFetchOrganizationTeams,
  useFetchPerformanceTrainingById,
  useGetEmployeeGrades,
  useSearchOrganizationEmployees,
  useUpdatePerformanceTraining,
} from '#/lib/api'
import {
  createPerformanceTrainingInitials,
  editPerformanceTrainingInitials,
  performanceAssignmentCategories,
  performanceTrainingTypes,
} from '#/lib/constants'
import type { TamsBy2ColsFormField, TamsBy2ColsFormFields } from '#/lib/types'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import {
  createPerformanceTrainingSchema,
  editPerformanceTrainingSchema,
} from '#/lib/utils/schema/performance.schema'
import type { TCreatePerformanceTrainingPayload } from '#/lib/utils/schema/performance.schema'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const useCreateEditPerformanceTrainingForm = ({ type, id }: Props) => {
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
        ? createPerformanceTrainingInitials
        : editPerformanceTrainingInitials,
    schema:
      type === 'create'
        ? createPerformanceTrainingSchema
        : editPerformanceTrainingSchema,
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

  const { data: employees } = useSearchOrganizationEmployees(
    {
      query: form.getValues().search_employee
        ? form.getValues().search_employee
        : undefined,
      branch_id: form.getValues().branch_id
        ? Number(form.getValues().branch_id)
        : undefined,
    },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const { data: departments } = useFetchOrganizationDepartments(
    undefined,
    (data) => {
      return form.getValues().branch_id
        ? data.data.results
            .filter(
              (department) =>
                department.station_id === Number(form.getValues().branch_id),
            )
            .map((department) => ({
              label: department.department_name,
              value: department.id.toString(),
            }))
        : data.data.results.map((department) => ({
            label: department.department_name,
            value: department.id.toString(),
          }))
    },
  )

  const { data: grades } = useGetEmployeeGrades((data) => {
    return data.data.results.map((grade) => ({
      label: grade.grade_name,
      value: grade.id.toString(),
    }))
  }, undefined)

  const { data: teams } = useFetchOrganizationTeams(
    { page: 1, perPage: 50 },
    (data) => {
      return data.data.results.map((team) => ({
        label: team.team_name,
        value: team.id.toString(),
      }))
    },
  )

  const mutateAsyncCreatePerformanceTraining = useCreatePerformanceTraining()
  const mutateAsyncUpdatePerformanceTraining = useUpdatePerformanceTraining()

  const {
    data: trainingDetails,
    isLoading: isLoadingTeamDetails,
    isError,
  } = useFetchPerformanceTrainingById((data) => data.data, id, Boolean(id))

  useEffect(() => {
    const initializeForm = async () => {
      if (id && trainingDetails) {
        const initials = {
          title: trainingDetails.title,
          duration_days: trainingDetails.duration_days ?? 0,
          type: trainingDetails.type,
          description: trainingDetails.description,
          file_url: trainingDetails.file_url,
          is_generic: Boolean(trainingDetails.is_generic),
          branch_id: trainingDetails.station_id,
          assignment_category: trainingDetails.assignment_category,
          assignment_ids: trainingDetails.assignment_ids,
          search_employee: undefined,
          id,
        }
        form.initialize(initials)
        form.resetDirty(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [trainingDetails, id])

  const isGeneric = form.useWatchValue('is_generic')
  const assignmentCategory = form.useWatchValue('assignment_category') as
    'branch' | 'department' | 'team' | 'employees' | 'grade'

  form.watch('assignment_category', ({ value }) => {
    if (value === 'branch' && !form.getValues().is_generic) {
      form.setFieldValue('assignment_ids', [
        form.getValues().branch_id as number,
      ])
    } else {
      form.setFieldValue('assignment_ids', [])
    }
  })

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Training Information',
      fields: [
        {
          label: 'Training Name',
          name: 'title',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Training Duration (in days)',
          name: 'duration_days',
          type: 'number',
          cols: 6,
          required: true,
        },
        {
          label: 'Training Type',
          name: 'type',
          type: 'select',
          alias: 'type',
          cols: 6,
          options: performanceTrainingTypes,
          required: true,
        },
        {
          label: 'Content URL',
          name: 'file_url',
          type: 'text',
          cols: 6,
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
    {
      title: 'Assignment Information',
      fields: [
        {
          label: 'All Branches?',
          name: 'is_generic',
          type: 'switch',
          cols: 6,
          required: true,
        },
        ...(isGeneric
          ? ([
              {
                label: 'Assign to',
                name: 'assignment_category',
                type: 'select',
                cols: 6,
                options: performanceAssignmentCategories,
                required: true,
              },
              {
                label: `Select ${assignmentCategory}`,
                name: `assignment_ids`,
                type:
                  assignmentCategory === 'employees'
                    ? 'multi-select-searchable'
                    : 'multi-select',
                alias:
                  assignmentCategory === 'employees'
                    ? 'search_employee'
                    : undefined,
                cols: 12,
                options:
                  assignmentCategory === 'branch'
                    ? branches
                    : assignmentCategory === 'department'
                      ? departments
                      : assignmentCategory === 'team'
                        ? teams
                        : assignmentCategory === 'employees'
                          ? employees
                          : assignmentCategory === 'grade'
                            ? grades
                            : [],
                required: true,
              },
            ] satisfies TamsBy2ColsFormField[])
          : ([
              {
                label: 'Branch',
                name: 'branch_id',
                type: 'select',
                cols: 6,
                options: branches,
                required: true,
              },
              {
                label: 'Assign to',
                name: 'assignment_category',
                type: 'select',
                cols: 6,
                options: performanceAssignmentCategories.map((category) =>
                  category.value === 'branch'
                    ? { label: 'Current Branch', value: 'branch' }
                    : category,
                ),
                required: true,
              },
              {
                label: `Select ${assignmentCategory}`,
                name: `assignment_ids`,
                type:
                  assignmentCategory === 'employees'
                    ? 'multi-select-searchable'
                    : 'multi-select',
                alias:
                  assignmentCategory === 'employees'
                    ? 'search_employee'
                    : undefined,
                cols: 12,
                options:
                  assignmentCategory === 'department'
                    ? departments
                    : assignmentCategory === 'team'
                      ? teams
                      : assignmentCategory === 'employees'
                        ? employees
                        : assignmentCategory === 'grade'
                          ? grades
                          : [],
                required: true,
                hidden: assignmentCategory === 'branch',
              },
            ] satisfies TamsBy2ColsFormField[])),
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const { search_employee, ...payload } =
            values as TCreatePerformanceTrainingPayload
          if (type === 'create') {
            const response =
              await mutateAsyncCreatePerformanceTraining.mutateAsync(payload)
            if (response?.data?.id) {
              navigate({
                to: '/admin-dashboard/performance/training/edit',
                search: { trainingId: response.data.id },
              })
            }
          }
          if (type === 'edit' && id) {
            await mutateAsyncUpdatePerformanceTraining.mutateAsync({
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
      mutateAsyncCreatePerformanceTraining.isPending ||
      mutateAsyncUpdatePerformanceTraining.isPending,
    isLoadingTeamDetails,
    isError,
  }
}

export default useCreateEditPerformanceTrainingForm
