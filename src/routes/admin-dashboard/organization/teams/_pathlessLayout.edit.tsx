import { TamsBanner, TamsGoBackNavigation } from '#/components'
import CreateEditTeamForm from '#/components/organisms/forms/CreateEditTeamForm'
import { documentHelper, numberSchema } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  teamId: numberSchema(),
})

export const Route = createFileRoute(
  '/admin-dashboard/organization/teams/_pathlessLayout/edit',
)({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  head: () =>
    documentHelper({
      title: 'Edit Teams | Tams',
      content: 'Organization Teams Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { teamId } = Route.useSearch()
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Teams" />

      <TamsBanner />

      <CreateEditTeamForm type="edit" teamId={teamId} />
    </div>
  )
}
