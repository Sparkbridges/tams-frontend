import { cleanup, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AllPerformanceReports from './AllPerformanceReports'
import type { PerformanceReportParams } from '#/lib/types/api/performanceReports'

const mocks = vi.hoisted(() => ({
  generate: vi.fn(),
  all: vi.fn(),
  csv: vi.fn(),
  xlsx: vi.fn(),
  pdf: vi.fn(),
  downloadPdf: vi.fn(),
  notify: vi.fn(),
  allowed: true,
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/store', () => ({
  useTamsStore: (selector: (state: unknown) => unknown) =>
    selector({
      user: {
        id: 1,
        permissions: mocks.allowed ? ['generate performance report'] : [],
        employee: { company_id: 7, first_name: 'Ada', last_name: 'Admin' },
      },
      companyDetails: { legal_name: 'Example Company' },
    }),
}))
vi.mock('#/lib/api/services/attendance', () => ({
  useAttendanceScope: () => [7, 1, 2],
}))
vi.mock('#/lib/api/services/attendanceReports', () => ({
  useAttendanceReportBranches: () => ({
    data: [{ id: 2, station_name: 'HQ' }],
  }),
  useAttendanceReportGrades: () => ({
    data: [{ id: 5, station_id: 2, grade_name: 'Senior' }],
  }),
  useAttendanceReportTeams: () => ({ data: [] }),
}))
vi.mock('#/lib/api/services/workshift', () => ({
  useShiftDepartments: () => ({
    data: { data: [{ id: 4, department_name: 'HR' }] },
  }),
  useShiftEmployeeSearch: () => ({
    data: { data: [{ id: 9, name: 'Ada Admin' }] },
  }),
}))
vi.mock('#/lib/api/client/performanceReports', () => ({
  default: { generate: mocks.generate, all: mocks.all },
}))
vi.mock('#/lib/hooks/useDownloadAs', () => ({
  default: () => ({
    exportTableCSV: mocks.csv,
    exportTableXLSX: mocks.xlsx,
    downloadPdf: mocks.downloadPdf,
  }),
}))
vi.mock('../printable/AttendanceReport', () => ({
  generateAttendancePdf: mocks.pdf,
}))
vi.mock('@mantine/notifications', () => ({
  notifications: { show: mocks.notify },
}))

const params: PerformanceReportParams = {
  fetch_by: 'branch',
  fetch_by_id: [2],
  year: 2026,
  group_by: 'employee',
  columns: ['first_name', 'last_name', 'pin'],
  page: 1,
  perPage: 10,
}
const employee = {
  id: 9,
  first_name: 'Ada',
  last_name: 'Admin',
  pin: 123,
  scorecards: [
    {
      id: 3,
      employee: { id: 9 },
      grade_score: 0,
      approval_status: 'approved',
      created_at: '2026-01-01',
      appraisalGroup: {
        id: 2,
        name: 'Annual Review',
        appraisal_year: 2026,
        appraisalPeriod: { id: 1, name: 'Quarter 1' },
        performanceAreas: [
          {
            id: 1,
            name: 'Delivery',
            weight: 50,
            kpiCategories: [
              {
                id: 2,
                name: 'Quality',
                kpiSubcategories: [{ id: 3, name: 'Accuracy', weight: 20 }],
              },
            ],
          },
        ],
      },
    },
  ],
}
function mount(report?: PerformanceReportParams) {
  const onChange = vi.fn()
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AllPerformanceReports params={report} onChange={onChange} />
    </QueryClientProvider>,
  )
  return onChange
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.allowed = true
  mocks.generate.mockResolvedValue({ data: { reports: [employee], total: 21 } })
  mocks.all.mockResolvedValue([employee])
  mocks.pdf.mockResolvedValue(new Blob(['pdf']))
})
afterEach(cleanup)

