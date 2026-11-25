import { RecruitmentJobPostingsTable, TamsButton } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

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
                to: '/admin-dashboard/recruitment/job-postings/create',
              })
            }
          >
            New Job Posting
          </TamsButton>
        </div>
      </section>
      <div className="mt-10">
        <RecruitmentJobPostingsTable />
      </div>
    </main>
  )
}
