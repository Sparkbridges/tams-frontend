import {
  CreateEditKanbanTask,
  ProjectManagementKanban,
  TamsButton,
} from '#/components'
import { documentHelper, useFetchHrmProjectById, useGetPageHeader } from '#/lib'
import { Divider, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/task-management/_pathlessLayout/board/$id',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Project Kanban | Tams',
      content: 'Project Kanban Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { id: boardId } = Route.useParams()
  const { pageHeader } = useGetPageHeader({ key: 'board' })

  const [
    openedCreateEditModal,
    { open: openCreateEditModal, close: closeCreateEditModal },
  ] = useDisclosure()

  const { data: employeesFromTeams } = useFetchHrmProjectById(
    Number(boardId),
    (data) =>
      data.data.members.map((member) => ({
        label: member.employee.fullname,
        value: member.employee.id.toString(),
      })),
  )

  return (
    <div>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group>
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={openCreateEditModal}
          >
            New Task
          </TamsButton>
        </Group>
      </section>
      <Divider my="md" />
      <ProjectManagementKanban boardId={Number(boardId)} />
      <CreateEditKanbanTask
        opened={openedCreateEditModal}
        onClose={closeCreateEditModal}
        employeesFromTeams={employeesFromTeams}
        projectId={Number(boardId)}
      />
    </div>
  )
}
