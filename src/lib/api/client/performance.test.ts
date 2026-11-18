import { beforeEach, describe, expect, it, vi } from 'vitest'
import { performanceClient } from './performance'
import { ENDPOINTS } from './endpoints'

const client = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))
vi.mock('#/lib/config', () => ({ Client: client }))

describe('appraisal people settings API contract', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the appraiser bulk-delete contract and the shared approver delete route', async () => {
    await performanceClient.deleteAppraisalPeopleSetting('appraiser', 12)
    expect(client.post).toHaveBeenCalledWith(
      `${ENDPOINTS.performanceAppraisalAppraisers}/delete`,
      { appraiserIds: [12] },
    )
    await performanceClient.deleteAppraisalPeopleSetting('approver', 15)
    expect(client.delete).toHaveBeenCalledWith(
      '/hrm/appraisals/settings/approver-settings/15',
    )
  })

  describe('project task status API contract', () => {
    it('updates the task status using the authenticated project endpoint', async () => {
      const payload = { project_id: 17, task_id: 42, status_id: 3 }
      await performanceClient.moveProjectKanbanTask(payload)
      expect(client.put).toHaveBeenCalledWith(
        '/hrm/projects/tasks/update-task-status',
        payload,
      )
    })
  })

  it('uses per_page for the shared approver listing', async () => {
    await performanceClient.getPerformanceApproverSettings({
      page: 2,
      perPage: 10,
      search_query: 'Annual',
    })
    expect(client.get).toHaveBeenCalledWith(
      '/hrm/appraisals/settings/approver-settings',
      { params: { page: 2, per_page: 10, search_query: 'Annual' } },
    )
  })

  it('posts new appraisers and puts edited approvers without leaking form metadata', async () => {
    const appraiser = {
      description: 'Sales Review',
      approval_types: 'Sequential' as const,
      no_approvals: 1,
      category_type: 'employees' as const,
      employees: [8],
      appraiser_details: [{ appraiser_person_id: 7 }],
    }
    await performanceClient.saveAppraisalPeopleSetting({
      kind: 'appraiser',
      data: appraiser,
    })
    expect(client.post).toHaveBeenCalledWith(
      ENDPOINTS.performanceAppraisalAppraisers,
      appraiser,
    )
    const approver = {
      name: 'HR Approval',
      description: 'Review final results',
      approval_type: 'concurrent' as const,
      approver_persons: [
        {
          approver_person_id: 4,
          approver_person_type: 'dynamic' as const,
          alt_approver_person_id: 10,
          alt_approver_person_type: 'static' as const,
        },
      ],
    }
    await performanceClient.saveAppraisalPeopleSetting({
      kind: 'approver',
      id: 15,
      data: approver,
    })
    expect(client.put).toHaveBeenCalledWith(
      '/hrm/appraisals/settings/approver-settings/15',
      approver,
    )
  })

  it('normalizes appraiser detail aliases for the drawer and edit form', async () => {
    client.get.mockResolvedValueOnce({
      data: {
        id: 12,
        description: 'Annual',
        category_type: 'station_grade',
        station_id: 3,
        created_at: '2026-01-01',
        updated_at: '2026-01-02',
        employeeGrades: [{ employee_grade_id: 8, grade_name: 'Senior' }],
        approvalLevels: [
          {
            level: 2,
            approval_person_id: 11,
            approval_person_name: 'Second Reviewer',
            alt_approval_person_id: 0,
          },
          {
            level: 1,
            approval_person_id: 9,
            approval_person_name: 'Jane Doe',
            alt_approval_person_id: 10,
            alt_approval_person: 'John Doe',
          },
        ],
      },
    })
    const detail = await performanceClient.getAppraisalPeopleSetting(
      'appraiser',
      12,
    )
    expect(detail.assignments).toEqual([{ value: '8', label: 'Senior' }])
    expect(detail.persons.map((person) => person.level)).toEqual([1, 2])
    expect(detail.persons[0]).toMatchObject({
      level: 1,
      personId: 9,
      alternateId: 10,
      name: 'Jane Doe',
      alternateName: 'John Doe',
    })
  })

  it('preserves sequential/concurrent and dynamic/static approver settings in details', async () => {
    client.get.mockResolvedValueOnce({
      data: {
        id: 15,
        name: 'HR Approval',
        description: null,
        station_id: 3,
        approval_type: 'concurrent',
        created_at: '2026-01-01',
        updated_at: '2026-01-02',
        approver_persons: [
          {
            level: 2,
            approver_person_id: 11,
            approver_person_type: 'static',
            approver_person_name: 'Second Reviewer',
          },
          {
            level: 1,
            approver_person_id: 4,
            approver_person_type: 'dynamic',
            approver_person_name: "Employee's HR Manager",
            alt_approver_person_id: 9,
            alt_approver_person_type: 'static',
            alt_approver_person_name: 'Jane Doe',
          },
        ],
      },
    })
    const detail = await performanceClient.getAppraisalPeopleSetting(
      'approver',
      15,
    )
    expect(detail.approvalType).toBe('concurrent')
    expect(detail.persons.map((person) => person.level)).toEqual([1, 2])
    expect(detail.persons[0]).toMatchObject({
      personId: 4,
      personType: 'dynamic',
      alternateId: 9,
      alternateType: 'static',
      name: "Employee's HR Manager",
      alternateName: 'Jane Doe',
    })
  })

  it('propagates in-use deletion failures instead of returning success', async () => {
    client.post.mockRejectedValueOnce(
      new Error('Cannot delete settings used by Annual Review'),
    )
    await expect(
      performanceClient.deleteAppraisalPeopleSetting('appraiser', 12),
    ).rejects.toThrow('Annual Review')
  })
})