describe('Performance Reports workflow', () => {
  it('requires recipients and generates the supported contract using shared form controls', async () => {
    const changed = mount()
    expect(screen.getByText('Report & Columns')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(changed).not.toHaveBeenCalled()
    expect(
      screen.getByText('Select at least one recipient'),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('combobox', { name: 'Recipients' }))
    await userEvent.click(screen.getByRole('option', { name: 'HQ' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(changed).toHaveBeenCalledWith(
      expect.objectContaining({
        fetch_by: 'branch',
        fetch_by_id: [2],
        group_by: 'employee',
        perPage: 10,
        page: 1,
      }),
    )
  })
  it('requires a branch for grade reports and clears incompatible recipients on scope change', async () => {
    const changed = mount()
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Workforce scope' }),
    )
    await userEvent.click(screen.getByRole('option', { name: 'Grade' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(screen.getByText('Select a branch')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('combobox', { name: 'Branch' }))
    await userEvent.click(screen.getByRole('option', { name: 'HQ' }))
    await userEvent.click(screen.getByRole('combobox', { name: 'Recipients' }))
    await userEvent.click(screen.getByRole('option', { name: 'Senior' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(changed).toHaveBeenCalledWith(
      expect.objectContaining({
        fetch_by: 'grade',
        branch_id: 2,
        fetch_by_id: [5],
      }),
    )
  })
  it('shows employee totals, opens real scorecard/KPI details and paginates by employees', async () => {
    const changed = mount(params)
    await screen.findByText('Ada Admin')
    await userEvent.click(screen.getByText('Ada Admin'))
    const drawer = screen.getByRole('dialog')
    expect(drawer).toHaveTextContent('Annual Review')
    expect(drawer).toHaveTextContent('Quarter 1')
    expect(drawer).toHaveTextContent('Total performance score: 0')
    expect(drawer).toHaveTextContent('Delivery')
    expect(drawer).toHaveTextContent('Accuracy / Weight: 20')
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    await userEvent.click(screen.getByRole('button', { name: '2' }))
    expect(changed).toHaveBeenCalledWith({ ...params, page: 2 })
  })
  it('exports all records to branded performance PDF, not the attendance report', async () => {
    mount(params)
    await screen.findByText('Ada Admin')
    await userEvent.click(screen.getByRole('button', { name: 'Export' }))
    await userEvent.click(screen.getByText('Export all as PDF'))
    await waitFor(() =>
      expect(mocks.downloadPdf).toHaveBeenCalledWith(
        expect.any(Blob),
        'performance-scorecards-2026.pdf',
      ),
    )
    expect(mocks.all).toHaveBeenCalledWith(params)
    expect(mocks.pdf).toHaveBeenCalledWith(
      expect.objectContaining({
        reportCategory: 'Performance',
        title: 'Appraisal Scorecard Report',
        company: { legal_name: 'Example Company' },
        rows: [expect.objectContaining({ grade_score: 0, name: 'Ada Admin' })],
      }),
    )
  })
  it('shows request failures and retry instead of successful-looking empty results', async () => {
    mocks.generate.mockRejectedValue(new Error('No Employees found'))
    mount(params)
    expect(await screen.findByText('No Employees found')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
  it('blocks generation without performance permission', () => {
    mocks.allowed = false
    mount(params)
    expect(screen.getByText('Access denied')).toBeInTheDocument()
    expect(mocks.generate).not.toHaveBeenCalled()
  })
  it('retains employees without scorecards and displays an explicit empty detail state', async () => {
    mocks.generate.mockResolvedValue({
      data: { reports: [{ ...employee, scorecards: [] }], total: 1 },
    })
    mount(params)
    await userEvent.click(await screen.findByText('Ada Admin'))
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'No approved scorecards from ended appraisal groups',
    )
  })
  it('reports failed all-record exports without a success notification or download', async () => {
    mocks.all.mockRejectedValue(
      new Error('Unable to export the complete report'),
    )
    mount(params)
    await screen.findByText('Ada Admin')
    await userEvent.click(screen.getByRole('button', { name: 'Export' }))
    await userEvent.click(screen.getByText('Export all as PDF'))
    await waitFor(() =>
      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Report export failed',
          color: 'red',
        }),
      ),
    )
    expect(mocks.downloadPdf).not.toHaveBeenCalled()
    expect(mocks.pdf).not.toHaveBeenCalled()
  })
})
