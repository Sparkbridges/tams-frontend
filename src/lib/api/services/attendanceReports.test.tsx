import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useAttendanceReport,
  useAttendanceReportAccess,
  useAttendanceReportBranches,
} from './attendanceReports'

const mocks = vi.hoisted(() => ({
  permissions: ['view simple report'],
  scope: [1, 2, 3],
  generate: vi.fn(),
  branches: vi.fn(),
}))
vi.mock('#/lib/store', () => ({
  useTamsStore: (selector: (value: unknown) => unknown) =>
    selector({ user: { permissions: mocks.permissions } }),
}))
vi.mock('./attendance', () => ({ useAttendanceScope: () => mocks.scope }))
vi.mock('../client/attendanceReports', () => ({
  default: { generate: mocks.generate },
}))
vi.mock('../client/organization', () => ({
  default: { fetchOrganizationBranches: mocks.branches },
}))
const params = {
  type: 'simple' as const,
  fetch_by: 'branch' as const,
  fetch_by_id: 'all' as const,
  columns: ['pin', 'name'],
  date_from: '2026-11-01',
  date_to: '2026-11-30',
  group_by: 'employee' as const,
  exclude_weekend: false,
  exclude_public_holiday: false,
  only_sunday: false,
  hourly_view: false,
  page: 1,
  per_page: 10,
}
function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.permissions = ['view simple report']
  mocks.scope = [1, 2, 3]
  mocks.generate.mockResolvedValue({ data: { results: [], total: 0 } })
})
afterEach(cleanup)

describe('attendance report queries', () => {
  it('does not request a report before generation', () => {
    renderHook(() => useAttendanceReport(null), { wrapper: wrapper() })
    expect(mocks.generate).not.toHaveBeenCalled()
  })
  it('gates requests by the selected report permission', () => {
    mocks.permissions = []
    renderHook(() => useAttendanceReport(params), { wrapper: wrapper() })
    expect(mocks.generate).not.toHaveBeenCalled()
  })
  it('includes page and scope in the query key, fetching again after a branch change', async () => {
    const hook = renderHook(() => useAttendanceReport(params), {
      wrapper: wrapper(),
    })
    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true))
    mocks.scope = [1, 2, 4]
    hook.rerender()
    await waitFor(() => expect(mocks.generate).toHaveBeenCalledTimes(2))
  })
  it('uses lowercase canonical permission names while preserving earlyIn API casing', async () => {
    mocks.permissions = ['view earlyin report']
    const hook = renderHook(
      () => ({
        reports: useAttendanceReportAccess(),
        query: useAttendanceReport({ ...params, type: 'earlyIn' }),
      }),
      { wrapper: wrapper() },
    )
    await waitFor(() => expect(hook.result.current.query.isSuccess).toBe(true))
    expect(hook.result.current.reports.map((report) => report.value)).toEqual([
      'earlyIn',
    ])
    expect(mocks.generate).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'earlyIn' }),
    )
  })
  it('loads all branch option pages instead of silently cutting off at the first page', async () => {
    mocks.branches
      .mockResolvedValueOnce({ data: { results: [{ id: 1 }], total: 2 } })
      .mockResolvedValueOnce({ data: { results: [{ id: 2 }], total: 2 } })
    const hook = renderHook(() => useAttendanceReportBranches(), {
      wrapper: wrapper(),
    })
    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true))
    expect(hook.result.current.data).toEqual([{ id: 1 }, { id: 2 }])
    expect(mocks.branches).toHaveBeenNthCalledWith(2, { page: 2, perPage: 100 })
  })
})
