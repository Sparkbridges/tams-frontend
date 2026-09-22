import { TamsSpinner } from '#/components/atoms'
import { Tams2ColsForm, TamsActionWidget, TamsPageError } from '#/components/molecules'
import { useCreateEditBranchForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  branchId?: number
}

const CreateEditBranchForm = ({ type, branchId }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingBranchDetails,
    isError
  } = useCreateEditBranchForm({ type, branchId })

  if (isError) return <TamsPageError type='404'/>
  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoadingBranchDetails}
        loaderProps={{ children: <TamsSpinner size={32}/> }}
      />
      <Tams2ColsForm fields={fields} form={form} />
      <TamsActionWidget
        loading={loading}
        title={
          type === 'create' ? 'Unsaved new Branch' : 'Unsaved changes to Branch'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditBranchForm
