import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AttendanceTransactionDetailDrawer from './AttendanceTransactionDetailDrawer'

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  detail: vi.fn(),
  refreshDetail: vi.fn(),
  refreshCommands: vi.fn(),
}))
vi.mock('#/lib/api/services/attendance', () => ({
  useAttendanceAccess: mocks.access,
  useAttendanceTransaction: mocks.detail,
}))
vi.mock('#/components/atoms', () => ({
  TamsSpinner: () => <span>Loading</span>,
}))

const result = () => ({
  transaction: {
    data: {
      data: {
        id: 12,
        command_type: 'USER_TRANSFER',
        station_id: 4,
        created_at: '2026-10-29T09:00:00Z',
        updated_at: '2026-10-29T10:00:00Z',
      },
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: mocks.refreshDetail,
  },
  commands: {
    data: {
      data: {
        total: 21,
        results: [
          {
            id: 3,
            serial_no: 'SN-1',
            status: 'pending',
            cmd_content: 'DATA USER PIN=42',
            cmd_commit_time: null,
          },
          { id: 2, serial_no: 'SN-2', status: 'successful' },
          { id: 1, serial_no: 'SN-3', status: 'failed' },
        ],
      },
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: mocks.refreshCommands,
  },
})
beforeEach(() => {
  vi.clearAllMocks()
  mocks.access.mockReturnValue({ canView: true })
  mocks.detail.mockReturnValue(result())
})
afterEach(cleanup)

const open = () =>
  render(
    <AttendanceTransactionDetailDrawer
      opened
      onClose={vi.fn()}
      selectedId={12}
    />,
  )

it('fetches details by ID and renders command statuses and content', () => {
  open()
  expect(mocks.detail).toHaveBeenLastCalledWith(
    12,
    { page: 1, perPage: 10 },
    true,
  )
  for (const text of [
    'Transaction #12',
    'SN-1',
    'pending',
    'successful',
    'failed',
    'DATA USER PIN=42',
  ]) {
    expect(screen.getByText(text)).toBeInTheDocument()
  }
})

it('requests the selected command page', () => {
  open()
  fireEvent.click(screen.getByRole('button', { name: '2' }))
  expect(mocks.detail).toHaveBeenLastCalledWith(
    12,
    { page: 2, perPage: 10 },
    true,
  )
})

it('refreshes both details and the current command page', () => {
  open()
  fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  expect(mocks.refreshDetail).toHaveBeenCalledOnce()
  expect(mocks.refreshCommands).toHaveBeenCalledOnce()
})

it('renders loading instead of cached details', () => {
  const data = result()
  data.transaction.isLoading = true
  mocks.detail.mockReturnValue(data)
  open()
  expect(
    screen.getByRole('status', { name: 'Loading transaction details' }),
  ).toBeInTheDocument()
  expect(screen.queryByText('Transaction #12')).not.toBeInTheDocument()
})

it('offers a retry when transaction loading fails', () => {
  const data = result()
  data.transaction.isError = true
  mocks.detail.mockReturnValue(data)
  open()
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(mocks.refreshDetail).toHaveBeenCalledOnce()
})

it('keeps metadata visible when commands fail and offers a separate retry', () => {
  const data = result()
  data.commands.isError = true
  mocks.detail.mockReturnValue(data)
  open()
  expect(screen.getByText('Transaction #12')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Retry commands' }))
  expect(mocks.refreshCommands).toHaveBeenCalledOnce()
  expect(screen.queryByText('SN-1')).not.toBeInTheDocument()
})

it('shows an explicit empty commands state', () => {
  const data = result()
  data.commands.data.data = { results: [], total: 0 }
  mocks.detail.mockReturnValue(data)
  open()
  expect(screen.getByText('No commands on this page.')).toBeInTheDocument()
})

it('does not expose cached data without permission', () => {
  mocks.access.mockReturnValue({ canView: false })
  open()
  expect(mocks.detail).toHaveBeenLastCalledWith(
    12,
    { page: 1, perPage: 10 },
    false,
  )
  expect(screen.getByRole('alert')).toHaveTextContent('Access denied')
  expect(screen.queryByText('SN-1')).not.toBeInTheDocument()
})

it('disables closed drawers and invalid IDs', () => {
  const { rerender } = render(
    <AttendanceTransactionDetailDrawer
      opened={false}
      onClose={vi.fn()}
      selectedId={12}
    />,
  )
  expect(mocks.detail).toHaveBeenLastCalledWith(
    12,
    { page: 1, perPage: 10 },
    false,
  )
  rerender(
    <AttendanceTransactionDetailDrawer
      opened
      onClose={vi.fn()}
      selectedId={0}
    />,
  )
  expect(mocks.detail).toHaveBeenLastCalledWith(
    0,
    { page: 1, perPage: 10 },
    true,
  )
  expect(
    screen.getByText('Select a transaction to view its details.'),
  ).toBeInTheDocument()
})
