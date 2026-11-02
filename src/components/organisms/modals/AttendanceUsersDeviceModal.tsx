import { TamsButton, TamsModal2 } from '#/components/atoms'
import { Tams2ColsForm2, TamsBanner } from '#/components/molecules'
import {
  useGetAttendanceDevices,
  useTamsForm,
  useTransferAttendanceUsers,
} from '#/lib'
import type { TamsBy2ColsFormField, TamsBy2ColsFormFields } from '#/lib'
import { attendanceTransferSchema } from '#/lib/utils/schema/attendance.schema'
import { Paper } from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  command_type: 'USER_FP_TRANSFER' | 'MOVE_USER' | 'USER_TRANSFER'
  selectedEmployees: number[]
  setSelectedIds: (ids: number[]) => void
}

const AttendanceUsersDeviceModal = ({
  opened,
  onClose,
  command_type,
  selectedEmployees,
  setSelectedIds,
}: Props) => {
  const form = useTamsForm({
    defaultValues: {
      devices: '',
      access: undefined as unknown as 'supervisor' | 'admin',
      employees: selectedEmployees,
      command_type: command_type,
    },
    schema: attendanceTransferSchema,
    transformValues(values) {
      if (command_type != 'USER_TRANSFER') {
        delete values.access
      }
      return {
        ...values,
        employees: selectedEmployees,
        command_type,
        devices: values.devices ? [values.devices] : ['all'],
      }
    },
  })

  const { data: allAttendanceDevicesOptions } = useGetAttendanceDevices(
    undefined,
    (data) =>
      data.data.results.map((device) => ({
        value: device.serial_no,
        label: `${device.alias} (${device.device_type ?? '—'})`,
      })),
  )

  const { mutateAsync: transferAttendanceUsersAsync } =
    useTransferAttendanceUsers()

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: `${command_type === 'USER_FP_TRANSFER' ? 'Transfer (Copy)' : command_type === 'MOVE_USER' ? 'Move User' : 'Change Access'} Information`,
      fields: [
        {
          label: 'Destination Device',
          name: 'devices',
          type: 'select',
          options: allAttendanceDevicesOptions,
          cols: 6,
          required: true,
        },
        ...(command_type === 'USER_TRANSFER'
          ? ([
              {
                label: 'Change Access',
                name: 'access',
                type: 'select',
                options: [
                  { value: 'supervisor', label: 'Supervisor' },
                  { value: 'admin', label: 'Admin' },
                ],
                cols: 6,
                required: true,
              },
            ] satisfies TamsBy2ColsFormField[])
          : []),
      ],
    },
  ]
  const handleSubmit = async () => {
    console.log('values', form.getValues())
    form.onSubmit(
      async (values: any) => {
        try {
          await transferAttendanceUsersAsync(values)
          onClose()
          setSelectedIds([])
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
    onClose()
  }
  return (
    <TamsModal2
      opened={opened}
      onClose={handleCancel}
      title="Device user command"
      centered
      size="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      bodyClassName="px-0 pb-0 bg-red-500 flex !flex-col"
    >
      <section className="bg-gray-100 space-y-2 pb-4 overflow-y-auto max-h-150">
        <TamsBanner />
        <div className="px-3.5">
          <Tams2ColsForm2 form={form} fields={fields} />
        </div>
      </section>
      <Paper p="md" className="flex justify-end mt-auto" withBorder radius={0}>
        <TamsButton
          onClick={handleSubmit}
          loading={form.submitting}
          size="md"
          radius="xl"
          disabled={!form.isDirty || form.submitting}
        >
          Save
        </TamsButton>
      </Paper>
    </TamsModal2>
  )
}

export default AttendanceUsersDeviceModal
