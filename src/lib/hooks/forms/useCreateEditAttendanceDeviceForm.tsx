import {
  useAttendanceAccess,
  useAttendanceDevice,
  useAttendanceDeviceTypes,
  useCreateAttendanceDevice,
  useFetchOrganizationBranches,
  useUpdateAttendanceDevice,
} from '#/lib/api'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import {
  createAttendanceDeviceSchema,
  editAttendanceDeviceSchema,
} from '#/lib/utils/schema/attendance.schema'
import { attendanceTimezones } from '#/lib/constants/attendance'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const useCreateEditAttendanceDeviceForm = ({ type, id }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const navigate = useNavigate()

  const editing = type === 'edit' && Boolean(id)

  const access = useAttendanceAccess()

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) =>
    data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    })),
  )

  const form = useTamsForm({
    defaultValues: {
      branch_id: '',
      device_type_id: '',
      alias: '',
      serial_no: '',
      timezone: '1',
      license: '',
    },
    schema: editing ? editAttendanceDeviceSchema : createAttendanceDeviceSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        openActionWidget()
      } else {
        closeActionWidget()
      }
    },
    transformValues: (values) => {
      if (editing) {
        delete values.license
      }
      return {
        ...values,
      }
    },
  })

  const { data: deviceTypes } = useAttendanceDeviceTypes(
    (data) => data.data,
    access.canCreate,
  )

  const {
    data: detail,
    isLoading: isLoadingDetails,
    isError,
  } = useAttendanceDevice(id ?? 0)

  const create = useCreateAttendanceDevice()
  const update = useUpdateAttendanceDevice()

  useEffect(() => {
    const device = detail?.data
    if (device && !form.initialized) {
      form.initialize({
        branch_id: String(device.station_id),
        device_type_id: String(device.device_type_id),
        alias: device.alias,
        serial_no: device.serial_no,
        timezone: String(device.timezone),
        license: '',
      })
      closeActionWidget()
    }
  }, [detail, form])

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Device Information',
      fields: [
        {
          name: 'branch_id',
          label: 'Branch',
          type: 'select',
          required: true,
          cols: 6,
          options: branches,
        },
        {
          name: 'device_type_id',
          label: 'Device type',
          type: 'select',
          required: true,
          cols: 6,
          options:
            deviceTypes?.map((i) => ({
              value: String(i.id),
              label: i.name,
            })) ??
            (detail?.data
              ? [
                  {
                    value: String(detail?.data.device_type_id),
                    label:
                      detail?.data.device_type ??
                      `Type ${detail?.data.device_type_id}`,
                  },
                ]
              : []),
        },
        {
          name: 'alias',
          label: 'Alias',
          type: 'text',
          required: true,
          cols: 6,
        },
        {
          name: 'serial_no',
          label: 'Device serial number',
          type: 'text',
          required: true,
          cols: 6,
        },
        {
          name: 'timezone',
          label: 'Time zone',
          type: 'select',
          required: true,
          cols: 6,
          options: attendanceTimezones,
        },
        ...(!editing
          ? [
              {
                name: 'license',
                label: 'Device license',
                type: 'text' as const,
                required: true,
                cols: 6,
              },
            ]
          : []),
      ],
    },
  ]

  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          if (!editing) {
            const response = await create.mutateAsync(values)
            if (response?.data?.id) {
              navigate({
                to: '/admin-dashboard/attendance/devices/edit',
                search: { deviceId: response.data.id },
              })
            } else {
              navigate({
                to: '/admin-dashboard/attendance/devices',
              })
            }
          } else {
            await update.mutateAsync({ ...values, id })
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
    loading: create.isPending || update.isPending,
    isLoadingDetails,
    isError,
  }
}

export default useCreateEditAttendanceDeviceForm
