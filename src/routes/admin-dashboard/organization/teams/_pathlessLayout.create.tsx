import { TamsBanner, TamsGoBackNavigation, TamsPageError } from '#/components'
import CreateEditTeamForm from '#/components/organisms/forms/CreateEditTeamForm'
import { documentHelper, useOrganizationAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/teams/_pathlessLayout/create',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Create Teams | Tams',
      content: 'Organization Create Teams Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { canCreateTeam } = useOrganizationAccess()
  if (!canCreateTeam) return <TamsPageError type="403" />
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Teams" />

      <TamsBanner />

      <CreateEditTeamForm type="create" />
    </div>
  )
}
