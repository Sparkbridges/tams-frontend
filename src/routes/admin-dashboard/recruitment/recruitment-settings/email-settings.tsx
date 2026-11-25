import { RecruitmentEmailSettings } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/recruitment/recruitment-settings/email-settings',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Recruitment Email Settings | Tams',
      content: 'Recruitment Email Settings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <div className="mt-10">
        <RecruitmentEmailSettings />
      </div>
    </main>
  )
}
