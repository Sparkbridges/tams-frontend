import {
  CreateHrmLeaveApproverModal,
  CreateLeaveTypeModal,
  HrmLeaveSettingsTable,
  TamsButton,
  TamsTabs,
} from '#/components'
import { useGetPageHeader } from '#/lib'
import type { TTamsTabs } from '#/lib'
import { Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/hrm/hrm-settings/leaves-settings',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const [activeTab, setActiveTab] = useState<
    'leave_type' | 'leave_approver' | null
  >('leave_type')

  const [
    openedLeaveTypeModal,
    { open: openLeaveTypeModal, close: closeLeaveTypeModal },
  ] = useDisclosure(false)
  const [
    openedLeaveApproverModal,
    { open: openLeaveApproverModal, close: closeLeaveApproverModal },
  ] = useDisclosure(false)

  const tabOptions = useMemo(
    (): TTamsTabs[] => [
      {
        label: 'Leave Types',
        value: 'leave_type',
      },
      {
        label: 'Leave Approvers',
        value: 'leave_approver',
      },
    ],
    [],
  )
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}

        <TamsButton
          size="md"
          leftSection={<PlusIcon />}
          onClick={
            activeTab === 'leave_type'
              ? openLeaveTypeModal
              : openLeaveApproverModal
          }
        >
          {activeTab === 'leave_type' ? 'Add Leave Type' : 'Add Leave Approver'}
        </TamsButton>
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={activeTab}
          onTabChange={(value) =>
            setActiveTab(value as 'leave_type' | 'leave_approver' | null)
          }
          data={tabOptions}
        />
      </section>

      <div className="mt-10">
        <HrmLeaveSettingsTable activeTab={activeTab} />
      </div>
      <CreateLeaveTypeModal
        opened={openedLeaveTypeModal}
        onClose={closeLeaveTypeModal}
      />
      <CreateHrmLeaveApproverModal
        opened={openedLeaveApproverModal}
        onClose={closeLeaveApproverModal}
      />
    </main>
  )
}
