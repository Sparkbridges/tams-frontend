import { OrganizationTeamTable, TamsButton } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import { Group } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/organization/teams/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Teams | Tams',
      content: 'Organization Teams Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = Route.useNavigate()
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group>
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={() =>
              navigate({
                to: `/admin-dashboard/organization/teams/create`,
              })
            }
          >
            New Team
          </TamsButton>
        </Group>
      </section>
      <div className="mt-10">
        <OrganizationTeamTable />
      </div>
    </main>
  )
}
