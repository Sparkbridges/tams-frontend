import { HrmLeaveTable, TamsButton } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/hrm/leave/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Hrm Leave | Tams',
      content: 'Hrm Leave Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <TamsButton
          onClick={() => navigate({ to: '/admin-dashboard/hrm/leave/create' })}
          size="md"
          leftSection={<PlusIcon />}
        >
          Add Leave
        </TamsButton>
      </section>
      <div className="mt-10">
        <HrmLeaveTable />
      </div>
    </main>
  )
}
