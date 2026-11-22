import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import HrmDashboard from './HrmDashboard'
import AttendanceDashboard from './AttendanceDashboard'
import PerformanceDashboard from './PerformanceDashboard'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  generate: vi.fn(),
  allowed: true,
}))
vi.mock('#/lib/config', () => ({ Client: { get: mocks.get } }))
vi.mock('#/lib/api/client/performanceReports', () => ({
  default: { generate: mocks.generate },
}))
vi.mock('#/lib/api/services/attendance', () => ({
  useAttendanceScope: () => [7, 1, 'all'],
}))
vi.mock('#/lib/api/services/workshift', () => ({
  useShiftDepartments: (branch: number) => ({
    data: { data: branch === 2 ? [{ id: 4, department_name: 'HR' }] : [] },
    isLoading: false,
    isError: false,
  }),
}))
vi.mock('#/lib/api/services/attendanceReports', () => ({
  useAttendanceReportTeams: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}))
vi.mock('#/lib/store', () => ({
  useTamsStore: (selector: (state: unknown) => unknown) =>
    selector({
      user: {
        permissions: mocks.allowed ? ['generate performance report'] : [],
        managingBranches: [
          { id: 2, station_name: 'HQ' },
          { id: 3, station_name: 'North' },
        ],
      },
    }),
}))
vi.mock('@mantine/charts', () => ({
  BarChart: () => <div>Bar chart</div>,
  DonutChart: () => <div>Donut chart</div>,
}))

function show(element: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{element}</QueryClientProvider>,
  )
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  mocks.allowed = true
})

describe('module dashboards', () => {
  it('loads all HRM statistics and displays real zero counts', async () => {
    mocks.get.mockImplementation((url: string) => {
      const type = url.split('/').pop()
      const data: Record<string, unknown> = {
        entities_count: {
          employees_count: { total_employees: 0 },
          leave_requests: {},
          entry_exits: {},
          exemption_requests_count: 0,
        },
        gender_distribution: { male: 0, female: 0, others: 0 },
        employee_retention: { entry: 0, total_employees: 0 },
        employee_turnover: { exits: 0, total_employees: 0 },
        joinee_vs_resignee: [],
      }
      return Promise.resolve({ data: data[type ?? ''] })
    })

    show(<HrmDashboard />)
    expect(await screen.findByText('Employees')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(mocks.get).toHaveBeenCalledWith(
      '/hrm/dashboard/joinee_vs_resignee',
      { params: { branch_id: 'all' } },
    )
    expect(screen.getByText('No employee data available.')).toBeInTheDocument()
  })

  it('applies branch and department filters and clears the department when the branch changes', async () => {
    mocks.get.mockImplementation((url: string) => {
      const type = url.split('/').pop()
      const data: Record<string, unknown> = {
        entities_count: {
          employees_count: {},
          leave_requests: {},
          entry_exits: {},
        },
        gender_distribution: { male: 0, female: 0, others: 0 },
        employee_retention: { entry: 0, total_employees: 0 },
        employee_turnover: { exits: 0, total_employees: 0 },
        joinee_vs_resignee: [],
      }
      return Promise.resolve({ data: data[type ?? ''] })
    })
    show(<HrmDashboard />)
    fireEvent.click(screen.getByRole('combobox', { name: 'Branch' }))
    fireEvent.click(await screen.findByRole('option', { name: 'HQ' }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Department' }))
    fireEvent.click(await screen.findByRole('option', { name: 'HR' }))
    await waitFor(() =>
      expect(mocks.get).toHaveBeenCalledWith('/hrm/dashboard/entities_count', {
        params: { branch_id: '2', department_id: '4' },
      }),
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Branch' }))
    fireEvent.click(await screen.findByRole('option', { name: 'North' }))
    await waitFor(() =>
      expect(mocks.get).toHaveBeenCalledWith('/hrm/dashboard/entities_count', {
        params: { branch_id: '3' },
      }),
    )
    expect(screen.getByRole('combobox', { name: 'Department' })).toHaveValue(
      'All departments',
    )
  })

  it('refetches attendance statistics for the selected date and shows request errors', async () => {
    mocks.get.mockImplementation(
      (_url: string, options: { params: { type: string } }) => {
        if (options.params.type === 'early_rate')
          return Promise.reject(new Error('Unavailable'))
        if (options.params.type === 'entities_count')
          return Promise.resolve({
            data: { present_employees: 0, devices_activity: {} },
          })
        if (options.params.type === 'average_absenteism')
          return Promise.resolve({ data: [] })
        if (options.params.type === 'attendance_distribution')
          return Promise.resolve({ data: {} })
        return Promise.resolve({
          data: { rate: 0, number_of_active_employees: 0 },
        })
      },
    )
    show(<AttendanceDashboard />)
    expect(
      await screen.findByText('Unable to load average early rate.'),
    ).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2025-03-04' },
    })
    await waitFor(() =>
      expect(mocks.get).toHaveBeenCalledWith('/attendance/dashboard', {
        params: {
          branch_id: 'all',
          date: '2025-03-04',
          type: 'attendance_distribution',
        },
      }),
    )
  })

  it('uses all managing branches for scorecards and preserves zero scores', async () => {
    mocks.generate.mockResolvedValue({
      data: {
        total: 1,
        reports: [
          {
            id: 9,
            first_name: 'Ada',
            last_name: 'Admin',
            scorecards: [
              {
                id: 5,
                employee: { id: 9 },
                grade_score: 0,
                approval_status: 'approved',
                created_at: '2025-01-01',
                appraisalGroup: {
                  name: 'Annual',
                  appraisal_year: 2025,
                  appraisalPeriod: null,
                  performanceAreas: [],
                },
              },
            ],
          },
        ],
      },
    })
    show(<PerformanceDashboard />)
    expect(await screen.findByText('Ada Admin')).toBeInTheDocument()
    expect(mocks.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        fetch_by: 'branch',
        fetch_by_id: [2, 3],
        page: 1,
        perPage: 5,
      }),
    )
    fireEvent.click(screen.getByText('Ada Admin'))
    expect(screen.getByText(/Score: 0/)).toBeInTheDocument()
  })

  it('does not request scorecards without permission', () => {
    mocks.allowed = false
    show(<PerformanceDashboard />)
    expect(screen.getByText(/do not have permission/)).toBeInTheDocument()
    expect(mocks.generate).not.toHaveBeenCalled()
  })
})
