import {
  useFetchProjectKanbanStatuses,
  useFetchProjectKanbanTasks,
  useMoveProjectKanbanTask,
} from '#/lib/api'
import type { TProjectKanbanTask } from '#/lib/types/api/performance'
import { useEffect, useRef, useState } from 'react'

type TUseHandleProjectKanbanProps = {
  projectId: number
}

type Board = Record<string, TProjectKanbanTask[]>

const useHandleProjectKanban = ({
  projectId,
}: TUseHandleProjectKanbanProps) => {
  const columnKey = (id: number) => `column-${id}`
  const [board, setBoard] = useState<Board>({})

  const [dragging, setDragging] = useState(false)
  const boardRef = useRef(board)
  const snapshot = useRef<Board>({})
  const saving = useRef(false)

  const { data: kanbanTasks } = useFetchProjectKanbanTasks({
    project_id: projectId,
  })

  const { data: kanbanStatuses } = useFetchProjectKanbanStatuses({
    project_id: projectId,
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

  return {
    kanbanTasks,
    kanbanStatuses,
    board,
    setBoard,
    setDragging,
    saving,
    snapshot,
    boardRef,
    dragging,
    updateBoard,
    moveTask,
  }
}

export default useHandleProjectKanban
