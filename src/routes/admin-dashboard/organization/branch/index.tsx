import {
  OrganizationBranchTable,
  TamsButton,
  TamsPageError,
} from '#/components'
import { documentHelper, useGetPageHeader, useOrganizationAccess } from '#/lib'
import { Group } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/organization/branch/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Branch | Tams',
      content: 'Organization Branch Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = Route.useNavigate()
  const { canViewBranches, canCreateBranch } = useOrganizationAccess()

  if (!canViewBranches) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group>
          {canCreateBranch && (
            <TamsButton
              size="md"
              leftSection={<PlusIcon />}
              onClick={() =>
                navigate({ to: `/admin-dashboard/organization/branch/create` })
              }
            >
              New Branch
            </TamsButton>
          )}
        </Group>
      </section>
      <div className="mt-10">
        <OrganizationBranchTable />
      </div>
    </main>
  )
}
