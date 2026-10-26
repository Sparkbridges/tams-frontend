import {
  CreateExemptionApproverModal,
  HrmExemptionSettingsTable,
  TamsButton,
} from '#/components'
import { useGetPageHeader } from '#/lib'
import { useDisclosure } from '@mantine/hooks'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/hrm/hrm-settings/exemptions-settings',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()

  const [
    openedExemptionsModal,
    { open: openExemptionsModal, close: closeExemptionsModal },
  ] = useDisclosure(false)
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}

        <TamsButton
          size="md"
          leftSection={<PlusIcon />}
          onClick={openExemptionsModal}
        >
          Add Exemption
        </TamsButton>
      </section>

      <div className="mt-10">
        <HrmExemptionSettingsTable />
      </div>
      <CreateExemptionApproverModal
        opened={openedExemptionsModal}
        onClose={closeExemptionsModal}
      />
    </main>
  )
}
