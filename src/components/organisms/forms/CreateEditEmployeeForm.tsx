import { TamsSpinner } from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditEmployeeForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  employeeId?: number
}

const CreateEditEmployeeForm = ({ type, employeeId }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isError,
    isSubmitting
  } = useCreateEditEmployeeForm({ type, employeeId })

  if (isError) return <TamsPageError type="404" />
  return (
    <div className="relative">
      <LoadingOverlay
        visible={loading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <Tams2ColsForm fields={fields} form={form} />
      <TamsActionWidget
        loading={isSubmitting}
        title={
          type === 'create'
            ? 'Unsaved new Employee'
            : 'Unsaved changes to Employee'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditEmployeeForm
