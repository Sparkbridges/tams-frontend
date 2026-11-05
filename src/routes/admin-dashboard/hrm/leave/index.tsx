import { HrmLeaveTable, TamsButton, TamsPageError } from '#/components'
import { documentHelper, useGetPageHeader, useHrmAccess } from '#/lib'
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
  const { canCreateLeaves, canViewLeaves } = useHrmAccess()
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()

  if (!canViewLeaves) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        {canCreateLeaves && (
          <TamsButton
            onClick={() =>
              navigate({ to: '/admin-dashboard/hrm/leave/create' })
            }
            size="md"
            leftSection={<PlusIcon />}
          >
            Add Leave
          </TamsButton>
        )}
      </section>
      <div className="mt-10">
        <HrmLeaveTable />
      </div>
    </main>
  )
}
