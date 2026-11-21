import {
  PerformanceTrainingTable,
  TamsButton,
  TamsPageError,
} from '#/components'
import { documentHelper, useGetPageHeader, usePerformanceAccess } from '#/lib'
import { Group } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/performance/training/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Performance Training | Tams',
      content: 'Performance Training Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = Route.useNavigate()
  const { canViewTraining, canCreateTraining } = usePerformanceAccess()

  if (!canViewTraining) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group>
          {canCreateTraining && (
            <TamsButton
              size="md"
              leftSection={<PlusIcon />}
              onClick={() =>
                navigate({
                  to: `/admin-dashboard/performance/training/create`,
                })
              }
            >
              New Training
            </TamsButton>
          )}
        </Group>
      </section>
      <div className="mt-10">
        <PerformanceTrainingTable />
      </div>
    </main>
  )
}
