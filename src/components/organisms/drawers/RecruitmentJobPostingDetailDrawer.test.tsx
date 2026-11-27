import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import RecruitmentJobPostingDetailDrawer from './RecruitmentJobPostingDetailDrawer'

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  access: vi.fn(),
  retry: vi.fn(),
}))

vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/api/services/recruitment', () => ({
  useFetchRecruitmentJobPostingById: mocks.query,
  useRecruitmentAccess: mocks.access,
}))

const posting = {
  id: 8,
  role: 'Software Engineer',
  status: 'active',
  work_mode: 'remote',
  type: 'fulltime',
  description: 'Build products',
  station_id: 3,
  department_id: null,
  job_location_country_id: 5,
  job_location_state_id: null,
  created_by_id: 9,
  job_request_id: 6,
  created_at: '2026-11-01',
  updated_at: '2026-11-02',
  accepted_formats: '["pdf","docx"]',
  max_file_size_mb: 5,
  custom_fields: [
    { question: 'Years of experience?', answer_type: 'text', required: true },
  ],
  required_documents: '[{"name":"Portfolio","required":false}]',
}

const query = (overrides = {}) => ({
  data: { data: posting },
  isLoading: false,
  isError: false,
  error: null,
  isFetching: false,
  refetch: mocks.retry,
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  mocks.access.mockReturnValue({ canViewJobPostingDetails: true })
  mocks.query.mockReturnValue(query())
})
afterEach(cleanup)

describe('job posting detail drawer', () => {
  it('fetches the selected job and displays details and application settings', () => {
    render(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    expect(mocks.query).toHaveBeenCalledWith(8)
    for (const text of [
      'Software Engineer',
      'Active',
      'Remote',
      'Full-time',
      'Build products',
      'pdf, docx',
      '5 MB',
      'Years of experience?',
      'Portfolio · Optional',
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })

  it('shows loading and a retryable error instead of stale details', () => {
    mocks.query.mockReturnValue(query({ isLoading: true, data: undefined }))
    const { rerender } = render(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    expect(
      screen.getByRole('status', { name: 'Loading job posting details' }),
    ).toBeInTheDocument()
    mocks.query.mockReturnValue(
      query({ isError: true, error: new Error('Request failed') }),
    )
    rerender(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Request failed')
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(mocks.retry).toHaveBeenCalledOnce()
  })

  it('handles missing and malformed application settings explicitly', () => {
    mocks.query.mockReturnValue(
      query({
        data: {
          data: {
            ...posting,
            accepted_formats: null,
            max_file_size_mb: null,
            custom_fields: '{invalid',
            required_documents: null,
          },
        },
      }),
    )
    render(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    expect(screen.getAllByText('Company default')).toHaveLength(2)
    expect(
      screen.getByText('Unable to read application questions.'),
    ).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
  })

  it('does not fetch when closed, invalid or unauthorized', () => {
    const { rerender } = render(
      <RecruitmentJobPostingDetailDrawer
        opened={false}
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    expect(mocks.query).toHaveBeenLastCalledWith(0)
    rerender(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={null}
      />,
    )
    expect(mocks.query).toHaveBeenLastCalledWith(0)
    expect(
      screen.getByText('Select a job posting to view its details.'),
    ).toBeInTheDocument()
    mocks.access.mockReturnValue({ canViewJobPostingDetails: false })
    rerender(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    expect(mocks.query).toHaveBeenLastCalledWith(0)
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied')
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
  })

  it('updates the query and handles a missing posting', () => {
    const { rerender } = render(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={8}
      />,
    )
    mocks.query.mockReturnValue(query({ data: { data: null } }))
    rerender(
      <RecruitmentJobPostingDetailDrawer
        opened
        onClose={vi.fn()}
        selectedId={9}
      />,
    )
    expect(mocks.query).toHaveBeenLastCalledWith(9)
    expect(screen.getByRole('alert')).toHaveTextContent('Job posting not found')
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
  })
})
