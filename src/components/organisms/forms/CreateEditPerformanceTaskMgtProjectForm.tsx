import { TamsSpinner } from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditPerformanceTaskManagementProjectForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const CreateEditPerformanceTaskMgtProjectForm = ({ type, id }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingDetails,
    isError,
  } = useCreateEditPerformanceTaskManagementProjectForm({ type, id })

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
            ? 'Unsaved new Performance Task Management Project'
            : 'Unsaved changes to Performance Task Management Project'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditPerformanceTaskMgtProjectForm
