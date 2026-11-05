import { AllUserReports, TamsPageError } from '#/components'
import { documentHelper, useGetPageHeader, useOrganizationAccess } from '#/lib'
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
  const { canViewEmployeeReports } = useOrganizationAccess()

  if (!canViewEmployeeReports) return <TamsPageError type="403" />
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
