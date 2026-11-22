import { PerformanceAppraisalTable, TamsButton, TamsTabs } from '#/components'
import { useGetPageHeader, usePerformanceAccess } from '#/lib'
import type { TTamsTabs } from '#/lib'
import { Divider } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin-dashboard/performance/appraisal/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()
  const { canCreateAppraisal } = usePerformanceAccess()
  const [activeTab, setActiveTab] = useState<'all' | 'archived'>('all')

  const tabs: TTamsTabs[] = [
    { label: 'Appraisal Groups', value: 'all' },
    { label: 'Archived', value: 'archived' },
    { label: 'My Appraisal', value: 'my' },
    { label: 'Approvals', value: 'approvals' },
  ]

  return (
    <main className="px-7 pb-8">
      <section className="flex items-center justify-between mb-5">
        {pageHeader()}
        {canCreateAppraisal && activeTab === 'all' && (
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={() =>
              navigate({
                to: '/admin-dashboard/performance/appraisal/create',
              })
            }
          >
            Create Appraisal Group
          </TamsButton>
        )}
      </section>

      <Divider mt="lg" />
      <section className="mt-2 mb-10">
        <TamsTabs
          tabValue={activeTab}
          onTabChange={(value) => {
            if (value === 'my') {
              navigate({
                to: '/admin-dashboard/performance/appraisal/my-appraisal',
              })
              return
            }
            if (value === 'approvals') {
              navigate({
                to: '/admin-dashboard/performance/appraisal/approvals',
              })
              return
            }
            setActiveTab(value === 'archived' ? 'archived' : 'all')
          }}
          data={tabs}
        />
      </section>

      <PerformanceAppraisalTable activeTab={activeTab} />
    </main>
  )
}
