import { act, cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProjectManagementKanban from './ProjectManagementKanban'

const mocks = vi.hoisted(() => ({
  handlers: {} as Record<string, (event: any) => unknown>,
  data: [] as any[],
  mutate: vi.fn(),
  notify: vi.fn(),
  sortable: vi.fn(),
}))

vi.mock('#/lib', () => ({
  useHandleProjectKanban: () => ({ kanbanTasks: { data: mocks.data } }),
}))
vi.mock('#/lib/api', () => ({
  useMoveProjectKanbanTask: () => ({
    mutateAsync: mocks.mutate,
    isPending: false,
  }),
}))
vi.mock('@mantine/notifications', () => ({
  notifications: { show: mocks.notify },
}))
vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children, ...handlers }: any) => {
    mocks.handlers = handlers
    return children
  },
  useDroppable: () => ({ ref: vi.fn() }),
}))
vi.mock('@dnd-kit/react/sortable', () => ({
  isSortable: () => true,
  useSortable: (options: unknown) => {
    mocks.sortable(options)
    return { ref: vi.fn(), isDragging: false }
  },
}))

const operation = (target: string | number | null) => ({
  operation: {
    source: {
      id: 10,
      initialGroup: 'column-1',
      group: target,
      initialIndex: 0,
      index: 0,
      manager: { dragOperation: { position: { current: { x: 0, y: 0 } } } },
    },
    target: target ? { id: target } : null,
    canceled: false,
  },
  canceled: false,
})

const column = (name: string) => {
  const heading = screen.getByRole('heading', { name })
  if (!heading.parentElement) throw new Error('Column not found')
  return within(heading.parentElement)
}

describe('project kanban drag and drop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.data = [
      {
        id: 1,
        name: 'Backlog',
        tasks: [{ id: 10, title: 'Build login', status_id: 1 }],
      },
      { id: 2, name: 'In progress', tasks: [] },
    ]
    mocks.mutate.mockResolvedValue({ status: true })
  })
  afterEach(cleanup)

  it('renders fetched cards with their column group and moves into an empty column', async () => {
    render(<ProjectManagementKanban boardId={17} />)
    expect(column('Backlog').getByText('Build login')).toBeInTheDocument()
    expect(mocks.sortable).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, group: 'column-1' }),
    )
    act(() => mocks.handlers.onDragStart({}))
    act(() => mocks.handlers.onDragOver(operation('column-2')))
    expect(column('In progress').getByText('Build login')).toBeInTheDocument()
    expect(column('Backlog').queryByText('Build login')).not.toBeInTheDocument()
    await act(async () => {
      await mocks.handlers.onDragEnd(operation('column-2'))
    })
    expect(mocks.mutate).toHaveBeenCalledWith({
      project_id: 17,
      task_id: 10,
      status_id: 2,
    })
  })

  it('moves a card onto another card in a populated column', async () => {
    mocks.data[1].tasks = [{ id: 11, title: 'Review design', status_id: 2 }]
    render(<ProjectManagementKanban boardId={17} />)
    const event = operation(11)
    act(() => mocks.handlers.onDragStart({}))
    act(() => mocks.handlers.onDragOver(event))
    expect(column('In progress').getByText('Build login')).toBeInTheDocument()
    expect(column('In progress').getByText('Review design')).toBeInTheDocument()
    await act(async () => {
      await mocks.handlers.onDragEnd(event)
    })
    expect(mocks.mutate).toHaveBeenCalledWith({
      project_id: 17,
      task_id: 10,
      status_id: 2,
    })
  })

  it('restores the original board when a drag is canceled or dropped outside', async () => {
    render(<ProjectManagementKanban boardId={17} />)
    act(() => mocks.handlers.onDragStart({}))
    act(() => mocks.handlers.onDragOver(operation('column-2')))
    await act(async () => {
      await mocks.handlers.onDragEnd(operation(null))
    })
    expect(column('Backlog').getByText('Build login')).toBeInTheDocument()
    expect(mocks.mutate).not.toHaveBeenCalled()
  })

  it('rolls back and reports a failed save', async () => {
    mocks.mutate.mockRejectedValue(new Error('Permission denied'))
    render(<ProjectManagementKanban boardId={17} />)
    act(() => mocks.handlers.onDragStart({}))
    act(() => mocks.handlers.onDragOver(operation('column-2')))
    await act(async () => {
      await mocks.handlers.onDragEnd(operation('column-2'))
    })
    expect(column('Backlog').getByText('Build login')).toBeInTheDocument()
    expect(mocks.notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Permission denied', color: 'red' }),
    )
  })

  it('does not send a status update for a drop in the original column', async () => {
    render(<ProjectManagementKanban boardId={17} />)
    act(() => mocks.handlers.onDragStart({}))
    await act(async () => {
      await mocks.handlers.onDragEnd(operation('column-1'))
    })
    expect(column('Backlog').getByText('Build login')).toBeInTheDocument()
    expect(mocks.mutate).not.toHaveBeenCalled()
  })

  it('renders refreshed server data after a successful move', async () => {
    const view = render(<ProjectManagementKanban boardId={17} />)
    act(() => mocks.handlers.onDragStart({}))
    act(() => mocks.handlers.onDragOver(operation('column-2')))
    mocks.data = [
      { id: 1, name: 'Backlog', tasks: [] },
      {
        id: 2,
        name: 'In progress',
        tasks: [{ id: 10, title: 'Build login', status_id: 2 }],
      },
    ]
    view.rerender(<ProjectManagementKanban boardId={17} />)
    await act(async () => {
      await mocks.handlers.onDragEnd(operation('column-2'))
    })
    expect(column('In progress').getByText('Build login')).toBeInTheDocument()
    expect(column('Backlog').queryByText('Build login')).not.toBeInTheDocument()
  })
})
