import { act, cleanup, renderHook } from '@testing-library/react'
import { isValidElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AppraisalSettingsTab } from '#/lib/constants'
import type { TamsActionPopoverOption } from '#/lib/types'
import usePerformanceAppraisalGGSettings from './usePerformanceAppraisalGGSettings'

vi.mock('#/router', () => ({ getRouter: vi.fn() }))
const mocks = vi.hoisted(() => ({
  remove: vi.fn(),
  reset: vi.fn(),
  appraisers: {
    total: 14,
    results: [
      {
        id: 12,
        description: 'Annual Appraisers',
        assigned_by: 'employees',
        appraisers_count: 2,
      },
    ],
  },
  approvers: {
    total: 11,
    results: [
      {
        id: 15,
        description: 'Annual Approvers',
        assigned_by: 'sequential',
        appraisers_count: 1,
      },
    ],
  },
  general: undefined as
    | {
        appraisalPeriods: {
          id: number
          name: string
          start_month: number
          end_month: number
        }[]
      }
    | undefined,
  grades: [],
}))
vi.mock('#/lib/api', () => ({
  useFetchPerformanceAppraisalGeneralSettingsResponse: () => ({
    data: mocks.general,
    isLoading: !mocks.general,
  }),
  useFetchPerformanceAppraisalGradingSettings: () => ({
    data: mocks.grades,
    isLoading: false,
  }),
  useFetchPerformanceAppraiserSettings: () => ({
    data: mocks.appraisers,
    isLoading: false,
  }),
  useFetchPerformanceApproverSettings: () => ({
    data: mocks.approvers,
    isLoading: false,
  }),
  useUpdatePerformanceAppraisalGeneralSettings: () => ({ isPending: false }),
  useUpdatePerformanceAppraisalGradingSettings: () => ({ isPending: false }),
  useDeleteAppraisalPeopleSetting: () => ({
    mutateAsync: mocks.remove,
    reset: mocks.reset,
    isPending: false,
    error: null,
  }),
}))

describe('appraisal settings table actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.remove.mockResolvedValue({})
    mocks.general = undefined
  })
  afterEach(cleanup)

  it.each(['appraiser', 'approver'] as const)(
    'opens %s details and confirms deletion',
    async (kind) => {
      const { result } = renderHook(() =>
        usePerformanceAppraisalGGSettings({ activeTab: kind }),
      )
      const row = result.current.tableData[0]
      expect(result.current.hasChanges).toBe(false)
      expect(result.current.total).toBe(kind === 'appraiser' ? 14 : 11)
      act(() => result.current.handleRowClick(row))
      expect(result.current.selection).toMatchObject({
        kind,
        id: row.id,
        action: 'detail',
      })
      act(() => result.current.editSelection())
      expect(result.current.selection?.action).toBe('edit')

      const cell = result.current.columns.at(-1)?.render?.(row)
      if (!isValidElement<{ data: TamsActionPopoverOption[] }>(cell)) {
        throw new Error('Missing settings actions')
      }
      act(() =>
        cell.props.data.find((item) => item.label === 'Delete')?.action(),
      )
      expect(mocks.remove).not.toHaveBeenCalled()
      expect(result.current.selection?.action).toBe('delete')
      await act(() => result.current.handleDeleteSetting())
      expect(mocks.remove).toHaveBeenCalledWith({ kind, id: row.id })
      expect(result.current.selection).toBeNull()
    },
  )

  it('keeps deletion confirmation open when the API rejects an in-use setting', async () => {
    mocks.remove.mockRejectedValueOnce(new Error('Used by Annual Review'))
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    const { result } = renderHook(() =>
      usePerformanceAppraisalGGSettings({ activeTab: 'appraiser' }),
    )
    const cell = result.current.columns
      .at(-1)
      ?.render?.(result.current.tableData[0])
    if (!isValidElement<{ data: TamsActionPopoverOption[] }>(cell)) {
      throw new Error('Missing settings actions')
    }
    act(() => cell.props.data.find((item) => item.label === 'Delete')?.action())
    await act(() => result.current.handleDeleteSetting())
    expect(result.current.selection?.action).toBe('delete')
  })

  it('resets selection and paging when changing between appraiser and approver tabs', () => {
    const { result, rerender } = renderHook(
      ({ activeTab }: { activeTab: AppraisalSettingsTab }) =>
        usePerformanceAppraisalGGSettings({ activeTab }),
      { initialProps: { activeTab: 'appraiser' } },
    )
    act(() => {
      result.current.handleRowClick(result.current.tableData[0])
      result.current.setPage(2)
    })
    rerender({ activeTab: 'approver' })
    expect(result.current.selection).toBeNull()
    expect(result.current.page).toBe(1)
    expect(result.current.tableData).toEqual(mocks.approvers.results)
    expect(result.current.hasChanges).toBe(false)
  })

  it('does not open the unsaved-changes widget during initial general-settings loading', () => {
    const { result, rerender } = renderHook(() =>
      usePerformanceAppraisalGGSettings({ activeTab: 'general' }),
    )
    expect(result.current.hasChanges).toBe(false)
    mocks.general = {
      appraisalPeriods: [
        { id: 1, name: 'Quarter 1', start_month: 1, end_month: 3 },
      ],
    }
    rerender()
    expect(result.current.hasChanges).toBe(false)
    act(() => result.current.handleAddAppraisalPeriod())
    expect(result.current.hasChanges).toBe(true)
    const previousApprovers = mocks.approvers
    mocks.approvers = {
      ...previousApprovers,
      total: previousApprovers.total + 1,
    }
    rerender()
    expect(result.current.tableData).toHaveLength(2)
    expect(result.current.hasChanges).toBe(true)
    mocks.approvers = previousApprovers
    act(() => result.current.handleCancel())
    expect(result.current.hasChanges).toBe(false)
  })
})
