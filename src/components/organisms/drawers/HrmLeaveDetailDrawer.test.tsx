import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import { useGetHrmLeaveById } from '#/lib/api/services/hrm'
import type { TFetchHrmLeavesData } from '#/lib/types'
import HrmLeaveDetailDrawer from './HrmLeaveDetailDrawer'

vi.mock('#/lib/api/services/hrm', () => ({
  useGetHrmLeaveById: vi.fn(),
}))

vi.mock('#/components/atoms', () => ({
  TamsSpinner: () => <span>Loading</span>,
}))

const leave: TFetchHrmLeavesData = {
  id: 42,
  leave_id: 3,
  employee_id: 7,
  employee_name: 'Jane Doe',
  leave_type_name: 'Annual Leave',
  start_date: '2026-10-05',
  end_date: '2026-10-09',
  number_of_days: 5,
  handover_to: 8,
  relief: 'John Doe',
  status: 'rejected',
  approved_count: 0,
  note: 'Family vacation',
  rejection_reason: 'Insufficient leave balance',
  created_at: '2026-10-01',
  updated_at: '2026-10-02',
  company_id: 2,
  station_id: 3,
  leave_request_data: '{}',
}

const refetch = vi.fn()
const mockQuery = (overrides = {}) => {
  vi.mocked(useGetHrmLeaveById).mockReturnValue({
    data: leave,
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch,
    ...overrides,
  } as unknown as ReturnType<typeof useGetHrmLeaveById>)
}

describe('HrmLeaveDetailDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery()
  })

  afterEach(cleanup)

  it('loads the selected leave and displays its request and approval details', () => {
    render(<HrmLeaveDetailDrawer opened onClose={vi.fn()} selectedId="42" />)

    expect(useGetHrmLeaveById).toHaveBeenCalledWith(42, expect.any(Function))
    expect(screen.getByText('Leave Details')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Annual Leave')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Family vacation')).toBeInTheDocument()
    expect(screen.getByText('5 days')).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
    expect(screen.getByText('Insufficient leave balance')).toBeInTheDocument()
    expect(screen.getByText('Oct 05, 2026')).toBeInTheDocument()
    expect(screen.getByText('Oct 09, 2026')).toBeInTheDocument()
  })

  it('shows a loading state', () => {
    mockQuery({ data: undefined, isLoading: true })
    render(<HrmLeaveDetailDrawer opened onClose={vi.fn()} selectedId={42} />)

    expect(
      screen.getByRole('status', { name: 'Loading leave details' }),
    ).toBeInTheDocument()
  })

  it('offers a retry after a failed request', () => {
    mockQuery({ data: undefined, isError: true })
    render(<HrmLeaveDetailDrawer opened onClose={vi.fn()} selectedId={42} />)

    expect(screen.getByText('Unable to load leave details')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('disables the detail query when closed', () => {
    render(
      <HrmLeaveDetailDrawer opened={false} onClose={vi.fn()} selectedId={42} />,
    )

    expect(useGetHrmLeaveById).toHaveBeenCalledWith(0, expect.any(Function))
  })

  it.each([0, -1, 1.5, 'invalid'])('does not request invalid ID %s', (id) => {
    render(<HrmLeaveDetailDrawer opened onClose={vi.fn()} selectedId={id} />)

    expect(useGetHrmLeaveById).toHaveBeenCalledWith(0, expect.any(Function))
    expect(
      screen.getByText('Select a leave request to view its details.'),
    ).toBeInTheDocument()
  })

  it('shows taken leave as completed and handles missing optional details', () => {
    mockQuery({
      data: {
        ...leave,
        status: 'taken',
        number_of_days: 1,
        relief: '',
        note: '',
        rejection_reason: null,
      },
    })
    render(<HrmLeaveDetailDrawer opened onClose={vi.fn()} selectedId={42} />)

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('1 day')).toBeInTheDocument()
    expect(screen.getAllByText('Not provided')).toHaveLength(2)
    expect(screen.queryByText('Rejection reason')).not.toBeInTheDocument()
  })
})
