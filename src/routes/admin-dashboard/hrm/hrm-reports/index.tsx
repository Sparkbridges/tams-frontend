import { AllHrmReports, TamsPageError } from '#/components'
import { documentHelper, useGetPageHeader, useHrmAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/hrm/hrm-reports/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Hrm Reports | Tams',
      content: 'Hrm Reports Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const { canViewHrmReports } = useHrmAccess()
  if (!canViewHrmReports) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <section className="mt-10">
        <AllHrmReports />
      </section>
    </main>
  )
}
