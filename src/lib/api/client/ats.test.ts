import { beforeEach, describe, expect, it, vi } from 'vitest'
import { atsClient } from './ats'
import { ENDPOINTS } from './endpoints'

const client = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))
vi.mock('#/lib/config', () => ({ Client: client }))
beforeEach(() => vi.clearAllMocks())

describe('ATS API contract', () => {
  it('uses the existing job-scoped list and status-update contracts', async () => {
    const params = {
      job_posting_id: 8,
      page: 1,
      per_page: 10,
      years_of_experience_min: 0,
    }
    await atsClient.list(params)
    expect(client.get).toHaveBeenCalledWith(ENDPOINTS.recruitmentApplicants, {
      params,
    })
    const data = {
      job_id: 8,
      application_ids: [2],
      status: 'completed' as const,
    }
    await atsClient.updateStatus(data)
    expect(client.put).toHaveBeenCalledWith(
      `${ENDPOINTS.recruitmentApplicants}/update-status`,
      data,
    )
  })
  it('posts raw CV and CSV files as multipart data rather than JSON strings', async () => {
    const file = new File(['CV data'], 'cv.pdf', { type: 'application/pdf' })
    await atsClient.screen({ id: 2, file })
    const [url, payload] = client.post.mock.calls[0]
    expect(url).toBe(`${ENDPOINTS.recruitmentApplicants}/2/screen`)
    expect(payload).toBeInstanceOf(FormData)
    expect(payload.get('file')).toBe(file)
    const csv = new File(['name,email'], 'applicants.csv', { type: 'text/csv' })
    const fields = [{ label: 'name', value: 'name' }]
    await atsClient.import({ file: csv, fields })
    const imported = client.post.mock.calls[1][1]
    expect(imported.get('applicantsFile')).toBe(csv)
    expect(JSON.parse(imported.get('fields'))).toEqual(fields)
  })
  it('keeps the requirements ID in the path and preserves null experience', async () => {
    const data = {
      required_skills: ['React'],
      preferred_skills: [],
      qualifications: [],
      minimum_years_experience: null,
    }
    await atsClient.saveRequirements({ id: 8, ...data })
    expect(client.put).toHaveBeenCalledWith(
      `${ENDPOINTS.recruitmentApplicants}/requirements/8`,
      data,
    )
  })
})
