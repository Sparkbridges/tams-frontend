import {
  PerformanceAppraisalGGSettings,
  TamsButton,
  TamsTabs,
} from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import type { AppraisalSettingsTab, TTamsTabs } from '#/lib'
import { Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import AppraisalPeopleSettingModal from '#/components/organisms/modals/AppraisalPeopleSettingModal'

export const Route = createFileRoute(
  '/admin-dashboard/performance/performance-settings/appraisal-settings',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Appraisal System Settings | Tams',
      content: 'Appraisal System Settings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()

  const [activeTab, setActiveTab] = useState<AppraisalSettingsTab>('general')

  const [
    openedAppraiserModal,
    { open: openAppraiserModal, close: closeAppraiserModal },
  ] = useDisclosure(false)
  const [
    openedApproverModal,
    { open: openApproverModal, close: closeApproverModal },
  ] = useDisclosure(false)

  const appraisalSettingsTabs: TTamsTabs[] = [
    { label: 'General Settings', value: 'general' },
    { label: 'Grading Settings', value: 'grading' },
    { label: 'Appraiser Settings', value: 'appraiser' },
    { label: 'Approver Settings', value: 'approver' },
  ]
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}

        {(activeTab === 'approver' || activeTab === 'appraiser') && (
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={
              activeTab === 'approver' ? openApproverModal : openAppraiserModal
            }
          >
            {activeTab === 'approver'
              ? 'Add Approver'
              : activeTab === 'appraiser'
                ? 'Add Appraiser'
                : null}
          </TamsButton>
        )}
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={activeTab}
          onTabChange={(value) => setActiveTab(value as AppraisalSettingsTab)}
          data={appraisalSettingsTabs}
        />
      </section>

      <div className="mt-10">
        <PerformanceAppraisalGGSettings activeTab={activeTab} />
      </div>
      {openedAppraiserModal && (
        <AppraisalPeopleSettingModal
          opened
          kind="appraiser"
          onClose={closeAppraiserModal}
        />
      )}
      {openedApproverModal && (
        <AppraisalPeopleSettingModal
          opened
          kind="approver"
          onClose={closeApproverModal}
        />
      )}
    </main>
  )
}
