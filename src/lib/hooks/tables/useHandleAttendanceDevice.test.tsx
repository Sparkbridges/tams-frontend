import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import useHandleAttendanceDevice from './useHandleAttendanceDevice'

const mocks = vi.hoisted(() => ({ canView: true }))
vi.mock('#/components', () => ({ TamsTableActionPopover: () => null }))
vi.mock('#/lib/api', () => ({
  useAttendanceAccess: () => ({
    canView: mocks.canView,
    canEdit: false,
    canCreate: false,
  }),
  useAttendanceDeviceCommand: () => ({ isPending: false }),
  useAttendanceDeviceUsers: () => ({ isLoading: false }),
  useAttendanceTransactions: () => ({ isLoading: false }),
  useGetAttendanceDevices: () => ({ isLoading: false }),
}))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('#/lib/utils', () => ({ normalizeStrings: (value: string) => value }))

beforeEach(() => {
  mocks.canView = true
})
afterEach(cleanup)

it('opens transaction details using the clicked log ID, independently of device details', () => {
  const { result } = renderHook(() =>
    useHandleAttendanceDevice({ activeTab: 'logs' }),
  )
  act(() => result.current.handleSelectRow({ id: 12 }))
  expect(result.current.selectedTransactionId).toBe(12)
  expect(result.current.openedTransactionDetail).toBe(true)
  expect(result.current.openedDetail).toBe(false)
  act(() => result.current.closeTransactionDetail())
  expect(result.current.openedTransactionDetail).toBe(false)
  act(() => result.current.handleSelectRow({ id: 13 }))
  expect(result.current.selectedTransactionId).toBe(13)
})

it('preserves device row behavior without opening a transaction drawer', () => {
  const { result } = renderHook(() =>
    useHandleAttendanceDevice({ activeTab: 'devices' }),
  )
  act(() => result.current.handleSelectRow({ id: 9 }))
  expect(result.current.openedDetail).toBe(true)
  expect(result.current.selectedRow?.id).toBe(9)
  expect(result.current.openedTransactionDetail).toBe(false)
})

it('does not open transaction details for a user row or without permission', () => {
  const { result, rerender } = renderHook(
    ({ activeTab }: { activeTab: 'user' | 'logs' }) =>
      useHandleAttendanceDevice({ activeTab }),
    { initialProps: { activeTab: 'user' } },
  )
  act(() => result.current.handleSelectRow({ id: 12 }))
  expect(result.current.openedTransactionDetail).toBe(false)
  mocks.canView = false
  rerender({ activeTab: 'logs' })
  act(() => result.current.handleSelectRow({ id: 12 }))
  expect(result.current.openedTransactionDetail).toBe(false)
})
