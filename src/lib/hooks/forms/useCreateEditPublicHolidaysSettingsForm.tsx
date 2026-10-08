import {
  useCreateCustomPublicHolidaySettings,
  useCreatePublicHolidaySettings,
  useGetPublicHoliday,
  useGetPublicHolidaySettingsDetails,
  useUpdatePublicHolidaySettings,
} from '#/lib/api'
import {
  createPublicHolidaysSettingsInitials,
  editPublicHolidaysSettingsInitials,
  publicHolidaysSettingsOptions,
} from '#/lib/constants'
import type {
  TamsBy2ColsFormField,
  TamsBy2ColsFormFields,
  TUpdatePublicHolidaySettingsPayload,
} from '#/lib/types'
import {
  createPublicHolidaysSettingsSchema,
  editPublicHolidaysSettingsSchema,
  getErrorMessage,
  newDayjs,
} from '#/lib/utils'
import { notifications } from '@mantine/notifications'
import useTamsForm from '../useTamsForm'
import { useEffect, useState } from 'react'

type Props = {
  type: 'create' | 'edit'
  id?: number
  closeActionWidget: () => void
}

const useCreateEditPublicHolidaysSettingsForm = ({
  type,
  id,
  closeActionWidget,
}: Props) => {
  const [isDirty, setIsDirty] = useState(false)

  const form = useTamsForm({
    defaultValues:
      type === 'create'
        ? createPublicHolidaysSettingsInitials
        : editPublicHolidaysSettingsInitials,
    schema:
      type === 'create'
        ? createPublicHolidaysSettingsSchema
        : editPublicHolidaysSettingsSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        setIsDirty(true)
      } else {
        setIsDirty(false)
      }
    },
    transformValues: (values) => ({
      ...values,
      national_public_holiday_ids: [values.national_public_holiday_ids],
      date: values.date
        ? newDayjs(values.date).format('YYYY-MM-DD')
        : values.date,
    }),
  })

  const { data: publicHolidayData } = useGetPublicHoliday((data) =>
    data.data.map((holiday) => ({
      value: holiday.id.toString(),
      label:
        holiday.name +
        ' (' +
        newDayjs(holiday.date).format('MMM, DD, YYYY') +
        ')',
    })),
  )

  const {
    data: publicHolidaySettingsDetailsData,
    isLoading: isLoadingPublicetailsData,
  } = useGetPublicHolidaySettingsDetails(id as number, (data) => data.data)

  const {
    mutateAsync: createPublicHolidaySettingsAsync,
    isPending: isCreatingPublicHolidaySettings,
  } = useCreatePublicHolidaySettings()

  const {
    mutateAsync: createCustomPublicHolidaySettingsAsync,
    isPending: isCreatingCustomPublicHolidaySettings,
  } = useCreateCustomPublicHolidaySettings()

  const {
    mutateAsync: updatePublicHolidaySettingsAsync,
    isPending: isUpdatingPublicHolidaySettings,
  } = useUpdatePublicHolidaySettings()

  useEffect(() => {
    const initializeForm = async () => {
      if (id && publicHolidaySettingsDetailsData) {
        const initials = {
          national_public_holiday_ids:
            publicHolidaySettingsDetailsData.national_public_holiday_id,
          is_recurring: publicHolidaySettingsDetailsData.is_recurring,
          send_email_notification:
            publicHolidaySettingsDetailsData.send_email_notification,
          name: publicHolidaySettingsDetailsData.name,
          date: newDayjs(publicHolidaySettingsDetailsData.date).toDate(),
          holiday_type:
            publicHolidaySettingsDetailsData.type === 'public'
              ? 'national'
              : 'company',
          id,
        }
        form.initialize(initials)
        form.setValues(initials)
      }
    }
    initializeForm()
  }, [publicHolidaySettingsDetailsData, id])

  const holidayType = form.getValues().holiday_type

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Basic Holiday Information',
      fields: [
        {
          label: 'Holiday Type',
          name: 'holiday_type',
          type: 'select',
          cols: 12,
          required: true,
          options: publicHolidaysSettingsOptions,
          disabled: type === 'edit',
        },
        ...(holidayType === 'national'
          ? ([
              {
                label: 'Select National Holiday',
                name: 'national_public_holiday_ids',
                type: 'select',
                options: publicHolidayData,
                cols: 12,
                required: true,
                disabled: type === 'edit',
              },
            ] satisfies TamsBy2ColsFormField[])
          : holidayType === 'company'
            ? ([
                {
                  label: 'Holiday Name',
                  name: 'name',
                  type: 'text',
                  cols: 12,
                  required: true,
                },
                {
                  label: 'Holiday Date',
                  name: 'date',
                  type: 'date',
                  cols: 12,
                  required: true,
                },
              ] satisfies TamsBy2ColsFormField[])
            : []),
      ],
    },
    {
      title: 'Additional Information',
      fields: [
        {
          label: 'Is Public Holiday Re-occurring',
          name: 'is_recurring',
          type: 'switch',
          cols: 12,
        },
        {
          label: 'Send Email Notification',
          name: 'send_email_notification',
          type: 'switch',
          cols: 12,
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const {
            id: holidayId,
            is_recurring,
            date,
            name,
            national_public_holiday_ids,
            send_email_notification,
          } = values as TUpdatePublicHolidaySettingsPayload
          if (type === 'create') {
            if (holidayType === 'national') {
              if (!national_public_holiday_ids) {
                form.setErrors({
                  national_public_holiday_ids:
                    'At least one holiday is required',
                })
                return
              }
              await createPublicHolidaySettingsAsync({
                is_recurring,
                national_public_holiday_ids: national_public_holiday_ids,
                send_email_notification,
              })
            }
            if (holidayType === 'company') {
              if (!date || !name) {
                form.setErrors({
                  date: !date ? 'Date is required' : undefined,
                  name: !name ? 'Name is required' : undefined,
                })
                return
              }
              await createCustomPublicHolidaySettingsAsync({
                is_recurring,
                date,
                name,
                send_email_notification,
              })
            }

            form.reset()
          }
          if (type === 'edit' && id) {
            if (!date || !name) {
              form.setErrors({
                date: !date ? 'Date is required' : undefined,
                name: !name ? 'Name is required' : undefined,
              })
              return
            }
            const payloadEdit =
              holidayType === 'national'
                ? {
                    id: holidayId,
                    is_recurring,
                    send_email_notification,
                  }
                : {
                    id: holidayId,
                    is_recurring,
                    date,
                    name,
                    send_email_notification,
                  }
            await updatePublicHolidaySettingsAsync(payloadEdit)
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
    isDetailLoading: isLoadingPublicetailsData,
    isDirty,
    form,
    fields,
    handleSubmit,
    handleCancel,
    loading:
      isCreatingCustomPublicHolidaySettings || isCreatingPublicHolidaySettings,

    isUpdating: isUpdatingPublicHolidaySettings,
  }
}

export default useCreateEditPublicHolidaysSettingsForm
