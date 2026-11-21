import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import PerformanceTrainingDetailDrawer from './PerformanceTrainingDetailDrawer'

vi.mock('#/router', () => ({ getRouter: vi.fn() }))
const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  retry: vi.fn(),
  pending: false,
  failed: false,
  empty: false,
  data: {
    id: 12,
    title: 'Customer care',
    duration: '2 weeks',
    duration_days: 14,
    description: 'Improve customer service',
    type: 'performance_improvement',
    status: 'pending',
    station_id: 3,
    is_generic: 0,
    file_url: 'https://example.com/training',
    assignment_category: 'employees',
    assignment_ids: [7],
    created_by_id: 8,
    approved_by_id: null,
    approved_at: null,
    created_at: '2026-11-01',
    updated_at: '2026-11-02',
    assignments: [
      {
        id: 25,
        employee_id: 9,
        employee: { first_name: 'Jane', last_name: 'Doe' },
        status: 'completed',
        score: 0,
        completed_at: '2026-11-03',
      },
    ],
  },
}))

vi.mock('#/lib/api', () => ({
  useFetchPerformanceTrainingById: (...args: unknown[]) => {
    mocks.query(...args)
    return {
      data: {
        ...mocks.data,
        assignments: mocks.empty ? [] : mocks.data.assignments,
      },
      isPending: mocks.pending,
      isError: mocks.failed,
      error: new Error('Request failed'),
      refetch: mocks.retry,
    }
  },
}))

describe('performance training details drawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.pending = false
    mocks.failed = false
    mocks.empty = false
    mocks.data.assignment_category = 'employees'
  })
  afterEach(cleanup)

  const drawer = (opened = true, selectedId = 12) => (
    <PerformanceTrainingDetailDrawer
      opened={opened}
      selectedId={selectedId}
      onClose={vi.fn()}
    />
  )

  it('fetches selected training and displays details, content and employee progress', () => {
    render(drawer())
    expect(mocks.query).toHaveBeenCalledWith(expect.any(Function), 12, true)
    expect(screen.getByText('Customer care')).toBeInTheDocument()
    expect(screen.getByText('Duration: 14 day(s)')).toBeInTheDocument()
    expect(screen.getByText('Selected IDs: 7')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Score: 0')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Open training content' })
    expect(link).toHaveAttribute('href', 'https://example.com/training')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows loading, errors and a retry action rather than stale details', () => {
    mocks.pending = true
    const { rerender } = render(drawer())
    expect(screen.getByRole('status')).toHaveTextContent('Loading training')
    expect(screen.queryByText('Customer care')).not.toBeInTheDocument()
    mocks.pending = false
    mocks.failed = true
    rerender(drawer())
    expect(screen.getByText('Request failed')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(mocks.retry).toHaveBeenCalledOnce()
  })

  it.each(['department', 'branch', 'team', 'grade'])(
    'hides employee lists for %s assignments while retaining criteria',
    (category) => {
      mocks.data.assignment_category = category
      render(drawer())
      expect(screen.getByText('Selected IDs: 7')).toBeInTheDocument()
      expect(screen.queryByText('Assigned employees')).not.toBeInTheDocument()
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Score: 0')).not.toBeInTheDocument()
    },
  )

  it('handles no assignments and changes the query when selecting another training', () => {
    mocks.empty = true
    const { rerender } = render(drawer())
    expect(screen.getByText('No employees assigned.')).toBeInTheDocument()
    rerender(drawer(true, 15))
    expect(mocks.query).toHaveBeenLastCalledWith(expect.any(Function), 15, true)
    rerender(drawer(false, 15))
    expect(mocks.query).toHaveBeenLastCalledWith(
      expect.any(Function),
      15,
      false,
    )
  })
})
