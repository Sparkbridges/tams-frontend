import { AllHrmReports } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
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
