import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import { useGetHrmExemptionById } from '#/lib/api/services/hrm'
import type { TFetchHrmExemptionByIdData } from '#/lib/types'
import HrmExemptionDetailDrawer from './HrmExemptionDetailDrawer'

vi.mock('#/lib/api/services/hrm', () => ({
  useGetHrmExemptionById: vi.fn(),
}))

vi.mock('#/components/atoms', () => ({
  TamsSpinner: () => <span>Loading</span>,
}))

const exemption: TFetchHrmExemptionByIdData = {
  id: 42,
  reason: 'Medical appointment',
  exemption_type: 'CLOCK_IN_OUT',
  employee_id: 7,
  approval_status: 'rejected',
  exemption_date: [],
  approval_note: 'Reviewed by HR',
  created_at: '2026-10-01',
  updated_at: '2026-10-02',
  company_id: 2,
  station_id: 3,
  exemption_approval_status: 2,
  rejection_reason: 'Supporting document required',
  exemptionsdate: [
    { id: 1, exemption_date: '2026-10-05' },
    { id: 2, exemption_date: '2026-10-06' },
  ],
  employees: [{ id: 7, employee_name: 'Jane Doe' }],
}

const refetch = vi.fn()
const mockQuery = (overrides = {}) => {
  vi.mocked(useGetHrmExemptionById).mockReturnValue({
    data: exemption,
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch,
    ...overrides,
  } as unknown as ReturnType<typeof useGetHrmExemptionById>)
}

describe('HrmExemptionDetailDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery()
  })

  afterEach(cleanup)

  it('loads the selected exemption and displays its request and approval details', () => {
    render(
      <HrmExemptionDetailDrawer opened onClose={vi.fn()} selectedId="42" />,
    )

    expect(useGetHrmExemptionById).toHaveBeenCalledWith(
      42,
      expect.any(Function),
    )
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Clock In/Out')).toBeInTheDocument()
    expect(screen.getByText('Medical appointment')).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
    expect(screen.getByText('Reviewed by HR')).toBeInTheDocument()
    expect(screen.getByText('Supporting document required')).toBeInTheDocument()
    expect(screen.getByText('Oct 05, 2026')).toBeInTheDocument()
    expect(screen.getByText('Oct 06, 2026')).toBeInTheDocument()
  })

  it('shows a loading state', () => {
    mockQuery({ data: undefined, isLoading: true })
    render(
      <HrmExemptionDetailDrawer opened onClose={vi.fn()} selectedId={42} />,
    )

    expect(
      screen.getByRole('status', { name: 'Loading exemption details' }),
    ).toBeInTheDocument()
  })

  it('offers a retry after a failed request', () => {
    mockQuery({ data: undefined, isError: true })
    render(
      <HrmExemptionDetailDrawer opened onClose={vi.fn()} selectedId={42} />,
    )

    expect(
      screen.getByText('Unable to load exemption details'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('disables the detail query when closed', () => {
    render(
      <HrmExemptionDetailDrawer
        opened={false}
        onClose={vi.fn()}
        selectedId={42}
      />,
    )

    expect(useGetHrmExemptionById).toHaveBeenCalledWith(0, expect.any(Function))
  })

  it('does not request an invalid selection', () => {
    render(<HrmExemptionDetailDrawer opened onClose={vi.fn()} selectedId={0} />)

    expect(useGetHrmExemptionById).toHaveBeenCalledWith(0, expect.any(Function))
    expect(
      screen.getByText('Select an exemption to view its details.'),
    ).toBeInTheDocument()
  })

  it('falls back to exemption_date and handles missing optional details', () => {
    mockQuery({
      data: {
        ...exemption,
        approval_status: 'pending',
        approval_note: null,
        rejection_reason: null,
        employees: [],
        exemptionsdate: [],
        exemption_date: ['2026-10-05'],
      },
    })
    render(
      <HrmExemptionDetailDrawer opened onClose={vi.fn()} selectedId={42} />,
    )

    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Oct 05, 2026')).toBeInTheDocument()
    expect(screen.getAllByText('Not provided')).toHaveLength(2)
    expect(screen.queryByText('Rejection reason')).not.toBeInTheDocument()
  })
})
