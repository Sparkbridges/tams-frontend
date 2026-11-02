import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from '#/lib/config'
import workshiftClient from './workshift'

vi.mock('#/lib/config', () => ({
  Client: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))
beforeEach(() => vi.clearAllMocks())

describe('work shift API contracts', () => {
  const payload = {
    name: 'Office',
    branch_id: 4,
    is_generic: false,
    shift_days: [{ day_id: 1, shift_type_id: 2 }],
  }
  const filters = {
    fetch_by: 'employee' as const,
    fetch_by_id: [42],
    start_date: '2026-10-01',
    end_date: '2026-10-31',
  }
  it('lists with per_page and reloads detail by ID', async () => {
    const params = { page: 2, per_page: 10, search_query: 'Office' }
    await workshiftClient.list(params)
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/shift/workshift', {
      params,
    })
    await workshiftClient.detail(8)
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/shift/workshift/8')
  })
  it('sends numeric IDs and strips ID from update body', async () => {
    await workshiftClient.create(payload)
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/shift/workshift',
      payload,
    )
    await workshiftClient.update({ id: 8, ...payload })
    expect(Client.put).toHaveBeenCalledWith(
      '/attendance/shift/workshift/8',
      payload,
    )
  })
  it('uses explicit force on confirmed delete, matching the Vue workflow', async () => {
    await workshiftClient.remove(8)
    expect(Client.delete).toHaveBeenCalledWith(
      '/attendance/shift/workshift/8',
      { params: { force: true } },
    )
  })
  it('uses assignment-record IDs, not employee IDs, when unassigning', async () => {
    await workshiftClient.assign({
      regular_shift_id: 8,
      assignables: [{ type: 'department', type_id: 5 }],
    })
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/shift/workshift/assign-v2',
      {
        regular_shift_id: 8,
        assignables: [{ type: 'department', type_id: 5 }],
      },
    )
    await workshiftClient.unassign({ id: 8, assignable_id: 73 })
    expect(Client.put).toHaveBeenCalledWith(
      '/attendance/shift/workshift/unassign',
      { id: 8, assignable_id: 73 },
    )
  })
  it('preserves calendar date names and roster/export perPage pagination', async () => {
    const calendar = {
      employee_id: 42,
      date_start: '2026-10-01',
      date_end: '2026-10-31',
    }
    await workshiftClient.calendar(calendar)
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/shift/calendar', {
      params: calendar,
    })
    const params = { ...filters, page: 2, perPage: 10 }
    await workshiftClient.roster(params)
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/shift/roster', {
      params,
    })
    await workshiftClient.exportRoster(params)
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/shift/roster/download/csv',
      params,
    )
  })
  it('saves only the supported company-wide clock-window payload', async () => {
    const value = {
      clock_in: { hours_before_start: 0, hours_after_start: 30 },
      clock_out: { hours_before_start: 3, hours_after_start: 3 },
    }
    await workshiftClient.clock()
    expect(Client.get).toHaveBeenCalledWith('/attendance/settings', {
      params: { name: 'IGNORE_FUNCTION_KEY' },
    })
    await workshiftClient.saveClock(value)
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/settings',
      { name: 'IGNORE_FUNCTION_KEY', is_generic: true, value },
      { params: { name: 'IGNORE_FUNCTION_KEY' } },
    )
  })
  it('uses shift type settings endpoints without leaking UI state', async () => {
    await workshiftClient.types()
    expect(Client.get).toHaveBeenLastCalledWith(
      '/attendance/shift/settings/shift-type',
    )
    await workshiftClient.saveTypes({ shift_types: [] })
    expect(Client.post).toHaveBeenLastCalledWith(
      '/attendance/shift/settings/shift-type',
      { shift_types: [] },
    )
    await workshiftClient.removeType(7)
    expect(Client.delete).toHaveBeenLastCalledWith(
      '/attendance/shift/settings/shift-type/7',
    )
  })
  it('downloads CSV from the backend static route and rejects path-like filenames', async () => {
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:4000/api/v1')
    await workshiftClient.downloadRosterFile('roster.csv')
    expect(Client.get).toHaveBeenCalledWith(
      'http://localhost:4000/downloads/roster.csv',
      { responseType: 'blob' },
    )
    expect(() => workshiftClient.downloadRosterFile('../private.csv')).toThrow(
      'Invalid roster download filename',
    )
    vi.unstubAllEnvs()
  })
  it('propagates mutation failures', async () => {
    vi.mocked(Client.put).mockRejectedValueOnce(new Error('Assignment failed'))
    await expect(
      workshiftClient.unassign({ id: 8, assignable_id: 73 }),
    ).rejects.toThrow('Assignment failed')
  })
})
