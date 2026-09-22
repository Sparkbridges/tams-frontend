import { TamsSpinner } from '#/components/atoms'
import { Tams2ColsForm, TamsActionWidget, TamsPageError } from '#/components/molecules'
import { useCreateEditDepartmentForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  departmentId?: number
}

const CreateEditDepartmentForm = ({ type, departmentId }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingDepartmentDetails,
    isError,
  } = useCreateEditDepartmentForm({ type, departmentId })

  if (isError) return <TamsPageError type='404'/>
  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoadingDepartmentDetails}
        loaderProps={{ children: <TamsSpinner size={32}/> }}
      />
      <Tams2ColsForm fields={fields} form={form} />
      <TamsActionWidget
        loading={loading}
        title={
          type === 'create' ? 'Unsaved new Department' : 'Unsaved changes to Department'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditDepartmentForm
