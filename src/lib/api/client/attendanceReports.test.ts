import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from '#/lib/config'
import attendanceReportsClient from './attendanceReports'

vi.mock('#/lib/config', () => ({ Client: { post: vi.fn(), get: vi.fn() } }))
const params = {
  type: 'earlyIn' as const,
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
beforeEach(() => vi.clearAllMocks())
describe('attendance reports v2 client', () => {
  it('uses suffix-v2 endpoints and keeps type in the path', async () => {
    const { type, ...body } = params
    await attendanceReportsClient.generate(params)
    expect(Client.post).toHaveBeenLastCalledWith(
      `/attendance/reports/${type}/generate-v2`,
      body,
    )
    await attendanceReportsClient.download(params)
    expect(Client.post).toHaveBeenLastCalledWith(
      `/attendance/reports/${type}/download-v2`,
      body,
    )
  })
  it('requests every group explicitly for Excel/PDF exports', async () => {
    await attendanceReportsClient.generate({ ...params, page: 'all' })
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/reports/earlyIn/generate-v2',
      expect.objectContaining({ page: 'all' }),
    )
  })
  it('rejects unexpected file paths before downloading', () => {
    expect(() => attendanceReportsClient.file('../report.csv')).toThrow(
      'Invalid report download filename',
    )
    expect(() => attendanceReportsClient.file('')).toThrow(
      'Invalid report download filename',
    )
    expect(Client.get).not.toHaveBeenCalled()
  })
})
