import { TamsSpinner } from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditPerformanceTrainingForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const CreateEditPerformanceTrainingForm = ({ type, id }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingTeamDetails,
    isError,
  } = useCreateEditPerformanceTrainingForm({ type, id })

  if (isError) return <TamsPageError type="404" />
  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoadingTeamDetails}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <Tams2ColsForm fields={fields} form={form} />
      <TamsActionWidget
        loading={loading}
        title={
          type === 'create'
            ? 'Unsaved new Performance Training'
            : 'Unsaved changes to Performance Training'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditPerformanceTrainingForm
