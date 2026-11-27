import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as Router from '@tanstack/react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import RecruitmentDashboard from './RecruitmentDashboard'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  permissions: [] as string[],
  activeBranch: 1,
}))
vi.mock('#/lib/config', () => ({ Client: { get: mocks.get } }))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode
    to: string
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/admin-dashboard/recruitment/' }),
}))
vi.mock('#/lib/store', () => ({
  useTamsStore: (selector: (state: unknown) => unknown) =>
    selector({
      user: {
        id: 8,
        employee: { company_id: 7 },
        permissions: mocks.permissions,
      },
      activeBranch: mocks.activeBranch,
    }),
}))

function show() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <RecruitmentDashboard />
    </QueryClientProvider>,
  )
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.permissions = [
    'get all job applications',
    'get all job postings',
    'get all talent requests',
  ]
  mocks.get.mockImplementation((url: string) => {
    if (url.endsWith('/job-application/dashboard'))
      return Promise.resolve({
        data: {
          total_applications: 6,
          pending_applications: 2,
          shortlisted_applications: 1,
          completed_applications: 1,
          rejected_applications: 1,
        },
      })
    if (url.endsWith('/job-postings'))
      return Promise.resolve({ data: { total: 3, results: [] } })
    if (url.endsWith('/job-requests'))
      return Promise.resolve({
        data: {
          total: 1,
          results: [
            {
              id: 4,
              role: 'Developer',
              created_at: '2026-11-25T10:00:00Z',
              department: { department_name: 'Engineering' },
            },
          ],
        },
      })
    return Promise.reject(new Error('Unexpected request'))
  })
})
afterEach(cleanup)

describe('recruitment overview', () => {
  it('shows exact totals and current stages, and requests scoped source data', async () => {
    show()
    expect(await screen.findByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('2026-11-25')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('Shortlisted')).toBeInTheDocument()
    expect(
      screen.getByText(/does not necessarily mean an interview is scheduled/),
    ).toBeInTheDocument()
    expect(mocks.get).toHaveBeenCalledWith('/hrm/recruitment/job-postings', {
      params: { page: 1, per_page: 1, status: 'active' },
    })
    expect(mocks.get).toHaveBeenCalledWith('/hrm/recruitment/job-requests', {
      params: { page: 1, per_page: 5, status: 'pending' },
    })
    expect(mocks.get).toHaveBeenCalledWith(
      '/hrm/recruitment/job-application/dashboard',
      { params: {} },
    )
    expect(
      screen.getByRole('link', { name: 'Open applicant tracking' }),
    ).toHaveAttribute('href', '/admin-dashboard/recruitment/ats')
  })
  it('shows real zero counts and empty states', async () => {
    mocks.get.mockImplementation((url: string) =>
      Promise.resolve({
        data: url.endsWith('/job-application/dashboard')
          ? {
              total_applications: 0,
              pending_applications: null,
              shortlisted_applications: null,
              completed_applications: null,
              rejected_applications: null,
            }
          : { total: 0, results: [] },
      }),
    )
    show()
    expect(
      await screen.findByText('No applications received yet.'),
    ).toBeInTheDocument()
    expect(screen.getByText('No pending talent requests.')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(7)
  })
  it('only queries and displays sections allowed by permissions', async () => {
    mocks.permissions = ['get all talent requests']
    show()
    expect(await screen.findByText('Developer')).toBeInTheDocument()
    expect(mocks.get).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Applicant pipeline')).not.toBeInTheDocument()
    expect(screen.queryByText('Active job postings')).not.toBeInTheDocument()
  })
  it('shows no access without making requests', () => {
    mocks.permissions = []
    show()
    expect(screen.getByText(/do not have permission/)).toBeInTheDocument()
    expect(mocks.get).not.toHaveBeenCalled()
  })
  it('surfaces errors and retries without hiding successful sections', async () => {
    const success = mocks.get.getMockImplementation()!
    let failed = false
    mocks.get.mockImplementation((url: string, ...args: unknown[]) => {
      if (url.endsWith('/job-requests') && !failed) {
        failed = true
        return Promise.reject(new Error('Unavailable'))
      }
      return success(url, ...args)
    })
    show()
    expect(
      await screen.findByText('Unable to load requests awaiting approval.'),
    ).toBeInTheDocument()
    expect(await screen.findByText('Active job postings')).toBeInTheDocument()
    mocks.get.mockImplementation(success)
    fireEvent.click(screen.getAllByRole('button', { name: 'Retry' })[0])
    await waitFor(() =>
      expect(screen.getByText('Developer')).toBeInTheDocument(),
    )
  })
  it('reports an incompatible analytics response instead of a misleading total', async () => {
    const success = mocks.get.getMockImplementation()!
    mocks.get.mockImplementation((url: string, ...args: unknown[]) =>
      url.endsWith('/job-application/dashboard')
        ? Promise.resolve({ data: {} })
        : success(url, ...args),
    )
    show()
    expect(
      await screen.findByText(/Update the backend recruitment analytics/),
    ).toBeInTheDocument()
    expect(screen.queryByText('NaN')).not.toBeInTheDocument()
  })
})
