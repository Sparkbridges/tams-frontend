import { useHandleProjectKanban } from '#/lib'
import { useMoveProjectKanbanTask } from '#/lib/api'
import type { TProjectKanbanTask } from '#/lib/types/api/performance'
import { useSortable, isSortable } from '@dnd-kit/react/sortable'
import { useEffect } from 'react'
import { useDroppable, DragDropProvider } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { move } from '@dnd-kit/helpers'
import { notifications } from '@mantine/notifications'
import { isAxiosError } from 'axios'
import { Badge, Paper } from '@mantine/core'

type ProjectManagementKanbanProps = {
  boardId: number
}

type Board = Record<string, TProjectKanbanTask[]>
const columnKey = (id: number) => `column-${id}`

function Card({
  task,
  index,
  group,
  disabled,
}: {
  task: TProjectKanbanTask
  index: number
  group: string
  disabled: boolean
}) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: 'item',
    accept: 'item',
    group,
    disabled,
  })

  return (
    <Paper
      ref={ref}
      className={`p-3 mb-2 rounded-sm ${isDragging ? 'opacity-60' : ''}`}
    >
      <div>
        <Badge>{task.title}</Badge>
      </div>
      {task.title}
    </Paper>
  )
}

function Column({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
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
      style={{
        flex: 1,
        minHeight: 650,
        padding: 12,
        borderRadius: 8,
        background: '#f4f5f7',
      }}
    >
      <h3>{label}</h3>
      {children}
    </div>
  )
}

const ProjectManagementKanban = ({ boardId }: ProjectManagementKanbanProps) => {
  const {
    kanbanTasks,
    board,
    setBoard,
    boardRef,
    dragging,
    saving,
    setDragging,
    snapshot,
  } = useHandleProjectKanban({
    projectId: boardId,
  })

  const moveTask = useMoveProjectKanbanTask()

  const updateBoard = (next: Board) => {
    boardRef.current = next
    setBoard(next)
  }

  useEffect(() => {
    if (!dragging && !moveTask.isPending && kanbanTasks?.data) {
      updateBoard(
        Object.fromEntries(
          kanbanTasks.data.map((column) => [
            columnKey(column.id),
            column.tasks,
          ]),
        ),
      )
    }
  }, [kanbanTasks?.data, dragging, moveTask.isPending])

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
      <div className="flex gap-4 overflow-x-auto">
        {kanbanTasks?.data?.map((c) => (
          <Column key={c.id} id={columnKey(c.id)} label={c.name}>
            {(board[columnKey(c.id)] ?? []).map((t, i) => (
              <Card
                key={t.id}
                task={t}
                index={i}
                group={columnKey(c.id)}
                disabled={moveTask.isPending}
              />
            ))}
          </Column>
        ))}
      </div>
    </DragDropProvider>
  )
}

export default ProjectManagementKanban
