import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import RecruitmentApplicantDetailDrawer from './RecruitmentApplicantDetailDrawer'

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  screen: vi.fn(),
  access: vi.fn(),
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/api/services/ats', () => ({
  useApplicant: mocks.query,
  useScreenApplicant: () => ({ mutateAsync: mocks.screen, isPending: false }),
  useApplicantDocumentUrl: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))
vi.mock('#/lib/api/services/recruitment', () => ({
  useRecruitmentAccess: mocks.access,
}))
const applicant = {
  id: 2,
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone_number: '08000000000',
  status: 'completed',
  source: 'website',
  years_of_experience: 3,
  created_at: '2026-11-27',
  job_posting: { role: 'Developer', work_mode: 'remote', type: 'fulltime' },
  resume_url: 'https://example.com/cv.pdf',
  custom_answers: '[{"question":"Available?","value":true}]',
  screening_stale: true,
  screening: {
    status: 'complete',
    assessed_at: '2026-11-27T10:00:00Z',
    message: 'Keyword evidence only',
    experience: { minimum: 2, declared: 3, outcome: 'declared_meets' },
    findings: [
      {
        requirement: 'React',
        category: 'required',
        outcome: 'mentioned',
        evidence: 'Built applications with React.',
      },
    ],
  },
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.query.mockReturnValue({ data: { data: applicant } })
  mocks.access.mockReturnValue({
    canViewApplicantDetails: true,
    canUpdateApplicants: true,
    canDeleteApplicants: true,
  })
})
afterEach(cleanup)
const props = () => ({
  opened: true,
  selectedId: 2,
  onClose: vi.fn(),
  onAction: vi.fn(),
  onDelete: vi.fn(),
})

describe('applicant detail drawer', () => {
  it('shows candidate details, hired label, evidence, staleness and application answers', () => {
    render(<RecruitmentApplicantDetailDrawer {...props()} />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Hired')).toBeInTheDocument()
    expect(
      screen.getByText('Built applications with React.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Job requirements or description changed/),
    ).toBeInTheDocument()
    expect(screen.getByText('Available?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View CV' })).toHaveAttribute(
      'href',
      'https://example.com/cv.pdf',
    )
    expect(
      screen.queryByRole('button', { name: 'Mark as hired' }),
    ).not.toBeInTheDocument()
  })
  it('runs local screening and schedules actions for the selected applicant', () => {
    const current = props()
    mocks.screen.mockResolvedValue({})
    render(<RecruitmentApplicantDetailDrawer {...current} />)
    fireEvent.click(screen.getByRole('button', { name: 'Run local screening' }))
    expect(mocks.screen).toHaveBeenCalledWith({ id: 2, file: undefined })
    fireEvent.click(
      screen.getByRole('button', { name: /Schedule \/ reschedule/ }),
    )
    expect(current.onAction).toHaveBeenCalledWith('shortlisted', [2], true)
  })
  it('hides mutations for read-only users and the drawer without detail permission', () => {
    mocks.access.mockReturnValue({ canViewApplicantDetails: true })
    const { rerender } = render(
      <RecruitmentApplicantDetailDrawer {...props()} />,
    )
    expect(
      screen.queryByRole('button', { name: 'Run local screening' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Delete application' }),
    ).not.toBeInTheDocument()
    mocks.access.mockReturnValue({ canViewApplicantDetails: false })
    rerender(<RecruitmentApplicantDetailDrawer {...props()} />)
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
  })
  it('displays errors instead of stale details', () => {
    mocks.query.mockReturnValue({
      isError: true,
      error: new Error('Forbidden'),
      refetch: vi.fn(),
    })
    render(<RecruitmentApplicantDetailDrawer {...props()} />)
    expect(screen.getByText(/Forbidden/)).toBeInTheDocument()
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
  })
})
