import {
  useCreateFeedbackSurvey,
  useFetchFeedbackSurvey,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useFetchOrganizationTeams,
  useGetEmployeeGrades,
  useSearchOrganizationEmployees,
  useUpdateFeedbackSurvey,
} from '#/lib/api'
import {
  createFeedbackSurveyInitials,
  editFeedbackSurveyInitials,
} from '#/lib/constants'
import type { TamsBy2ColsFormField, TamsBy2ColsFormFields } from '#/lib/types'
import type { TCreateFeedbackSurveyPayload } from '#/lib/types/api/performance'
import {
  createFeedbackSurveySchema,
  editFeedbackSurveySchema,
} from '#/lib/utils/schema/performance.schema'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import useTamsForm from '../useTamsForm'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const feedbackCategories = [
  { label: 'Employees', value: 'employees' },
  { label: 'Department', value: 'department' },
  { label: 'Grade', value: 'grade' },
  { label: 'Branch', value: 'branch' },
  { label: 'Team', value: 'team' },
]

const useCreateEditFeedbackSurveyForm = ({ type, id }: Props) => {
  const navigate = useNavigate()
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const form = useTamsForm({
    defaultValues:
      type === 'create'
        ? createFeedbackSurveyInitials
        : editFeedbackSurveyInitials,
    schema:
      type === 'create' ? createFeedbackSurveySchema : editFeedbackSurveySchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        openActionWidget()
      } else {
        closeActionWidget()
      }
    },
  })

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) =>
    data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    })),
  )
  const { data: departments } = useFetchOrganizationDepartments(
    undefined,
    (data) =>
      data.data.results.map((department) => ({
        label: department.department_name,
        value: department.id.toString(),
      })),
  )
  const { data: teams } = useFetchOrganizationTeams(
    { page: 1, perPage: 100 },
    (data) =>
      data.data.results.map((team) => ({
        label: team.team_name,
        value: team.id.toString(),
      })),
  )
  const { data: grades } = useGetEmployeeGrades(
    (data) =>
      data.data.results.map((grade) => ({
        label: grade.grade_name,
        value: grade.id.toString(),
      })),
    { page: 1, perPage: 100 },
  )
  const { data: employees } = useSearchOrganizationEmployees(
    {
      query:
        (
          form.getValues() as Record<string, unknown>
        ).assign_search?.toString() ||
        (
          form.getValues() as Record<string, unknown>
        ).apply_search?.toString() ||
        ' ',
    },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const createMutation = useCreateFeedbackSurvey()
  const updateMutation = useUpdateFeedbackSurvey()
  const {
    data: detailResponse,
    isLoading,
    isError,
  } = useFetchFeedbackSurvey(id ?? 0, type === 'edit' && !!id)

  useEffect(() => {
    if (type === 'edit' && detailResponse?.data) {
      const feedback = detailResponse.data
      const initials = {
        ...editFeedbackSurveyInitials,
        id: feedback.id,
        name: feedback.name,
        description: feedback.description,
        allow_participants_view_answers:
          feedback.allow_participants_view_answers,
      }
      form.initialize(initials)
      form.resetDirty(initials)
      closeActionWidget()
    }
  }, [detailResponse, type, id])

  const assignCategory = form.useWatchValue('assign_to_category') as
    'employees' | 'department' | 'grade' | 'branch' | 'team'
  const applyCategory = form.useWatchValue('apply_to_category') as
    'employees' | 'department' | 'grade' | 'branch' | 'team'

  form.watch('assign_to_category', () => {
    form.setFieldValue('assign_to_ids', [])
  })
  form.watch('apply_to_category', () => {
    form.setFieldValue('apply_to_ids', [])
  })

  const categoryOptions = (
    category: 'employees' | 'department' | 'grade' | 'branch' | 'team',
  ) =>
    category === 'department'
      ? departments
      : category === 'team'
        ? teams
        : category === 'grade'
          ? grades
          : category === 'employees'
            ? employees
            : branches

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Feedback Information',
      fields: [
        {
          label: 'Feedback Title',
          name: 'name',
          type: 'text',
          cols: 12,
          required: true,
        },
        {
          label: 'Description',
          name: 'description',
          type: 'textarea',
          cols: 12,
          required: true,
        },
        {
          label: 'Allow participants to view feedback answers',
          name: 'allow_participants_view_answers',
          type: 'switch',
          cols: 12,
        },
      ],
    },
    ...(type === 'create'
      ? [
          {
            title: 'Assignment Information',
            fields: [
              {
                label: 'Assign feedback to',
                name: 'assign_to_category',
                type: 'select',
                cols: 6,
                options: feedbackCategories,
                required: true,
              },
              {
                label: `Select ${assignCategory}`,
                name: 'assign_to_ids',
                type:
                  assignCategory === 'employees'
                    ? 'multi-select-searchable'
                    : 'multi-select',
                alias:
                  assignCategory === 'employees' ? 'assign_search' : undefined,
                cols: 6,
                options: categoryOptions(assignCategory),
                required: true,
              },
              {
                label: 'Apply feedback to',
                name: 'apply_to_category',
                type: 'select',
                cols: 6,
                options: feedbackCategories,
                required: true,
              },
              {
                label: `Select ${applyCategory}`,
                name: 'apply_to_ids',
                type:
                  applyCategory === 'employees'
                    ? 'multi-select-searchable'
                    : 'multi-select',
                alias:
                  applyCategory === 'employees' ? 'apply_search' : undefined,
                cols: 6,
                options: categoryOptions(applyCategory),
                required: true,
              },
            ] satisfies TamsBy2ColsFormField[],
          },
        ]
      : []),
  ]

  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          if (type === 'create') {
            if (
              !values.assign_to_ids.length ||
              !values.apply_to_ids.length ||
              !values.survey_questions.some(
                (question: { question: string }) =>
                  question.question.trim().length > 0,
              )
            ) {
              return
            }
            const payload: TCreateFeedbackSurveyPayload = {
              name: values.name.trim(),
              description: values.description.trim(),
              allow_participants_view_answers:
                values.allow_participants_view_answers,
              assign_to_category: values.assign_to_category,
              assign_to_ids: values.assign_to_ids.map(Number),
              apply_to_category: values.apply_to_category,
              apply_to_ids: values.apply_to_ids.map(Number),
              survey_questions: values.survey_questions
                .filter((question: { question: string }) =>
                  question.question.trim(),
                )
                .map(
                  (question: {
                    question: string
                    required: boolean
                    type: TCreateFeedbackSurveyPayload['survey_questions'][number]['type']
                    type_value?: string[]
                  }) => ({
                    ...question,
                    question: question.question.trim(),
                  }),
                ),
            }
            await createMutation.mutateAsync(payload)
            form.reset()
            navigate({ to: '/admin-dashboard/performance/feedback' })
          } else if (type === 'edit' && id) {
            await updateMutation.mutateAsync({
              id,
              name: values.name.trim(),
              description: values.description.trim(),
              allow_participants_view_answers:
                values.allow_participants_view_answers,
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
    loading: createMutation.isPending || updateMutation.isPending,
    isLoading,
    isError,
  }
}

export default useCreateEditFeedbackSurveyForm
