import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useScheduleAssignmentForm from './useScheduleAssignmentForm'

const mocks = vi.hoisted(() => ({
  schedules: vi.fn(),
  save: vi.fn(),
  close: vi.fn(),
}))
vi.mock('#/lib/api/services/scheduler', () => ({
  useSchedules: mocks.schedules,
  useSaveSchedules: () => ({ mutate: mocks.save, isPending: false }),
}))
vi.mock('#/lib/api/services/workshift', () => ({
  useShiftTypes: () => ({ data: { data: [{ id: 2, name: 'Morning' }] } }),
}))
const employees = [{ employee_id: 1, pin: 42, name: 'Ada', shift_days: [] }]
function setup() {
  return renderHook(() =>
    useScheduleAssignmentForm({
      employees,
      startDate: '2026-11-02',
      onClose: mocks.close,
    }),
  )
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.schedules.mockReturnValue({
    isSuccess: true,
    isFetching: false,
    data: { data: { results: employees } },
  })
})
describe('schedule assignment preview and confirmation', () => {
  it('previews real dated assignments and saves the chosen collision policy only after review', async () => {
    const { result } = setup()
    act(() => result.current.form.setFieldValue('shift_type_id', '0'))
    act(() => result.current.handleSave())
    expect(mocks.save).not.toHaveBeenCalled()
    await act(async () => result.current.handlePreview())
    expect(result.current.preview).toHaveLength(1)
    expect(mocks.schedules).toHaveBeenLastCalledWith({
      page: 1,
      perPage: 100,
      fetch_by: 'employee',
      fetch_by_id: [1],
      start_date: '2026-11-02',
      end_date: '2026-11-02',
    })
    act(() => result.current.handleSave())
    expect(mocks.save).toHaveBeenCalledWith(
      {
        on_conflict: 'skip',
        schedules: [
          { employee_id: 1, shift_type_id: 0, shift_date_start: '2026-11-02' },
        ],
      },
      { onSuccess: mocks.close },
    )
  })
  it('invalidates preview when any form value changes', async () => {
    const { result } = setup()
    act(() => result.current.form.setFieldValue('shift_type_id', '2'))
    await act(async () => result.current.handlePreview())
    expect(result.current.previewValues).not.toBeNull()
    act(() => result.current.form.setFieldValue('on_conflict', 'replace'))
    expect(result.current.previewValues).toBeNull()
    act(() => result.current.handleSave())
    expect(mocks.save).not.toHaveBeenCalled()
  })
  it('refuses to confirm failed, pending, or incomplete employee previews', async () => {
    for (const query of [
      { isSuccess: false, isFetching: false },
      { isSuccess: true, isFetching: true },
      { isSuccess: true, isFetching: false, data: { data: { results: [] } } },
    ]) {
      mocks.schedules.mockReturnValue(query)
      const { result, unmount } = setup()
      act(() => result.current.form.setFieldValue('shift_type_id', '2'))
      await act(async () => result.current.handlePreview())
      act(() => result.current.handleSave())
      expect(mocks.save).not.toHaveBeenCalled()
      unmount()
    }
  })
  it('rejects weekday repeats with no matching dates before querying or saving', async () => {
    const { result } = setup()
    act(() =>
      result.current.form.setValues({
        shift_type_id: '2',
        repeat: 'weekly',
        weekdays: ['0'],
      }),
    )
    await act(async () => result.current.handlePreview())
    expect(result.current.previewValues).toBeNull()
    expect(result.current.form.errors.end_date).toMatch(/matching dates/)
    expect(mocks.save).not.toHaveBeenCalled()
  })
})
