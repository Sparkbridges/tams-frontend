import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useRecruitmentJobPostingsTable from './useRecruitmentJobPostingsTable'

const mocks = vi.hoisted(() => ({ canView: true }))
vi.mock('#/components/molecules', () => ({
  TamsTableActionPopover: () => null,
}))
vi.mock('#/lib/store', () => ({
  useTamsStore: (select: (state: unknown) => unknown) =>
    select({ setToast: vi.fn() }),
}))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('#/lib/api/services/recruitment', () => {
  const mutation = () => ({ mutateAsync: vi.fn(), isPending: false })
  const listings = () => ({ data: { data: [], total: 0 }, isLoading: false })
  return {
    useRecruitmentAccess: () => ({ canViewJobPostingDetails: mocks.canView }),
    useFetchRecruitmentJobPostings: listings,
    useFetchRecruitmentJobPostingsArchived: listings,
    useUpdateRecruitmentJobPostingStatus: mutation,
    useDeleteRecruitmentJobPosting: mutation,
    useRestoreArchivedRecruitmentJobPostings: mutation,
    useArchiveRecruitmentJobPosting: mutation,
  }
})

beforeEach(() => {
  mocks.canView = true
})

describe('job posting table selection', () => {
  it('opens the selected posting and changes selection after closing', () => {
    const { result } = renderHook(() =>
      useRecruitmentJobPostingsTable({ activeTab: 'all' }),
    )
    act(() => result.current.handleRowClick({ id: 8 }))
    expect(result.current.openedDetailDrawer).toBe(true)
    expect(result.current.selectedId).toBe(8)
    act(() => result.current.closeDetailDrawer())
    act(() => result.current.handleRowClick({ id: 9 }))
    expect(result.current.selectedId).toBe(9)
    expect(result.current.openedDetailDrawer).toBe(true)
  })

  it('does not open archived postings or allow users without detail permission', () => {
    const archived = renderHook(() =>
      useRecruitmentJobPostingsTable({ activeTab: 'archived' }),
    )
    act(() => archived.result.current.handleRowClick({ id: 8 }))
    expect(archived.result.current.openedDetailDrawer).toBe(false)
    mocks.canView = false
    const denied = renderHook(() =>
      useRecruitmentJobPostingsTable({ activeTab: 'all' }),
    )
    act(() => denied.result.current.handleRowClick({ id: 8 }))
    expect(denied.result.current.openedDetailDrawer).toBe(false)
  })
})
