import { HrmExemptionTable, TamsButton, TamsPageError } from '#/components'
import { documentHelper, useGetPageHeader, useHrmAccess } from '#/lib'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/hrm/exemption/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Hrm Exemption | Tams',
      content: 'Hrm Exemption Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canViewExemptions, canCreateExemptions } = useHrmAccess()
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()

  if (!canViewExemptions) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        {canCreateExemptions && (
          <TamsButton
            onClick={() =>
              navigate({ to: '/admin-dashboard/hrm/exemption/create' })
            }
            size="md"
            leftSection={<PlusIcon />}
          >
            Add Exemption
          </TamsButton>
        )}
      </section>
      <div className="mt-10">
        <HrmExemptionTable />
      </div>
    </main>
  )
}
