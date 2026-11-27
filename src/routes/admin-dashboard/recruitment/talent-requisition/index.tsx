import { TalentRequestTable, TamsButton, TamsPageError } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
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
  const { canViewTalentRequests, canCreateTalentRequest } =
    useRecruitmentAccess()
  const navigate = useNavigate()

  if (!canViewTalentRequests) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}

        <div>
          {canCreateTalentRequest && (
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
          )}
        </div>
      </section>
      <div className="mt-10">
        <TalentRequestTable />
      </div>
    </main>
  )
}
