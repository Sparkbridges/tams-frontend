import { TalentRequestTable, TamsButton } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/talent-requisition/',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Talent Requisitions | Tams',
      content: 'Talent Requisitions Page',
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

        <div>
          <TamsButton
            leftSection={<PlusIcon />}
            size="md"
            onClick={() =>
              navigate({
                to: '/admin-dashboard/recruitment/talent-requisition/create',
              })
            }
          >
            New Request
          </TamsButton>
        </div>
      </section>
      <div className="mt-10">
        <TalentRequestTable />
      </div>
    </main>
  )
}
