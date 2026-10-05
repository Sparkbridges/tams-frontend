import { TamsSpinner } from '#/components/atoms'
import {
  Tams2ColsForm2,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useEditCompanyForm } from '#/lib'
import { LoadingOverlay } from '@mantine/core'

const EditCompanyForm = () => {
  const {
    form,
    fields,
    rightSection,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isError,
    isSubmitting,
  } = useEditCompanyForm()

  if (isError) return <TamsPageError type="404" />
  return (
    <div className="relative">
      <LoadingOverlay
        visible={loading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <Tams2ColsForm2 fields={fields} rightSection={rightSection} form={form} />
      <TamsActionWidget
        loading={isSubmitting}
        title={'Unsaved changes to Company Information'}
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default EditCompanyForm
