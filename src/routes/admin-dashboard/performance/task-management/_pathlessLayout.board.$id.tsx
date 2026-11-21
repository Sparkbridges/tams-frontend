import {
  CreateEditKanbanColumnModal,
  CreateEditKanbanTask,
  KanbanTaskDetailDrawer,
  ProjectManagementKanban,
} from '#/components'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'
import {
  documentHelper,
  newDayjs,
  useFetchHrmProjectById,
  useGetPageHeader,
  useDeleteProjectKanbanStatus,
  useDeleteProjectKanbanTask,
} from '#/lib'
import type { TamsMenuItem } from '#/lib'
import { Badge, Divider, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  MinusCircleIcon,
  PlusIcon,
  ProjectorScreenChartIcon,
  UserCircleCheckIcon,
  UsersFourIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import type {
  TFetchProjectKanbanStatuses,
  TProjectKanbanTask,
} from '#/lib/types/api/performance'
import { useState } from 'react'
import { TamsConfirmation } from '#/components/molecules'

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
  const [task, setTask] = useState<TProjectKanbanTask | null>(null)
  const [column, setColumn] = useState<TFetchProjectKanbanStatuses | null>(null)
  const [taskDetailId, setTaskDetailId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: 'task'; item: TProjectKanbanTask }
    | { kind: 'column'; item: TFetchProjectKanbanStatuses }
    | null
  >(null)

  const [
    openedCreateEditModal,
    { open: openCreateEditModal, close: closeCreateEditModal },
  ] = useDisclosure()

  const [
    openedCreateEditColumnModal,
    { open: openCreateEditColumnModal, close: closeCreateEditColumnModal },
  ] = useDisclosure()

  const [
    openedTaskDetailDrawer,
    { open: openTaskDetailDrawer, close: closeTaskDetailDrawer },
  ] = useDisclosure()

  const [
    openedDeleteConfirmation,
    { open: openDeleteConfirmation, close: closeDeleteConfirmation },
  ] = useDisclosure()

  const deleteStatusMutation = useDeleteProjectKanbanStatus()
  const deleteTaskMutation = useDeleteProjectKanbanTask()

  const { data: project } = useFetchHrmProjectById(Number(boardId), (data) => {
    return {
      ...data.data,
      employees: data.data.members.map((member) => ({
        label: member.employee.fullname,
        value: member.employee.id.toString(),
      })),
    }
  })

  const getPriority = (priority: number) => {
    switch (priority) {
      case 1:
        return {
          label: 'Lowest',
          color: 'teal',
          icon: <ArrowDownIcon weight="fill" />,
        }
      case 2:
        return {
          label: 'Low',
          color: 'blue',
          icon: <MinusCircleIcon weight="fill" />,
        }
      case 3:
        return {
          label: 'Medium',
          color: 'yellow',
          icon: <ProjectorScreenChartIcon weight="fill" />,
        }
      case 4:
        return {
          label: 'High',
          color: 'orange',
          icon: <WarningCircleIcon weight="fill" />,
        }
      case 5:
        return {
          label: 'Critical',
          color: 'red',
          icon: <ArrowUpIcon weight="fill" />,
        }
      default:
        return { label: 'Unknown', color: 'gray', icon: <MinusCircleIcon /> }
    }
  }

  const menuOptions: TamsMenuItem[] = [
    {
      label: 'Add Task',
      icon: PlusIcon,
      onClick: () => {
        setTask(null)
        openCreateEditModal()
      },
      type: 'item',
    },
    {
      label: 'Add Column',
      icon: PlusIcon,
      onClick: () => {
        setColumn(null)
        openCreateEditColumnModal()
      },
      type: 'item',
    },
  ]

  const priorityBadge = getPriority(project?.priority ?? 0)

  const handleDelete = async () => {
    if (!deleteTarget) return

    if (deleteTarget.kind === 'task') {
      await deleteTaskMutation.mutateAsync({
        id: deleteTarget.item.id,
        project_id: Number(boardId),
      })
    } else {
      await deleteStatusMutation.mutateAsync({
        id: deleteTarget.item.id,
        project_id: Number(boardId),
      })
    }

    closeDeleteConfirmation()
    setDeleteTarget(null)
  }

  const closeDelete = () => {
    closeDeleteConfirmation()
    setDeleteTarget(null)
  }

  return (
    <div>
      <section className="flex items-center justify-between">
        <div>
          {pageHeader()}
          <div className="flex items-center gap-2 mt-2">
            <Badge leftSection={<ProjectorScreenChartIcon />} variant="light">
              {' '}
              {project?.name}
            </Badge>
            <Badge leftSection={<UserCircleCheckIcon />} variant="light">
              Lead: {project?.created_by?.fullname}
            </Badge>
            <Badge leftSection={<CalendarIcon />} variant="light">
              Timeline: {newDayjs(project?.date_from).format('MMM DD, YYYY')} -{' '}
              {newDayjs(project?.date_to).format('MMM DD, YYYY')}
            </Badge>
            <Badge
              leftSection={priorityBadge.icon}
              variant="light"
              color={priorityBadge.color}
            >
              Priority: {priorityBadge.label}
            </Badge>
            <Badge leftSection={<UsersFourIcon />} variant="light">
              {project?.teams[0].team_name}{' '}
              {Number(project?.teams.length ?? 0) > 1
                ? `+${Number(project?.teams.length ?? 0) - 1}`
                : ''}
            </Badge>
          </div>
        </div>

        <Group>
          <TamsButtonDropdown width={200} btnText="Add" options={menuOptions} />
        </Group>
      </section>
      <Divider my="md" />
      <ProjectManagementKanban
        setTask={setTask}
        openCreateEditModal={openCreateEditModal}
        boardId={Number(boardId)}
        onViewTask={(selectedTask) => {
          setTaskDetailId(selectedTask.id)
          openTaskDetailDrawer()
        }}
        onDeleteTask={(selectedTask) => {
          setDeleteTarget({ kind: 'task', item: selectedTask })
          openDeleteConfirmation()
        }}
        onEditColumn={(selectedColumn) => {
          setColumn(selectedColumn)
          openCreateEditColumnModal()
        }}
        onDeleteColumn={(selectedColumn) => {
          setDeleteTarget({ kind: 'column', item: selectedColumn })
          openDeleteConfirmation()
        }}
      />
      <CreateEditKanbanTask
        opened={openedCreateEditModal}
        onClose={() => {
          closeCreateEditModal()
          setTask(null)
        }}
        employeesFromTeams={project?.employees ?? []}
        projectId={Number(boardId)}
        task={task}
      />
      <CreateEditKanbanColumnModal
        opened={openedCreateEditColumnModal}
        onClose={() => {
          closeCreateEditColumnModal()
          setColumn(null)
        }}
        projectId={Number(boardId)}
        column={column}
      />
      <KanbanTaskDetailDrawer
        opened={openedTaskDetailDrawer}
        selectedId={taskDetailId}
        projectId={Number(boardId)}
        onClose={() => {
          closeTaskDetailDrawer()
          setTaskDetailId(null)
        }}
        onEdit={(selectedTask) => {
          closeTaskDetailDrawer()
          setTask(selectedTask)
          openCreateEditModal()
        }}
      />
      <TamsConfirmation
        opened={openedDeleteConfirmation}
        onClose={closeDelete}
        onConfirm={handleDelete}
        loading={deleteTaskMutation.isPending || deleteStatusMutation.isPending}
        isCritical
        confirmText="Yes, delete"
        title={`Delete ${deleteTarget?.kind ?? 'item'}`}
        message={`Are you sure you want to delete this ${deleteTarget?.kind ?? 'item'}? This action cannot be undone.`}
      />
    </div>
  )
}
