import {
  useCreateAppraisalGroup,
  useFetchAppraisalGroup,
  useFetchPerformanceAppraisalGeneralSettingsResponse,
  useFetchPerformanceAppraiserSettings,
  useFetchPerformanceApproverSettings,
  useUpdateAppraisalGroup,
} from '#/lib/api'
import { createAppraisalGroupInitials } from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import type {
  TAppraisalPerformanceArea,
  TCreateAppraisalGroupPayload,
  TUpdateAppraisalGroupPayload,
} from '#/lib/types/api/performance'
import { createAppraisalGroupSchema } from '#/lib/utils/schema/performance.schema'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import useTamsForm from '../useTamsForm'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const useCreateEditAppraisalGroupForm = ({ type, id }: Props) => {
  const navigate = useNavigate()
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure(false)

  const form = useTamsForm({
    defaultValues: createAppraisalGroupInitials,
    schema: createAppraisalGroupSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) openActionWidget()
      else closeActionWidget()
    },
  })

  const { data: generalSettings } =
    useFetchPerformanceAppraisalGeneralSettingsResponse(
      (response) => response.data[0],
      { page: 1, perPage: 100 },
    )
  const { data: appraiserSettings } = useFetchPerformanceAppraiserSettings(
    (response) => ({
      results: response.data.results.map((setting) => ({
        label: setting.description,
        value: String(setting.id),
      })),
    }),
    { page: 1, perPage: 100 },
  )
  const { data: approverSettings } = useFetchPerformanceApproverSettings(
    (response) => ({
      results: response.data.results.map((setting) => ({
        label: setting.name,
        value: String(setting.id),
      })),
    }),
    { page: 1, perPage: 100 },
  )

  const {
    data: detailResponse,
    isLoading,
    isError,
  } = useFetchAppraisalGroup(id ?? 0, type === 'edit' && !!id)

  useEffect(() => {
    if (type === 'edit' && detailResponse?.data) {
      const group = detailResponse.data
      const initials = {
        ...createAppraisalGroupInitials,
        id: group.id,
        name: group.name,
        description: group.description ?? '',
        appraisal_period_id: group.appraisal_period_id,
        appraiser_settings_id: group.appraiser_settings_id,
        approver_settings_id: group.approver_settings_id,
        appraisal_year: group.appraisal_year,
        apply_grade_settings: group.apply_grade_settings,
        is_active: group.is_active,
        performance_areas: group.performanceAreas ?? [],
      }
      form.initialize(initials)
      form.resetDirty(initials)
      closeActionWidget()
    }
  }, [detailResponse, type, id])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Appraisal Group Information',
      fields: [
        {
          label: 'Appraisal Group Name',
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
        },
        {
          label: 'Appraisal Period',
          name: 'appraisal_period_id',
          type: 'select',
          cols: 6,
          required: true,
          options:
            generalSettings?.appraisalPeriods?.map((period) => ({
              label: period.name,
              value: String(period.id),
            })) ?? [],
        },
        {
          label: 'Appraisal Year',
          name: 'appraisal_year',
          type: 'number',
          cols: 6,
          required: true,
        },
        {
          label: 'Appraiser Settings',
          name: 'appraiser_settings_id',
          type: 'select',
          cols: 6,
          required: true,
          options: appraiserSettings?.results ?? [],
        },
        {
          label: 'Approver Settings',
          name: 'approver_settings_id',
          type: 'select',
          cols: 6,
          required: true,
          options: approverSettings?.results ?? [],
        },
        {
          label: 'Apply grade settings',
          name: 'apply_grade_settings',
          type: 'switch',
          cols: 6,
        },
        {
          label: 'Active',
          name: 'is_active',
          type: 'switch',
          cols: 6,
        },
      ],
    },
  ]

  const performanceAreas =
    (form.getValues().performance_areas as TAppraisalPerformanceArea[]) ?? []

  const setPerformanceAreas = (areas: TAppraisalPerformanceArea[]) => {
    form.setFieldValue('performance_areas', areas)
  }

  const validateAreas = (areas: TAppraisalPerformanceArea[]) => {
    if (!areas.length) {
      notifications.show({
        title: 'Invalid appraisal group',
        message: 'Add at least one performance area.',
        color: 'red',
      })
      return false
    }
    if (areas.reduce((sum, area) => sum + Number(area.weight), 0) !== 100) {
      notifications.show({
        title: 'Invalid appraisal weights',
        message: 'Performance area weights must total 100.',
        color: 'red',
      })
      return false
    }
    for (const area of areas) {
      if (
        area.kpi_categories.reduce(
          (sum, category) => sum + Number(category.weight),
          0,
        ) !== area.weight
      ) {
        notifications.show({
          title: 'Invalid KPI weights',
          message: `KPI weights in "${area.name || 'the performance area'}" must total ${area.weight}.`,
          color: 'red',
        })
        return false
      }
      for (const category of area.kpi_categories) {
        const subcategories = category.kpi_sub_categories ?? []
        if (
          subcategories.length &&
          subcategories.reduce(
            (sum, subcategory) => sum + Number(subcategory.weight),
            0,
          ) !== category.weight
        ) {
          notifications.show({
            title: 'Invalid subcategory weights',
            message: `KPI subcategory weights in "${category.name || 'the KPI'}" must total ${category.weight}.`,
            color: 'red',
          })
          return false
        }
      }
    }
    return true
  }

  const createMutation = useCreateAppraisalGroup()
  const updateMutation = useUpdateAppraisalGroup()

  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        if (!validateAreas(performanceAreas)) return
        try {
          if (type === 'create') {
            const payload: TCreateAppraisalGroupPayload = {
              name: values.name.trim(),
              description: values.description.trim(),
              appraisal_period_id: Number(values.appraisal_period_id),
              appraiser_settings_id: Number(values.appraiser_settings_id),
              approver_settings_id: Number(values.approver_settings_id),
              appraisal_year: Number(values.appraisal_year),
              apply_grade_settings: values.apply_grade_settings,
              is_active: values.is_active,
              performance_areas: performanceAreas,
            }
            await createMutation.mutateAsync(payload)
          } else if (id) {
            const payload: TUpdateAppraisalGroupPayload = {
              id,
              name: values.name.trim(),
              description: values.description.trim(),
              appraisal_period_id: Number(values.appraisal_period_id),
              appraiser_settings_id: Number(values.appraiser_settings_id),
              approver_settings_id: Number(values.approver_settings_id),
              appraisal_year: Number(values.appraisal_year),
              apply_grade_settings: values.apply_grade_settings,
              is_active: values.is_active,
              performance_areas: performanceAreas,
            }
            await updateMutation.mutateAsync(payload)
          }
          closeActionWidget()
          navigate({
            to: '/admin-dashboard/performance/appraisal',
          })
        } catch (error) {
          console.error('Error submitting appraisal group', error)
        }
      },
      (errors) => console.log('errors', errors),
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
    handleSubmit,
    handleCancel,
    loading: createMutation.isPending || updateMutation.isPending,
    isLoading,
    isError,
    performanceAreas,
    setPerformanceAreas,
  }
}

export default useCreateEditAppraisalGroupForm
