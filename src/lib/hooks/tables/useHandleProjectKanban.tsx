import {
  useFetchProjectKanbanStatuses,
  useFetchProjectKanbanTasks,
} from '#/lib/api'
import type { TProjectKanbanTask } from '#/lib/types/api/performance'
import { useRef, useState } from 'react'

type TUseHandleProjectKanbanProps = {
  projectId: number
}

type Board = Record<string, TProjectKanbanTask[]>

const useHandleProjectKanban = ({
  projectId,
}: TUseHandleProjectKanbanProps) => {
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
  }
}

export default useHandleProjectKanban
