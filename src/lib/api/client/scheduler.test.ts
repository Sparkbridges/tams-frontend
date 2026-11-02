import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from '#/lib/config'
import schedulerClient from './scheduler'

vi.mock('#/lib/config', () => ({
  Client: { get: vi.fn(), post: vi.fn() },
}))
beforeEach(() => vi.clearAllMocks())

describe('scheduler v2 API contract', () => {
  it('uses the suffix-v2 endpoint for reads', async () => {
    const params = {
      page: 1,
      perPage: 10,
      fetch_by: 'company' as const,
      start_date: '2026-11-02',
      end_date: '2026-11-03',
    }
    await schedulerClient.list(params)
    expect(Client.get).toHaveBeenCalledWith('/attendance/shift/schedules-v2', {
      params,
    })
  })
  it('sends the conflict policy only to the suffix-v2 write endpoint', async () => {
    const payload = {
      schedules: [
        {
          employee_id: 24477,
          shift_type_id: 104,
          shift_date_start: '2026-11-02',
        },
      ],
      on_conflict: 'skip' as const,
    }
    await schedulerClient.save(payload)
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/shift/schedules-v2',
      payload,
    )
  })
})
