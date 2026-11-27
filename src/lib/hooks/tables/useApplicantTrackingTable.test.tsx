import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useApplicantTrackingTable from './useApplicantTrackingTable'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  update: vi.fn(),
  deletion: vi.fn(),
  navigate: vi.fn(),
  search: {
    page: 2,
    tab: 'pending',
    minimum: 0,
    maximum: 3,
    search: 'Jane',
    source: 'upload',
  },
}))
vi.mock('@tanstack/react-router', () => ({
  getRouteApi: () => ({
    useSearch: () => mocks.search,
    useNavigate: () => mocks.navigate,
  }),
}))
vi.mock('#/lib/api/services/ats', () => ({
  useApplicants: mocks.list,
  useUpdateApplicants: () => ({ mutateAsync: mocks.update, reset: vi.fn() }),
  useDeleteApplicant: () => ({ mutateAsync: mocks.deletion, reset: vi.fn() }),
}))
vi.mock('#/lib/api/services/recruitment', () => ({
  useRecruitmentAccess: () => ({
    canUpdateApplicants: true,
    canViewApplicantDetails: true,
    canDeleteApplicants: true,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.list.mockReturnValue({ data: { data: { results: [], total: 0 } } })
})
describe('applicant tracking actions', () => {
  it('passes job, status, source, search and zero experience to the API', () => {
    renderHook(() => useApplicantTrackingTable(8))
    expect(mocks.list).toHaveBeenCalledWith({
      job_posting_id: 8,
      page: 2,
      per_page: 10,
      status: ['pending'],
      search_query: 'Jane',
      source: 'upload',
      years_of_experience_min: 0,
      years_of_experience_max: 3,
    })
  })
  it('preserves filters and resets pagination when a filter changes', () => {
    const { result } = renderHook(() => useApplicantTrackingTable(8))
    act(() => result.current.changeSearch({ source: undefined }))
    const updater = mocks.navigate.mock.calls[0][0].search
    expect(updater(mocks.search)).toEqual({
      ...mocks.search,
      page: 1,
      source: undefined,
    })
  })
  it('requires interview details then sends the selected job and applicant IDs', async () => {
    const { result } = renderHook(() => useApplicantTrackingTable(8))
    act(() => result.current.beginAction('shortlisted', [2, 4], true))
    await act(() => result.current.confirmAction())
    expect(mocks.update).not.toHaveBeenCalled()
    expect(result.current.validation).toMatch(/date and time/)
    act(() => {
      result.current.setInterviewDate('2026-12-01')
      result.current.setInterviewTime('10:30')
    })
    await act(() => result.current.confirmAction())
    expect(mocks.update).toHaveBeenCalledWith({
      job_id: 8,
      application_ids: [2, 4],
      status: 'shortlisted',
      interview_date: '2026-12-01',
      interview_time: '10:30',
    })
    expect(result.current.action).toBeNull()
  })
  it('retains the confirmation when an update fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.update.mockRejectedValueOnce(new Error('Unavailable applicant'))
    const { result } = renderHook(() => useApplicantTrackingTable(8))
    act(() => result.current.beginAction('completed', [2]))
    await act(() => result.current.confirmAction())
    expect(result.current.action).toEqual({ status: 'completed', ids: [2] })
    error.mockRestore()
  })
  it('can shortlist without scheduling an interview', async () => {
    const { result } = renderHook(() => useApplicantTrackingTable(8))
    act(() => result.current.beginAction('shortlisted', [2]))
    await act(() => result.current.confirmAction())
    expect(mocks.update).toHaveBeenCalledWith({
      job_id: 8,
      application_ids: [2],
      status: 'shortlisted',
    })
  })
})
