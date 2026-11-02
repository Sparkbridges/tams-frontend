import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AttendanceDeviceDetailDrawer from './AttendanceDeviceDetailDrawer'

const mocks = vi.hoisted(() => ({
  device: vi.fn(),
  access: vi.fn(),
  refetch: vi.fn(),
}))

vi.mock('#/lib/api/services/attendance', () => ({
  useAttendanceDevice: mocks.device,
  useAttendanceAccess: mocks.access,
}))

vi.mock('#/components/atoms', () => ({
  TamsSpinner: () => <span>Loading</span>,
}))

const device = {
  id: 9,
  alias: 'Reception',
  serial_no: 'SN-100',
  station_id: 4,
  device_type_id: 2,
  device_type: 'Biometric',
  timezone: '1',
  state: 1,
  user_count: 0,
  last_activity: '2026-10-27 09:00:00',
}

const query = (overrides = {}) => ({
  data: { data: device },
  isLoading: false,
  isError: false,
  isFetching: false,
  refetch: mocks.refetch,
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  mocks.access.mockReturnValue({ canViewDetail: true })
  mocks.device.mockReturnValue(query())
})

afterEach(cleanup)

describe('AttendanceDeviceDetailDrawer', () => {
  it('fetches by ID and renders the full device response', () => {
    render(
      <AttendanceDeviceDetailDrawer opened onClose={vi.fn()} selectedId="9" />,
    )

    expect(mocks.device).toHaveBeenCalledWith(9)
    for (const value of [
      'Reception',
      'SN-100',
      'Biometric',
      '4',
      'Etc/GMT+1',
      'Online',
      '0',
      '2026-10-27 09:00:00',
    ]) {
      expect(screen.getByText(value)).toBeInTheDocument()
    }
  })

  it('shows loading instead of partial table data', () => {
    mocks.device.mockReturnValue(query({ data: undefined, isLoading: true }))
    render(
      <AttendanceDeviceDetailDrawer opened onClose={vi.fn()} selectedId={9} />,
    )
    expect(
      screen.getByRole('status', { name: 'Loading attendance device details' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Reception')).not.toBeInTheDocument()
  })

  it.each([{ isError: true, data: undefined }, { data: undefined }])(
    'offers retry for failed or empty responses: %j',
    (overrides) => {
      mocks.device.mockReturnValue(query(overrides))
      render(
        <AttendanceDeviceDetailDrawer
          opened
          onClose={vi.fn()}
          selectedId={9}
        />,
      )
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Unable to load attendance device details',
      )
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
      expect(mocks.refetch).toHaveBeenCalledOnce()
    },
  )

  it('disables the query when closed', () => {
    render(
      <AttendanceDeviceDetailDrawer
        opened={false}
        onClose={vi.fn()}
        selectedId={9}
      />,
    )
    expect(mocks.device).toHaveBeenCalledWith(0)
  })

  it.each([null, '', 0, -1, 'invalid', 1.5])(
    'does not fetch an invalid ID: %s',
    (selectedId) => {
      render(
        <AttendanceDeviceDetailDrawer
          opened
          onClose={vi.fn()}
          selectedId={selectedId}
        />,
      )
      expect(mocks.device).toHaveBeenCalledWith(0)
      expect(
        screen.getByText('Select a device to view its details.'),
      ).toBeInTheDocument()
    },
  )

  it('denies access without displaying cached details or offering retry', () => {
    mocks.access.mockReturnValue({ canViewDetail: false })
    render(
      <AttendanceDeviceDetailDrawer opened onClose={vi.fn()} selectedId={9} />,
    )
    expect(mocks.device).toHaveBeenCalledWith(0)
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied')
    expect(screen.queryByText('Reception')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
  })

  it('updates the query and details when the selection changes', () => {
    const { rerender } = render(
      <AttendanceDeviceDetailDrawer opened onClose={vi.fn()} selectedId={9} />,
    )
    mocks.device.mockReturnValue(
      query({ data: { data: { ...device, id: 10, alias: 'Exit', state: 0 } } }),
    )
    rerender(
      <AttendanceDeviceDetailDrawer opened onClose={vi.fn()} selectedId={10} />,
    )
    expect(mocks.device).toHaveBeenLastCalledWith(10)
    expect(screen.getByText('Exit')).toBeInTheDocument()
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.queryByText('Reception')).not.toBeInTheDocument()
  })

  it('handles missing optional fields without inventing offline status', () => {
    mocks.device.mockReturnValue(
      query({
        data: {
          data: {
            ...device,
            state: undefined,
            user_count: undefined,
            last_activity: null,
            device_type: undefined,
          },
        },
      }),
    )
    render(
      <AttendanceDeviceDetailDrawer opened onClose={vi.fn()} selectedId={9} />,
    )
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText('Type #2')).toBeInTheDocument()
    expect(screen.getByText('Not available')).toBeInTheDocument()
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })
})
