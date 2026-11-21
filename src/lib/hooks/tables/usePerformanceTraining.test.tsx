import {
  act,
  cleanup,
  fireEvent,
  renderHook,
  screen,
} from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import usePerformanceTraining from './usePerformanceTraining'
import type { TamsActionPopoverOption } from '#/lib/types'

vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('#/lib/api', () => ({
  usePerformanceAccess: () => ({ canDeleteTraining: true }),
  useFetchPerformanceTrainings: () => ({
    data: { results: [], total: 0 },
    isLoading: false,
  }),
  useApprovePerformanceTraining: () => ({ mutateAsync: vi.fn() }),
  useDeletePerformanceTraining: () => ({ mutateAsync: vi.fn() }),
}))
vi.mock('#/components', () => ({
  TamsTableActionPopover: ({ data }: { data: TamsActionPopoverOption[] }) => (
    <>
      {data.map((option) => (
        <button key={option.label} onClick={() => option.action()}>
          {option.label}
        </button>
      ))}
    </>
  ),
}))

afterEach(cleanup)

it('opens selected training details from row clicks and clears selection on close', () => {
  const { result } = renderHook(() => usePerformanceTraining())
  expect(result.current.detailId).toBeNull()
  act(() => result.current.handleOpenDetails({ id: 12 }))
  expect(result.current.detailId).toBe(12)
  act(() => result.current.handleOpenDetails({ id: 15 }))
  expect(result.current.detailId).toBe(15)
  act(() => result.current.handleCloseDetails())
  expect(result.current.detailId).toBeNull()
})

it('opens details from View Details without triggering the row click or confirmation', () => {
  const { result } = renderHook(() => usePerformanceTraining())
  const rowClick = vi.fn()
  const column = result.current.columns.find(
    (item) => item.accessor === 'actions',
  )
  render(
    <div onClick={rowClick}>
      {column?.render?.({ id: 12, status: 'pending' })}
    </div>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'View Details' }))
  expect(result.current.detailId).toBe(12)
  expect(rowClick).not.toHaveBeenCalled()
  expect(result.current.openedConfirmation).toBe(false)
})
