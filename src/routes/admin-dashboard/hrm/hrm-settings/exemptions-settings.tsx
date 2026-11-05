import {
  CreateExemptionApproverModal,
  HrmExemptionSettingsTable,
  TamsButton,
  TamsPageError,
} from '#/components'
import { useGetPageHeader, useHrmAccess } from '#/lib'
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

  const { canViewExemptions } = useHrmAccess()

  const [
    openedExemptionsModal,
    { open: openExemptionsModal, close: closeExemptionsModal },
  ] = useDisclosure(false)

  if (!canViewExemptions) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}

        <TamsButton
          size="md"
          leftSection={<PlusIcon />}
          onClick={openExemptionsModal}
        >
          Add Exemption Setting
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
