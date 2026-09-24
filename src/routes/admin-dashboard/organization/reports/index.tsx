import { AllUserReports } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/organization/reports/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Organization Reports | Tams',
      content: 'Organization Reports Page',
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
      <section className="mt-10">
        <AllUserReports />
      </section>
    </main>
  )
}
