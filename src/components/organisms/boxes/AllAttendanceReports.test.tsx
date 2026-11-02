import { cleanup, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import { attendanceReportTypes } from '#/lib/constants/attendanceReports'
import type { AttendanceReportParams } from '#/lib/types/api/attendanceReports'
import AllAttendanceReports from './AllAttendanceReports'

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  query: vi.fn(),
  generate: vi.fn(),
  download: vi.fn(),
  file: vi.fn(),
  refetch: vi.fn(),
  writeFile: vi.fn(),
  show: vi.fn(),
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/api/services/attendanceReports', () => ({
  useAttendanceReportAccess: mocks.access,
  useAttendanceReport: mocks.query,
  useAttendanceReportBranches: () => ({
    data: [{ id: 2, station_name: 'HQ' }],
  }),
  useAttendanceReportTeams: () => ({ data: [] }),
  useAttendanceReportGrades: () => ({ data: [] }),
}))
vi.mock('#/lib/api/services/workshift', () => ({
  useShiftDepartments: () => ({
    data: { data: [{ id: 5, department_name: 'HR' }] },
  }),
  useShiftEmployeeSearch: () => ({ data: { data: [] } }),
}))
vi.mock('#/lib/api/client/attendanceReports', () => ({
  default: {
    generate: mocks.generate,
    download: mocks.download,
    file: mocks.file,
  },
}))
vi.mock('#/lib/store', () => ({
  useTamsStore: (selector: (value: unknown) => unknown) =>
    selector({ user: { employee: { first_name: 'Ada', last_name: 'Admin' } } }),
}))
vi.mock('@mantine/notifications', () => ({
  notifications: { show: mocks.show },
}))
vi.mock('xlsx', () => ({
  utils: {
    book_new: () => ({}),
    book_append_sheet: vi.fn(),
    json_to_sheet: vi.fn(),
  },
  writeFile: mocks.writeFile,
}))
vi.mock('../printable/AttendanceReport', () => ({
  generateAttendancePdf: vi.fn(),
}))

const params: AttendanceReportParams = {
  type: 'simple',
  fetch_by: 'branch',
  fetch_by_id: 'all',
  branch_id: 'all',
  columns: ['pin', 'name'],
  date_from: '2026-11-01',
  date_to: '2026-11-30',
  group_by: 'employee',
  exclude_weekend: false,
  exclude_public_holiday: false,
  only_sunday: false,
  hourly_view: false,
  page: 1,
  per_page: 10,
}
const result = {
  data: {
    results: [
      {
        employee_details: { name: 'Ada', pin: 12 },
        days: [
          {
            checkdate: '2026-11-02',
            clockin: '09:00:00',
            clockout: null,
            hours_worked: '00:00:00',
          },
        ],
      },
    ],
    total: 25,
    warnings: ['Source calculation limitation'],
  },
}
function mount(filters?: AttendanceReportParams) {
  const onChange = vi.fn()
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AllAttendanceReports params={filters} onChange={onChange} />
    </QueryClientProvider>,
  )
  return onChange
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.access.mockReturnValue(attendanceReportTypes)
  mocks.query.mockReturnValue({
    data: result,
    isFetching: false,
    isLoading: false,
    isError: false,
    refetch: mocks.refetch,
  })
  mocks.generate.mockResolvedValue(result)
})
afterEach(cleanup)

describe('attendance report UI', () => {
  it('generates validated filters through shared date inputs and keeps default all-accessible scope', async () => {
    const change = mount()
    expect(screen.getByLabelText(/Start date/)).toBeInTheDocument()
    expect(screen.getByText('Report & Columns')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'simple',
        fetch_by: 'branch',
        fetch_by_id: 'all',
        columns: ['pin', 'name'],
        page: 1,
      }),
    )
  })
  it('shows report warnings and opens record details on row click', async () => {
    mount(params)
    expect(
      screen.getByText('Source calculation limitation'),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByText('Ada'))
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Attendance report details',
    )
    expect(screen.getByRole('dialog')).toHaveTextContent('Not available')
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })
  it('requires a branch and recipients when filtering by department', async () => {
    const change = mount()
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Workforce scope' }),
    )
    await userEvent.click(screen.getByRole('option', { name: 'Department' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(change).not.toHaveBeenCalled()
    expect(screen.getByText('Select a branch')).toBeInTheDocument()
    expect(
      screen.getByText('Select at least one recipient'),
    ).toBeInTheDocument()
  })
  it('forces aggregate reports to employee grouping', async () => {
    const change = mount()
    await userEvent.click(screen.getByRole('combobox', { name: 'Report type' }))
    await userEvent.click(
      screen.getByRole('option', { name: 'Attendance Summary' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate Report' }),
    )
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'summary', group_by: 'employee' }),
    )
  })
  it('uses server group totals and sends the selected page without changing criteria', async () => {
    const change = mount(params)
    await userEvent.click(screen.getByRole('button', { name: '2' }))
    expect(change).toHaveBeenCalledWith({ ...params, page: 2 })
  })
  it('exports all matching records to Excel rather than the preview page', async () => {
    mount(params)
    await userEvent.click(screen.getByRole('button', { name: /Export/ }))
    await userEvent.click(screen.getByText('Export all as Excel'))
    await waitFor(() =>
      expect(mocks.generate).toHaveBeenCalledWith({ ...params, page: 'all' }),
    )
    expect(mocks.writeFile).toHaveBeenCalled()
  })
  it('surfaces export failures and does not report success', async () => {
    mocks.generate.mockRejectedValue(
      new Error('Report export exceeds the allowed size'),
    )
    mount(params)
    await userEvent.click(screen.getByRole('button', { name: /Export/ }))
    await userEvent.click(screen.getByText('Export all as Excel'))
    await waitFor(() =>
      expect(mocks.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Report export failed',
          color: 'red',
        }),
      ),
    )
    expect(mocks.writeFile).not.toHaveBeenCalled()
  })
  it('blocks report access when the required report permission is missing', () => {
    mocks.access.mockReturnValue([])
    mount(params)
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
  it('does not render a stale successful table when refreshing fails', () => {
    mocks.query.mockReturnValue({
      data: result,
      isError: true,
      error: new Error('Failed'),
      refetch: mocks.refetch,
    })
    mount(params)
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
