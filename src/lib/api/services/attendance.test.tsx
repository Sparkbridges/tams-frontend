import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  useAttendanceTransaction,
  useAttendanceTransactions,
  useGetAttendanceDevices,
} from './attendance'

const mocks = vi.hoisted(() => ({
  state: {
    user: {
      id: 1,
      permissions: ['view all device'],
      employee: { company_id: 7 },
    },
    activeBranch: 4,
  },
  transaction: vi.fn(),
  commands: vi.fn(),
  transactions: vi.fn(),
  devices: vi.fn(),
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/store', () => ({
  useTamsStore: (select: (state: typeof mocks.state) => unknown) =>
    select(mocks.state),
}))
vi.mock('../client/attendance', () => ({
  default: {
    transaction: mocks.transaction,
    transactionCommands: mocks.commands,
    transactions: mocks.transactions,
    devices: mocks.devices,
  },
}))
vi.mock('@mantine/notifications', () => ({ notifications: { show: vi.fn() } }))

function fixture() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, wrapper }
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.state.user.permissions = ['view all device']
  mocks.state.activeBranch = 4
  mocks.transaction.mockResolvedValue({ data: { id: 12 } })
  mocks.commands.mockResolvedValue({ data: { results: [], total: 0 } })
  mocks.transactions.mockResolvedValue({
    data: { results: [{ id: 12 }], total: 1 },
  })
  mocks.devices.mockResolvedValue({ data: { results: [{ id: 9 }], total: 1 } })
})
afterEach(cleanup)

it('does not fetch detail or commands while closed, unauthorized or invalid', () => {
  const { wrapper } = fixture()
  const hook = renderHook(
    ({ id, active }) =>
      useAttendanceTransaction(id, { page: 1, perPage: 10 }, active),
    {
      wrapper,
      initialProps: { id: 12, active: false },
    },
  )
  hook.rerender({ id: 0, active: true })
  mocks.state.user.permissions = []
  hook.rerender({ id: 12, active: true })
  expect(mocks.transaction).not.toHaveBeenCalled()
  expect(mocks.commands).not.toHaveBeenCalled()
})

it('fetches details and paginated commands and scopes requests by branch', async () => {
  const { wrapper } = fixture()
  const hook = renderHook(
    ({ page }) => useAttendanceTransaction(12, { page, perPage: 10 }),
    {
      wrapper,
      initialProps: { page: 1 },
    },
  )
  await waitFor(() => expect(hook.result.current.commands.isSuccess).toBe(true))
  expect(mocks.transaction).toHaveBeenCalledWith(12)
  expect(mocks.commands).toHaveBeenCalledWith(12, { page: 1, perPage: 10 })
  hook.rerender({ page: 2 })
  await waitFor(() =>
    expect(mocks.commands).toHaveBeenCalledWith(12, { page: 2, perPage: 10 }),
  )
  mocks.state.activeBranch = 8
  hook.rerender({ page: 2 })
  await waitFor(() => expect(mocks.transaction).toHaveBeenCalledTimes(2))
})

it('does not share cached list data between devices and transaction history', async () => {
  const { wrapper } = fixture()
  const hook = renderHook(
    () => ({
      devices: useGetAttendanceDevices(
        { page: 1, perPage: 10 },
        undefined,
        true,
      ),
      transactions: useAttendanceTransactions(
        { page: 1, perPage: 10 },
        undefined,
        true,
      ),
    }),
    { wrapper },
  )
  await waitFor(() => {
    expect(hook.result.current.devices.isSuccess).toBe(true)
    expect(hook.result.current.transactions.isSuccess).toBe(true)
  })
  expect(mocks.devices).toHaveBeenCalledOnce()
  expect(mocks.transactions).toHaveBeenCalledOnce()
})
