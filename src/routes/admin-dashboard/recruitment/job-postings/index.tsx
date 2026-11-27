import {
  RecruitmentJobPostingsTable,
  TamsPageError,
  TamsTabs,
} from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import type { TTamsTabs } from '#/lib'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import { Divider } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/job-postings/',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Job Postings | Tams',
      content: 'Job Postings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const { canViewJobPostings } = useRecruitmentAccess()

  const [activeTab, setActiveTab] = useState<'all' | 'archived'>('all')

  const tabs: TTamsTabs[] = [
    {
      label: 'All',
      value: 'all',
      color: 'blue',
    },
    {
      label: 'Archived',
      value: 'archived',
      color: 'gray',
    },
  ]
  if (!canViewJobPostings) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <Divider my="md" />
      <TamsTabs
        tabValue={activeTab}
        data={tabs}
        onTabChange={(val) => setActiveTab(val as 'all' | 'archived')}
      />
      <div className="mt-10">
        <RecruitmentJobPostingsTable activeTab={activeTab} />
      </div>
    </main>
  )
}
