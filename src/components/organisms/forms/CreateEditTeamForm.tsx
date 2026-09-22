import { TamsSpinner } from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditTeamForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

type Props = {
  type: 'create' | 'edit'
  teamId?: number
}

const CreateEditTeamForm = ({ type, teamId }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoadingTeamDetails,
    isError,
  } = useCreateEditTeamForm({ type, teamId })

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
          type === 'create' ? 'Unsaved new Team' : 'Unsaved changes to Team'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditTeamForm
