import { TamsButton, TamsModal2 } from '#/components/atoms'
import { Tams2ColsForm2, TamsBanner } from '#/components/molecules'
import useCreateEditPublicHolidaysSettingsForm from '#/lib/hooks/forms/useCreateEditPublicHolidaysSettingsForm'
import { Paper } from '@mantine/core'

const CreatePublicHolidaysSettingsModal = ({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) => {
  const { fields, form, isDirty, handleSubmit, loading } =
    useCreateEditPublicHolidaysSettingsForm({
      type: 'create',
      closeActionWidget: onClose,
    })
  return (
    <TamsModal2
      opened={opened}
      onClose={onClose}
      title="Add Public Holiday"
      centered
      size="lg"
      bodyClassName="px-0 pb-0 bg-red-500 flex !flex-col"
    >
      <section className="bg-gray-100 space-y-2 pb-4 overflow-y-auto max-h-150">
        <div className="pl-3.5 py-1.5">
          <p className="text-sm font-light text-pretty">
            Define holiday parameters, dates, and branch applicability for
            automatic attendance and payroll reconciliation.
          </p>
        </div>
        <TamsBanner />
        <div className="px-3.5">
          <Tams2ColsForm2 form={form} fields={fields} />
        </div>
      </section>
      <Paper p="md" className="flex justify-end mt-auto" withBorder radius={0}>
        <TamsButton
          onClick={handleSubmit}
          loading={loading}
          size="md"
          radius="xl"
          disabled={!isDirty}
        >
          Save
        </TamsButton>
      </Paper>
    </TamsModal2>
  )
}

export default CreatePublicHolidaysSettingsModal
