import {
  CreateEditBranchForm,
  TamsBanner,
  TamsGoBackNavigation,
} from '#/components'
import { documentHelper } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/branch/_pathlessLayout/create',
)({
  component: RouteComponent,
  head:()=> documentHelper({ title: 'Create Branch | Tams', content: 'Organization Branch Page', name: 'description' }),
})

function RouteComponent() {
  return (
    <div className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Branches" />

      <TamsBanner />

      <CreateEditBranchForm type="create" />
    </div>
  )
}
