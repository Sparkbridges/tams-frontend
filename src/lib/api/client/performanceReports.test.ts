import { beforeEach, describe, expect, it, vi } from 'vitest'
import client from './performanceReports'
import { performanceReportSchema } from '#/lib/utils/schema/performanceReports.schema'
import {
  performanceDisplayValue,
  performanceReportRows,
} from '#/lib/utils/helpers/performanceReports'
import type {
  PerformanceEmployeeReport,
  PerformanceReportParams,
} from '#/lib/types/api/performanceReports'

const post = vi.hoisted(() => vi.fn())
vi.mock('#/lib/config', () => ({ Client: { post } }))

export const params: PerformanceReportParams = {
  fetch_by: 'grade',
  fetch_by_id: [5],
  branch_id: 2,
  columns: ['first_name', 'last_name', 'pin'],
  year: 2026,
  group_by: 'employee',
  page: 2,
  perPage: 10,
}

describe('performance report contract and exports', () => {
  beforeEach(() => vi.clearAllMocks())
  it('posts the validated report contract without legacy type or per_page fields', async () => {
    await client.generate(params)
    expect(post).toHaveBeenCalledWith('/hrm/appraisals/reports', params)
    expect(
      performanceReportSchema.safeParse({ ...params, branch_id: undefined })
        .success,
    ).toBe(false)
    expect(
      performanceReportSchema.safeParse({ ...params, fetch_by_id: [] }).success,
    ).toBe(false)
    expect(
      performanceReportSchema.safeParse({
        ...params,
        group_by: 'appraisal_period',
      }).success,
    ).toBe(false)
  })
  it('exports all numeric pages regardless of the preview page', async () => {
    const first = Array.from({ length: 100 }, (_, id) => ({
      id,
      scorecards: [],
    }))
    post
      .mockResolvedValueOnce({ data: { reports: first, total: 101 } })
      .mockResolvedValueOnce({
        data: { reports: [{ id: 100, scorecards: [] }], total: 101 },
      })
    expect(await client.all(params)).toHaveLength(101)
    expect(post).toHaveBeenNthCalledWith(1, '/hrm/appraisals/reports', {
      ...params,
      page: 1,
      perPage: 100,
    })
    expect(post).toHaveBeenNthCalledWith(2, '/hrm/appraisals/reports', {
      ...params,
      page: 2,
      perPage: 100,
    })
  })
  it('rejects oversized, incomplete and duplicated exports', async () => {
    post.mockResolvedValueOnce({ data: { reports: [], total: 10001 } })
    await expect(client.all(params)).rejects.toThrow('10,000')
    post.mockResolvedValueOnce({ data: { reports: [], total: 1 } })
    await expect(client.all(params)).rejects.toThrow('complete report')
    post.mockResolvedValueOnce({
      data: { reports: [{ id: 1 }, { id: 1 }], total: 2 },
    })
    await expect(client.all(params)).rejects.toThrow('changed during export')
  })
  it('preserves zero scores, names and employees without scorecards', () => {
    const reports: PerformanceEmployeeReport[] = [
      {
        id: 9,
        first_name: 'Ada',
        last_name: 'Admin',
        scorecards: [
          {
            id: 3,
            grade_score: 0,
            approval_status: 'approved',
            created_at: '2026-01-01',
            employee: { id: 9 },
            appraisalGroup: {
              id: 1,
              name: 'Annual',
              appraisal_year: 2026,
              appraisalPeriod: null,
              performanceAreas: [],
            },
          },
        ],
      },
      { id: 10, first_name: 'Ben', last_name: 'Admin', scorecards: [] },
    ]
    const rows = performanceReportRows(reports)
    expect(rows[0]).toMatchObject({
      name: 'Ada Admin',
      grade_score: 0,
      appraisal_group: 'Annual',
    })
    expect(rows[1]).toMatchObject({
      name: 'Ben Admin',
      appraisal_group: 'No approved scorecards from ended appraisal groups',
    })
    expect(performanceDisplayValue(0)).toBe(0)
    expect(performanceDisplayValue(null)).toBe('Not available')
    expect(performanceDisplayValue({ department_name: 'HR' })).toBe('HR')
  })
})
