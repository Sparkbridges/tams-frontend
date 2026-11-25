import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useRecruitmentTalentRequestTable from './useRecruitmentTalentRequestTable'

vi.mock('#/components/molecules', () => ({
  TamsTableActionPopover: () => null,
}))
vi.mock('#/lib/api', () => ({
  useFetchOrganizationBranches: () => ({ data: [] }),
  useFetchOrganizationDepartments: () => ({ data: [] }),
}))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('#/lib/api/services/recruitment', () => ({
  useRecruitmentAccess: () => ({
    canCreateTalentRequest: true,
    canApproveTalentRequest: true,
  }),
  useRecruitmentTalentRequests: (
    _params: unknown,
    select: (data: unknown) => unknown,
  ) => ({
    data: select({
      data: {
        results: [
          {
            id: 1,
            role: 'Engineer',
            status: 'pending',
            created_at: '2026-01-01',
            reason: 'Growth',
          },
          {
            id: 2,
            role: 'Designer',
            status: 'pending',
            created_at: '2026-01-01',
            reason: 'New team',
          },
        ],
        total: 2,
      },
    }),
    isLoading: false,
  }),
  useUpdateRecruitmentTalentRequestStatus: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDeleteRecruitmentTalentRequest: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}))

describe('talent request table selection', () => {
  it('opens the full request for the clicked row and switches selections', () => {
    const { result } = renderHook(() => useRecruitmentTalentRequestTable())
    expect(result.current.openedDetailDrawer).toBe(false)

    act(() => result.current.handleRowClick({ id: 1 }))
    expect(result.current.openedDetailDrawer).toBe(true)
    expect(result.current.selectedRequest?.reason).toBe('Growth')

    act(() => result.current.closeDetailDrawer())
    expect(result.current.openedDetailDrawer).toBe(false)
    act(() => result.current.handleRowClick({ id: 2 }))
    expect(result.current.selectedRequest?.reason).toBe('New team')
  })
})
