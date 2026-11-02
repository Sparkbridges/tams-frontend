import { useEffect } from 'react'
import { schemaResolver, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import {
  useCreateWorkshift,
  useShiftBranches,
  useShiftTypes,
  useUpdateWorkshift,
  useWorkshift,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { shiftDays, workshiftSchema } from '#/lib/utils/schema/workshift.schema'

export default function useCreateEditWorkshiftForm({ id }: { id?: number }) {
  const access = useWorkshiftAccess()
  const editing = id !== undefined
  const allowed = editing ? access.canView && access.canEdit : access.canCreate
  const detail = useWorkshift(id ?? 0)
  const branches = useShiftBranches(allowed)
  const types = useShiftTypes()
  const create = useCreateWorkshift()
  const update = useUpdateWorkshift()
  const navigate = useNavigate()
  const [openedActionWidget, { open, close }] = useDisclosure()
  const form = useForm({
    initialValues: {
      name: '',
      branch_id: '',
      excludeWeekend: false,
      shift_days: shiftDays.map((_, index) => ({
        day_id: index + 1,
        shift_type_id: '',
      })),
    },
    validate: schemaResolver(workshiftSchema),
    validateInputOnChange: true,
    onValuesChange: (values, previous) => {
      if (values.excludeWeekend !== previous.excludeWeekend) {
        const days = values.excludeWeekend
          ? values.shift_days.filter((day) => day.day_id <= 5)
          : [
              ...values.shift_days,
              ...[6, 7]
                .filter(
                  (dayId) =>
                    !values.shift_days.some((day) => day.day_id === dayId),
                )
                .map((day_id) => ({ day_id, shift_type_id: '' })),
            ]
        if (days.length !== values.shift_days.length) {
          form.setFieldValue('shift_days', days)
        }
      }
      if (form.isDirty()) open()
      else close()
    },
  })
  useEffect(() => {
    if (editing && detail.data && !form.initialized) {
      const shift = detail.data.data
      form.initialize({
        name: shift.name,
        branch_id: shift.is_generic ? 'all' : String(shift.station_id),
        excludeWeekend: !shift.regular_shift_days.some((day) => day.day_id > 5),
        shift_days: shift.regular_shift_days.map((day) => ({
          day_id: day.day_id,
          shift_type_id: String(day.shift_type_id),
        })),
      })
      close()
    }
  }, [detail.data, editing, form, close])
  const branchOptions =
    branches.data?.data.results.map((branch) => ({
      value: String(branch.id),
      label: branch.station_name,
    })) ?? []
  if (access.isHqAdmin || (editing && detail.data?.data.is_generic))
    branchOptions.unshift({ value: 'all', label: 'All branches' })
  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Workshift information',
      fields: [
        {
          name: 'name',
          label: 'Work shift name',
          type: 'text',
          required: true,
          cols: 6,
        },
        {
          name: 'branch_id',
          label: 'Branch',
          type: 'select',
          required: true,
          cols: 6,
          disabled: editing,
          options: branchOptions,
        },
      ],
    },
    {
      title: 'Weekly schedule',
      fields: [
        {
          name: 'excludeWeekend',
          label: 'Exclude weekends',
          type: 'switch',
          cols: 12,
        },
        ...form.values.shift_days.map((day, index) => ({
          name: `shift_days.${index}.shift_type_id`,
          label: shiftDays[day.day_id - 1],
          type: 'select' as const,
          required: true,
          cols: 6,
          options:
            types.data?.data.flatMap((type) =>
              type.id === undefined
                ? []
                : [{ value: String(type.id), label: type.name }],
            ) ?? [],
        })),
      ],
    },
  ]
  const loading = create.isPending || update.isPending
  const handleSubmit = form.onSubmit((values) => {
    if (loading) return
    const payload = {
      name: values.name.trim(),
      branch_id:
        values.branch_id === 'all'
          ? ('all' as const)
          : Number(values.branch_id),
      is_generic: values.branch_id === 'all',
      shift_days: values.shift_days.map((day) => ({
        day_id: day.day_id,
        shift_type_id: Number(day.shift_type_id),
      })),
    }
    const onSuccess = () => {
      form.resetDirty()
      close()
      void navigate({ to: '/admin-dashboard/attendance/workshift' })
    }
    if (id !== undefined) update.mutate({ id, ...payload }, { onSuccess })
    else create.mutate(payload, { onSuccess })
  })
  const handleCancel = () => {
    if (loading) return
    form.reset()
    close()
  }
  return {
    form,
    fields,
    access,
    allowed,
    editing,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingDetails:
      branches.isLoading || types.isLoading || (editing && detail.isLoading),
    error: branches.error ?? types.error ?? (editing ? detail.error : null),
    retry: () => {
      void branches.refetch()
      void types.refetch()
      if (editing) void detail.refetch()
    },
  }
}
