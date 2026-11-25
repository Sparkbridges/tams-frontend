import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import type { TRecruitmentJobRequest } from '#/lib/types'
import RecruitmentTalentRequestDetailDrawer from './RecruitmentTalentRequestDetailDrawer'

const request = {
  id: 12,
  role: 'Software Engineer',
  status: 'approved',
  work_mode: 'onsite',
  type: 'fulltime',
  salary_range: '50,000 - 70,000',
  reason: 'New project',
  description: 'Build the platform',
  station_id: 3,
  department: { department_name: 'Engineering' },
  requested_by_id: 8,
  approved_by_id: 9,
  approved_by: { first_name: 'Jane', last_name: 'Doe' },
  created_at: '2026-11-01',
  updated_at: '2026-11-02',
  linked_posting: { id: 20, status: 'draft' },
} as TRecruitmentJobRequest

afterEach(cleanup)

describe('RecruitmentTalentRequestDetailDrawer', () => {
  it('shows the request and its linked posting', () => {
    render(
      <RecruitmentTalentRequestDetailDrawer
        opened
        onClose={vi.fn()}
        request={request}
        branches={[{ value: '3', label: 'Head office' }]}
      />,
    )

    for (const value of [
      'Software Engineer',
      'Approved',
      'Engineering',
      'Head office',
      'On-site',
      'Full-time',
      '50,000 - 70,000',
      'New project',
      'Build the platform',
      'Jane Doe',
      '#20 (Draft)',
    ]) {
      expect(screen.getByText(value)).toBeInTheDocument()
    }
  })

  it('handles missing optional fields and closes the drawer', () => {
    const onClose = vi.fn()
    render(
      <RecruitmentTalentRequestDetailDrawer
        opened
        onClose={onClose}
        request={{
          ...request,
          department: null,
          description: null,
          salary_range: null,
          approved_by: null,
          approved_by_id: null,
          linked_posting: null,
        }}
      />,
    )

    expect(screen.getAllByText('Not provided')).toHaveLength(4)
    expect(screen.getByText('Branch 3')).toBeInTheDocument()
    expect(screen.getByText('Not created')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('formats a single comma-separated salary amount', () => {
    render(
      <RecruitmentTalentRequestDetailDrawer
        opened
        onClose={vi.fn()}
        request={{ ...request, salary_range: '250,000' }}
      />,
    )
    expect(screen.getByText('₦250,000.00')).toBeInTheDocument()
  })

  it('does not show stale details when the selection is unavailable', () => {
    const { rerender } = render(
      <RecruitmentTalentRequestDetailDrawer
        opened
        onClose={vi.fn()}
        request={request}
      />,
    )
    rerender(<RecruitmentTalentRequestDetailDrawer opened onClose={vi.fn()} />)
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
    expect(screen.getByText('Request unavailable')).toBeInTheDocument()
  })
})
