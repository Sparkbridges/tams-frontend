import { TamsSpinner } from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditTalentRequisitionForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const CreateEditTalentRequisitionForm = ({ type, id }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingDetails,
    isError,
  } = useCreateEditTalentRequisitionForm({ type, id })

  if (isError) return <TamsPageError type="404" />
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
          type === 'create'
            ? 'Unsaved new Talent Request'
            : 'Unsaved changes to Talent Request'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditTalentRequisitionForm
