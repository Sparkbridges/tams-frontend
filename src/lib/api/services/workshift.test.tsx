import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useAssignWorkshift,
  useWorkshiftAccess,
  useWorkshifts,
} from './workshift'

const mocks = vi.hoisted(() => ({
  state: {
    user: {
      id: 1,
      permissions: [] as string[],
      employee: { company_id: 7, branch: { is_hq: 1 } },
    },
    activeBranch: 4,
  },
  list: vi.fn(),
  assign: vi.fn(),
  notify: vi.fn(),
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/store', () => ({
  useTamsStore: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}))
vi.mock('../client/workshift', () => ({
  default: { list: mocks.list, assign: mocks.assign },
}))
vi.mock('../client/organization', () => ({ default: {} }))
vi.mock('@mantine/notifications', () => ({
  notifications: { show: mocks.notify },
}))

function fixture() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, wrapper }
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.state = {
    user: {
      id: 1,
      permissions: ['view backend', 'view regular shifts', 'assign shift'],
      employee: { company_id: 7, branch: { is_hq: 1 } },
    },
    activeBranch: 4,
  }
  mocks.list.mockResolvedValue({ data: { results: [], total: 0 } })
  mocks.assign.mockResolvedValue({ message: 'Assignments saved' })
})
afterEach(cleanup)

describe('work shift queries and mutation feedback', () => {
  it('does not request shifts without view permission', () => {
    mocks.state.user.permissions = []
    const { wrapper } = fixture()
    renderHook(() => useWorkshifts({ page: 1, per_page: 10 }), { wrapper })
    expect(mocks.list).not.toHaveBeenCalled()
  })
  it('separates cached queries when branch/company context changes', async () => {
    const { client, wrapper } = fixture()
    const hook = renderHook(() => useWorkshifts({ page: 1, per_page: 10 }), {
      wrapper,
    })
    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true))
    mocks.state.activeBranch = 8
    hook.rerender()
    await waitFor(() => expect(mocks.list).toHaveBeenCalledTimes(2))
    mocks.state.user.employee.company_id = 9
    hook.rerender()
    await waitFor(() => expect(mocks.list).toHaveBeenCalledTimes(3))
    expect(
      client
        .getQueryCache()
        .getAll()
        .map((query) => query.queryKey[1]),
    ).toEqual([
      [7, 1, 4],
      [7, 1, 8],
      [9, 1, 8],
    ])
  })
  it('invalidates shift details, calendar and roster queries after successful assignments', async () => {
    const { client, wrapper } = fixture()
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(useAssignWorkshift, { wrapper })
    await act(async () => {
      await result.current.mutateAsync({
        regular_shift_id: 8,
        assignables: [{ type: 'employee', type_id: 42 }],
      })
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['attendance-workshifts'],
    })
    expect(mocks.notify).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'green', message: 'Assignments saved' }),
    )
  })
  it('reports errors without invalidating cached data or announcing success', async () => {
    mocks.assign.mockRejectedValueOnce(new Error('Assignment failed'))
    const { client, wrapper } = fixture()
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(useAssignWorkshift, { wrapper })
    await act(async () => {
      await expect(
        result.current.mutateAsync({
          regular_shift_id: 8,
          assignables: [{ type: 'employee', type_id: 42 }],
        }),
      ).rejects.toThrow('Assignment failed')
    })
    expect(invalidate).not.toHaveBeenCalled()
    expect(mocks.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'red',
        title: 'Work shift request failed',
      }),
    )
  })
  it('requires backend access and HQ membership for company-wide assignment controls', () => {
    const hook = renderHook(useWorkshiftAccess)
    expect(hook.result.current.isHqAdmin).toBe(true)
    mocks.state.user.employee.branch.is_hq = 0
    hook.rerender()
    expect(hook.result.current.isHqAdmin).toBe(false)
  })
})
