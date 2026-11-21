import { columnColors, newDayjs, useHandleProjectKanban } from '#/lib'
import type { TamsActionPopoverOption } from '#/lib'
import { TamsTableActionPopover } from '#/components/molecules'
import type {
  TFetchProjectKanbanStatuses,
  TProjectKanbanTask,
} from '#/lib/types/api/performance'
import { useSortable, isSortable } from '@dnd-kit/react/sortable'
import { useDroppable, DragDropProvider } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { move } from '@dnd-kit/helpers'
import { notifications } from '@mantine/notifications'
import { isAxiosError } from 'axios'
import {
  Avatar,
  Badge,
  Checkbox,
  Collapse,
  Paper,
  Tooltip,
} from '@mantine/core'
import {
  CaretDownIcon,
  ClockIcon,
  DotsSixVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'

type ProjectManagementKanbanProps = {
  boardId: number
  setTask?: React.Dispatch<React.SetStateAction<TProjectKanbanTask | null>>
  openCreateEditModal?: () => void
  onViewTask?: (task: TProjectKanbanTask) => void
  onDeleteTask?: (task: TProjectKanbanTask) => void
  onEditColumn?: (column: TFetchProjectKanbanStatuses) => void
  onDeleteColumn?: (column: TFetchProjectKanbanStatuses) => void
}

const columnKey = (id: number) => `column-${id}`

function Card({
  task,
  index,
  group,
  disabled,
  onClick,
  onViewTask,
  onDeleteTask,
}: {
  task: TProjectKanbanTask
  index: number
  group: string
  disabled: boolean
  onClick?: (task: TProjectKanbanTask) => void
  onViewTask?: (task: TProjectKanbanTask) => void
  onDeleteTask?: (task: TProjectKanbanTask) => void
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
    type: 'item',
    accept: 'item',
    group,
    disabled,
  })

  const [expanded, setExpanded] = useState(false)

  const taskActions: TamsActionPopoverOption[] = [
    {
      label: 'View Details',
      action: () => onViewTask?.(task),
      color: 'blue',
      icon: EyeIcon,
    },
    {
      label: 'Edit',
      action: () => onClick?.(task),
      color: 'gray',
      icon: PencilIcon,
    },
    {
      label: 'Delete',
      action: () => onDeleteTask?.(task),
      color: 'red',
      icon: TrashIcon,
    },
  ]

  const completedTasks =
    task.subtasks?.filter(
      (subtask) => subtask.status.system_key === 'completed',
    ) ?? []

  return (
    <Paper
      ref={ref}
      className={`p-3 mb-2 rounded-sm hover:cursor-pointer ${isDragging ? 'opacity-60' : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(task)
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge
          variant={'light'}
          color={task.issue_type === 'fix' ? 'red' : 'blue'}
        >
          {task.issue_type}
        </Badge>
        <div className="flex items-center">
          <button
            ref={handleRef}
            type="button"
            className="cursor-grab active:cursor-grabbing p-1 text-gray-500"
            aria-label={`Drag ${task.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <DotsSixVerticalIcon size={18} />
          </button>
        </div>
        <div className={'text-xs flex items-center gap-1'}>
          <ClockIcon />
          {newDayjs(task.due_date as string).fromNow()}
          <TamsTableActionPopover data={taskActions} size="sm" />
        </div>
      </div>
      <h1 className="text-lg font-bold">{task.title}</h1>
      <p className="text-sm">{task.description}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={completedTasks.length === task.subtasks?.length}
            size="xs"
            readOnly
            label={`(${completedTasks.length}/${task.subtasks?.length ?? 0}) Subtasks`}
          />
          {(task.subtasks?.length ?? 0) > 0 && (
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-blue-700"
              aria-expanded={expanded}
              onClick={(event) => {
                event.stopPropagation()
                setExpanded((previous) => !previous)
              }}
            >
              {expanded ? 'Hide' : 'View'}
              <CaretDownIcon
                size={14}
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
        <Tooltip.Group openDelay={300} closeDelay={100}>
          <Avatar.Group spacing="sm">
            {task.actors?.map((actor) => (
              <Tooltip
                key={actor.id}
                label={
                  actor.employee.first_name + ' ' + actor.employee.last_name
                }
                withArrow
              >
                <Avatar
                  src={actor?.employee?.picture}
                  color="initials"
                  name={
                    actor.employee.first_name + ' ' + actor.employee.last_name
                  }
                  size={'sm'}
                  radius="xl"
                />
              </Tooltip>
            ))}
            <Tooltip
              withArrow
              label={
                <>
                  {task.actors?.map((actor) => (
                    <div className="text-xs" key={actor.id}>
                      {actor.employee.first_name +
                        ' ' +
                        actor.employee.last_name}
                    </div>
                  ))}
                </>
              }
            >
              <Avatar color="initials" size={'sm'} radius="xl">
                +{task.actors?.length ?? 0}
              </Avatar>
            </Tooltip>
          </Avatar.Group>
        </Tooltip.Group>
      </div>
      <Collapse expanded={expanded} className="mt-2 space-y-2">
        {task.subtasks?.map((subtask) => (
          <Paper
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(subtask)
            }}
            key={subtask.id}
            className="py-1.5 px-3 flex gap-2 rounded-none border-y border-gray-200 hover:cursor-pointer"
          >
            <span className="size-2 bg-gray-400 rounded-full" />
            <div>
              <h4 className="font-bold text-sm">{subtask.title}</h4>
              <p className="text-xs">{subtask.description}</p>
            </div>
            <div className="ml-auto">
              <TamsTableActionPopover
                data={[
                  {
                    label: 'View Details',
                    action: () => onViewTask?.(subtask),
                    color: 'blue',
                    icon: EyeIcon,
                  },
                  {
                    label: 'Edit',
                    action: () => onClick?.(subtask),
                    color: 'gray',
                    icon: PencilIcon,
                  },
                  {
                    label: 'Delete',
                    action: () => onDeleteTask?.(subtask),
                    color: 'red',
                    icon: TrashIcon,
                  },
                ]}
                size="sm"
              />
            </div>
          </Paper>
        ))}
      </Collapse>
    </Paper>
  )
}

function Column({
  id,
  label,
  children,
  index,
  count,
  column,
  onEdit,
  onDelete,
}: {
  id: string
  label: string
  children: React.ReactNode
  index: number
  count: number
  column: TFetchProjectKanbanStatuses
  onEdit?: (column: TFetchProjectKanbanStatuses) => void
  onDelete?: (column: TFetchProjectKanbanStatuses) => void
}) {
  const columnActions: TamsActionPopoverOption[] = [
    {
      label: 'Edit',
      action: () => onEdit?.(column),
      color: 'orange',
      icon: PencilIcon,
    },
    {
      label: 'Delete',
      action: () => onDelete?.(column),
      color: 'red',
      icon: TrashIcon,
      hidden: Boolean(column.system_key),
    },
  ]

  // makes empty columns valid drop targets
  const { ref } = useDroppable({
    id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low, // cards win over the column
  })

  return (
    <div
      ref={ref}
      className="min-w-[325px] max-w-[325px] p-3 rounded-sm"
      style={{
        minHeight: 650,
        background: '#f4f5f7',
      }}
    >
      <div className="flex items-center gap-2 text-sm mb-2">
        <span
          className={`${columnColors[index as keyof typeof columnColors] ?? 'bg-gray-400'} size-1.5 rounded-full`}
        />{' '}
        <h3>{label}</h3>
        <Badge
          size="sm"
          className={`${columnColors[index as keyof typeof columnColors] ?? 'bg-gray-400'}`}
          circle
        >
          {count}
        </Badge>
        <div className="ml-auto">
          <TamsTableActionPopover data={columnActions} size="sm" />
        </div>
      </div>

      {children}
    </div>
  )
}

const ProjectManagementKanban = ({
  boardId,
  setTask,
  openCreateEditModal,
  onViewTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
}: ProjectManagementKanbanProps) => {
  const {
    kanbanTasks,
    board,
    boardRef,
    saving,
    setDragging,
    snapshot,
    updateBoard,
    moveTask,
  } = useHandleProjectKanban({
    projectId: boardId,
  })

  return (
    <DragDropProvider
      onDragStart={() => {
        snapshot.current = boardRef.current
        setDragging(true)
      }}
      onDragOver={(event) => {
        updateBoard(move(boardRef.current, event))
      }}
      onDragEnd={async (event) => {
        const { source, target } = event.operation
        if (event.canceled || !target || !source || !isSortable(source)) {
          updateBoard(snapshot.current)
          setDragging(false)
          return
        }

        const destination = kanbanTasks?.data?.find((column) =>
          boardRef.current[columnKey(column.id)]?.some(
            (task) => task.id === source.id,
          ),
        )
        const original = kanbanTasks?.data?.find((column) =>
          snapshot.current[columnKey(column.id)]?.some(
            (task) => task.id === source.id,
          ),
        )
        if (
          !destination ||
          !original ||
          destination.id === original.id ||
          saving.current
        ) {
          updateBoard(snapshot.current)
          setDragging(false)
          return
        }

        saving.current = true
        try {
          await moveTask.mutateAsync({
            project_id: boardId,
            task_id: Number(source.id),
            status_id: destination.id,
          })
        } catch (error) {
          updateBoard(snapshot.current)
          if (!isAxiosError(error)) {
            notifications.show({
              title: 'Unable to move task',
              message:
                error instanceof Error ? error.message : 'Please try again.',
              color: 'red',
            })
          }
        } finally {
          saving.current = false
          setDragging(false)
        }
      }}
    >
      <div className="flex gap-4 overflow-x-auto w-full">
        {kanbanTasks?.data?.map((c, index) => (
          <Column
            key={c.id}
            id={columnKey(c.id)}
            label={c.name}
            index={index}
            count={c.tasks?.length}
            column={c}
            onEdit={onEditColumn}
            onDelete={onDeleteColumn}
          >
            {(board[columnKey(c.id)] ?? []).map((t, i) => (
              <Card
                key={t.id}
                task={t}
                index={i}
                group={columnKey(c.id)}
                disabled={moveTask.isPending}
                onViewTask={onViewTask}
                onDeleteTask={onDeleteTask}
                onClick={(selectedTask) => {
                  setTask?.(selectedTask)
                  openCreateEditModal?.()
                }}
              />
            ))}
          </Column>
        ))}
      </div>
    </DragDropProvider>
  )
}

export default ProjectManagementKanban
