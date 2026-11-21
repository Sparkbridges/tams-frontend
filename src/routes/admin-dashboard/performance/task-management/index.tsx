import {
  PerformanceTaskManagement,
  TamsButton,
  TamsPageError,
  TamsTabs,
} from '#/components'
import { documentHelper, useGetPageHeader, usePerformanceAccess } from '#/lib'
import type { TTamsTabs } from '#/lib'
import { Divider, Group } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/performance/task-management/',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Performance Task Management | Tams',
      content: 'Performance Task Management Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const { canViewTaskManagement, canCreateTaskManagement } =
    usePerformanceAccess()
  const navigate = Route.useNavigate()

  const [tabValue, setTabValue] = useState<'all' | 'archived'>('all')

  const tabOptions: TTamsTabs[] = useMemo(
    () => [
      {
        label: 'All Projects',
        value: 'all',
      },
      {
        label: 'Archived Projects',
        value: 'archived',
        color2: 'gray',
      },
    ],
    [],
  )

  if (!canViewTaskManagement) return <TamsPageError type="403" />

  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group>
          {canCreateTaskManagement && (
            <TamsButton
              size="md"
              leftSection={<PlusIcon />}
              onClick={() =>
                navigate({
                  to: `/admin-dashboard/performance/task-management/create`,
                })
              }
            >
              New Project
            </TamsButton>
          )}
        </Group>
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={tabValue}
          onTabChange={(value) => setTabValue(value as 'all' | 'archived')}
          data={tabOptions}
        />
      </section>
      <div className="mt-10">
        <PerformanceTaskManagement activeTab={tabValue} />
      </div>
    </main>
  )
}
