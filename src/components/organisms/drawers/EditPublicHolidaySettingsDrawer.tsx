import { TamsButton } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import { Tams2ColsForm2, TamsBanner } from '#/components/molecules'
import useCreateEditPublicHolidaysSettingsForm from '#/lib/hooks/forms/useCreateEditPublicHolidaysSettingsForm'
import { Paper } from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number | string
}

const EditPublicHolidaySettingsDrawer = ({
  opened,
  onClose,
  selectedId,
}: Props) => {
  const { fields, form, isDirty, handleSubmit, loading } =
    useCreateEditPublicHolidaysSettingsForm({
      type: 'edit',
      closeActionWidget: onClose,
      id: selectedId as number,
    })

  return (
    <TamsDrawer
      title="Edit Public Holiday Settings"
      size={'lg'}
      opened={opened}
      onClose={onClose}
      position="right"
      bodyclassname="px-0 flex !flex-col pb-0"
    >
      <section className="bg-gray-100 space-y-2 pb-4 overflow-y-auto h-180">
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

export default EditPublicHolidaySettingsDrawer
