import { TamsButton, TamsDrawer } from '#/components/atoms'
import { Tams2ColsForm2, TamsBanner } from '#/components/molecules'
import { useCreateEditHrmLeaveTypeForm } from '#/lib'
import { Paper } from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number
}

const EditHrmLeaveTypesSettingsDrawer = ({
  opened,
  onClose,
  selectedId,
}: Props) => {
  const { fields, form, isDirty, handleSubmit, loading } =
    useCreateEditHrmLeaveTypeForm({
      type: 'edit',
      id: selectedId,
      closeActionWidget: onClose,
    })
  return (
    <TamsDrawer
      title="Edit Leave Type"
      size={'lg'}
      opened={opened}
      onClose={onClose}
      position="right"
      bodyclassname="px-0 flex !flex-col pb-0"
    >
      <section className="bg-gray-100 space-y-2 pb-4 overflow-y-auto h-180">
        <div className="pl-3.5 py-1.5">
          <p className="text-sm font-light text-pretty">
            Define leave type parameters, branch applicability for automatic
            leave calculation and requests.
          </p>
        </div>
        <TamsBanner />
        <div className="px-3.5">
          <Tams2ColsForm2 form={form} fields={fields} />
        </div>
      </section>
      <Paper p="md" className="flex mt-auto" withBorder radius={0}>
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
    </TamsDrawer>
  )
}

export default EditHrmLeaveTypesSettingsDrawer
