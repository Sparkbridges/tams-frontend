import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { schemaResolver, useForm } from '@mantine/form'
import { useSchedules, useSaveSchedules } from '#/lib/api/services/scheduler'
import { useShiftTypes } from '#/lib/api/services/workshift'
import { schedulerFormSchema } from '#/lib/utils/schema/scheduler.schema'
import { expandSchedule, schedulePreview } from '#/lib/utils/helpers/scheduler'
import type { SchedulerEmployee } from '#/lib/types/api/scheduler'
import type { TamsBy2ColsFormFields } from '#/lib/types'

export default function useScheduleAssignmentForm({
  employees,
  startDate,
  onClose,
}: {
  employees: SchedulerEmployee[]
  startDate: string
  onClose: () => void
}) {
  const [previewValues, setPreviewValues] = useState<ReturnType<
    typeof schedulerFormSchema.parse
  > | null>(null)
  const [weekly, setWeekly] = useState(false)
  const [repeating, setRepeating] = useState(false)
  const types = useShiftTypes()
  const save = useSaveSchedules()
  const form = useForm<ReturnType<typeof schedulerFormSchema.parse>>({
    mode: 'uncontrolled',
    validate: schemaResolver(schedulerFormSchema),
    initialValues: {
      employees: employees.map((employee) => String(employee.employee_id)),
      start_date: startDate,
      end_date: startDate,
      shift_type_id: '',
      repeat: 'once',
      weekdays: [],
      on_conflict: 'skip',
    },
    onValuesChange: (values) => {
      setPreviewValues(null)
      setWeekly(values.repeat === 'weekly')
      setRepeating(values.repeat !== 'once')
    },
  })
  const previewQuery = useSchedules(
    previewValues
      ? {
          page: 1,
          perPage: 100,
          fetch_by: 'employee',
          fetch_by_id: previewValues.employees.map(Number),
          start_date: previewValues.start_date,
          end_date:
            previewValues.repeat === 'once'
              ? previewValues.start_date
              : previewValues.end_date,
        }
      : null,
  )
  const assignments = previewValues ? expandSchedule(previewValues) : []
  const preview = previewQuery.data
    ? schedulePreview(assignments, previewQuery.data.data.results)
    : []
  const missingEmployees =
    previewValues &&
    previewQuery.data &&
    previewValues.employees.some(
      (id) =>
        !previewQuery.data.data.results.some(
          (employee) =>
            employee.employee_id === Number(id) && employee.pin != null,
        ),
    )
  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Schedule assignment',
      fields: [
        {
          name: 'employees',
          label: 'Employees',
          type: 'multi-select',
          cols: 12,
          required: true,
          options: employees.map((employee) => ({
            value: String(employee.employee_id),
            label: employee.name,
          })),
        },
        {
          name: 'shift_type_id',
          label: 'Shift type',
          type: 'select',
          cols: 6,
          required: true,
          options: [
            { value: '0', label: 'Off day' },
            ...(types.data?.data
              .filter((type) => type.id && type.id !== 0)
              .map((type) => ({ value: String(type.id), label: type.name })) ??
              []),
          ],
        },
        {
          name: 'repeat',
          label: 'Repeat',
          type: 'select',
          cols: 6,
          required: true,
          options: [
            { value: 'once', label: 'Does not repeat' },
            { value: 'daily', label: 'Every day' },
            { value: 'weekly', label: 'Selected weekdays' },
          ],
        },
        {
          name: 'start_date',
          label: 'Start date',
          type: 'date',
          cols: 6,
          required: true,
        },
        ...(repeating
          ? [
              {
                name: 'end_date',
                label: 'Repeat until (inclusive)',
                type: 'date' as const,
                cols: 6,
                required: true,
              },
            ]
          : []),
        ...(weekly
          ? [
              {
                name: 'weekdays',
                label: 'Weekdays',
                type: 'multi-select' as const,
                cols: 12,
                required: true,
                options: [
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((label, index) => ({ value: String(index), label })),
              },
            ]
          : []),
        {
          name: 'on_conflict',
          label: 'If a saved schedule exists',
          type: 'select',
          cols: 12,
          required: true,
          options: [
            { value: 'skip', label: 'Keep existing schedules' },
            { value: 'replace', label: 'Replace existing schedules' },
          ],
        },
      ],
    },
  ]
  const handlePreview = form.onSubmit((values) => {
    const expanded = expandSchedule(values)
    if (!expanded.length || expanded.length > 5000) {
      form.setFieldError(
        'end_date',
        'Choose matching dates with at most 5,000 assignments',
      )
      return
    }
    setPreviewValues(values)
  })
  const handleSave = () => {
    if (
      !previewValues ||
      !previewQuery.isSuccess ||
      previewQuery.isFetching ||
      missingEmployees ||
      save.isPending
    )
      return
    save.mutate(
      { schedules: assignments, on_conflict: previewValues.on_conflict },
      {
        onSuccess: onClose,
      },
    )
  }
  const handleCancel = () => {
    if (save.isPending) {
      notifications.show({
        title: 'Saving schedules',
        message: 'Please wait for the save to finish.',
        color: 'blue',
      })
      return
    }
    onClose()
  }
  return {
    form,
    fields,
    types,
    save,
    previewValues,
    previewQuery,
    preview,
    missingEmployees,
    handlePreview,
    handleSave,
    handleCancel,
  }
}
