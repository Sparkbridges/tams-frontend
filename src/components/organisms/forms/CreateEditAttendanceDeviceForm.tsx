import { LoadingOverlay } from '@mantine/core'
import { TamsSpinner } from '#/components/atoms'
import { Tams2ColsForm, TamsActionWidget } from '#/components/molecules'
import { useCreateEditAttendanceDeviceForm } from '#/lib'

export default function AttendanceDeviceForm({
  id,
  type,
}: {
  id?: number
  type: 'create' | 'edit'
}) {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingDetails,
  } = useCreateEditAttendanceDeviceForm({ type, id })

  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoadingDetails}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <Tams2ColsForm fields={fields} form={form} />
      <TamsActionWidget
        loading={loading}
        title={
          type === 'create' ? 'Unsaved new Device' : 'Unsaved changes to Device'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
