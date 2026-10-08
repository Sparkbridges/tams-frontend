import { HrmExemptionTable, TamsButton } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
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
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <TamsButton
          onClick={() =>
            navigate({ to: '/admin-dashboard/hrm/exemption/create' })
          }
          size="md"
          leftSection={<PlusIcon />}
        >
          Add Exemption
        </TamsButton>
      </section>
      <div className="mt-10">
        <HrmExemptionTable />
      </div>
    </main>
  )
}
