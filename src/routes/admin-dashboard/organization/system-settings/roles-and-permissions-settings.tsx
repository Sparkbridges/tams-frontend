import { OrganizationPermissions, TamsPageError } from '#/components'
import { documentHelper, useGetPageHeader, useOrganizationAccess } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/system-settings/roles-and-permissions-settings',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Organization Roles and Permissions System Settings | Tams',
      content: 'Organization Roles and Permissions System Settings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const { canViewRoles } = useOrganizationAccess()

  if (!canViewRoles) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <div className="mt-10">
        <OrganizationPermissions />
      </div>
    </main>
  )
}
