import type { ReactNode } from 'react'
import dayjs from 'dayjs'
import type * as TanstackRouter from '@tanstack/react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '../../../../test-utils/render'
import AttendanceWorkshifts from './AttendanceWorkshifts'
import AttendanceWorkshiftForm from './AttendanceWorkshiftForm'
import AttendanceWorkshiftDetailDrawer from '../drawers/AttendanceWorkshiftDetailDrawer'
import AttendanceWorkshiftAssignments from './AttendanceWorkshiftAssignments'
import AttendanceShiftTypes from './AttendanceShiftTypes'
import AttendanceShiftClock from './AttendanceShiftClock'
import AttendanceShiftRoster from './AttendanceShiftRoster'
import AttendanceShiftCalendar from './AttendanceShiftCalendar'

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  list: vi.fn(),
  detail: vi.fn(),
  types: vi.fn(),
  branches: vi.fn(),
  departments: vi.fn(),
  employees: vi.fn(),
  clock: vi.fn(),
  calendar: vi.fn(),
  roster: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  assign: vi.fn(),
  unassign: vi.fn(),
  saveTypes: vi.fn(),
  removeType: vi.fn(),
  saveClock: vi.fn(),
  navigate: vi.fn(),
  refetch: vi.fn(),
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/api/services/workshift', () => ({
  useWorkshiftAccess: mocks.access,
  useWorkshifts: mocks.list,
  useWorkshift: mocks.detail,
  useShiftTypes: mocks.types,
  useShiftBranches: mocks.branches,
  useShiftDepartments: mocks.departments,
  useShiftEmployeeSearch: mocks.employees,
  useShiftClock: mocks.clock,
  useShiftCalendar: mocks.calendar,
  useShiftRoster: mocks.roster,
  useCreateWorkshift: () => ({ mutate: mocks.create, isPending: false }),
  useUpdateWorkshift: () => ({ mutate: mocks.update, isPending: false }),
  useDeleteWorkshift: () => ({ mutate: mocks.remove, isPending: false }),
  useAssignWorkshift: () => ({ mutate: mocks.assign, isPending: false }),
  useUnassignWorkshift: () => ({ mutate: mocks.unassign, isPending: false }),
  useSaveShiftTypes: () => ({ mutate: mocks.saveTypes, isPending: false }),
  useDeleteShiftType: () => ({ mutate: mocks.removeType, isPending: false }),
  useSaveShiftClock: () => ({ mutate: mocks.saveClock, isPending: false }),
}))
vi.mock('#/lib/store', () => {
  const state = {
    user: {
      id: 1,
      name: 'Admin',
      employee: { id: 42, company_id: 7, company: { company_name: 'Example' } },
    },
  }
  return {
    useTamsStore: (selector: (value: typeof state) => unknown) =>
      selector(state),
  }
})
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof TanstackRouter>()),
  useNavigate: () => mocks.navigate,
  Link: ({
    children,
    to,
    params,
  }: {
    children: ReactNode
    to: string
    params?: { id: string }
  }) => <a href={to.replace('$id', params?.id ?? '')}>{children}</a>,
}))
vi.mock('./AttendanceWorkshiftsLayout', () => ({
  default: ({
    children,
    title,
    actions,
  }: {
    children: ReactNode
    title: string
    actions?: ReactNode
  }) => (
    <div>
      <h1>{title}</h1>
      {actions}
      {children}
    </div>
  ),
}))
vi.mock('./AttendanceDevicesLayout', () => ({
  AttendanceAccessDenied: () => <p>Access denied</p>,
  AttendanceQueryError: ({ retry }: { retry: () => void }) => (
    <button onClick={retry}>Retry</button>
  ),
}))

const types = [
  {
    id: 2,
    name: 'Morning',
    day_span: 1,
    shift_start: '09:00:00',
    shift_end: '17:00:00',
    color_code: '#066aff',
  },
]
const shift = {
  id: 8,
  name: 'Office',
  is_generic: false,
  station_id: 4,
  has_assignables: 1,
  regular_shift_days: Array.from({ length: 5 }, (_, index) => ({
    day_id: index + 1,
    shift_type_id: 2,
    shift_type_name: 'Morning',
  })),
  assignables: [{ id: 73, type: 'department', type_id: 5, type_name: 'HR' }],
}
const query = (data: unknown) => ({
  data,
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: mocks.refetch,
})
beforeEach(() => {
  vi.clearAllMocks()
  mocks.access.mockReturnValue({
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canAssign: true,
    canViewTypes: true,
    canSaveTypes: true,
    canDeleteTypes: true,
    canViewClock: true,
    canSaveClock: true,
    isHqAdmin: true,
  })
  mocks.list.mockReturnValue(query({ data: { results: [shift], total: 1 } }))
  mocks.detail.mockReturnValue(query({ data: shift }))
  mocks.types.mockReturnValue(query({ data: types }))
  mocks.branches.mockReturnValue(
    query({
      data: { results: [{ id: 4, station_name: 'Head Office' }], total: 1 },
    }),
  )
  mocks.departments.mockReturnValue(
    query({ data: [{ id: 5, department_name: 'HR' }] }),
  )
  mocks.employees.mockReturnValue(
    query({
      data: [
        { id: 42, name: 'Ada' },
        { id: 43, name: 'Ben' },
      ],
    }),
  )
  mocks.clock.mockReturnValue(
    query({
      data: {
        default: true,
        value: {
          clock_in: { hours_before_start: 3, hours_after_start: 3 },
          clock_out: { hours_before_start: 3, hours_after_start: 3 },
        },
      },
    }),
  )
  mocks.calendar.mockReturnValue(query({ data: [] }))
  mocks.roster.mockReturnValue(
    query({ data: { results: [], total: 0, rosterDates: [] } }),
  )
})
afterEach(cleanup)

async function select(label: string | RegExp, option: string) {
  await userEvent.click(screen.getByRole('combobox', { name: label }))
  await userEvent.click(screen.getByRole('option', { name: option }))
}

describe('weekly shift screens', () => {
  it('loads edit by ID, preserves scope and saves numeric shift IDs', async () => {
    render(<AttendanceWorkshiftForm id={8} />)
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText('Work shift navigation'),
    ).not.toBeInTheDocument()
    expect(mocks.detail).toHaveBeenCalledWith(8)
    expect(screen.getByDisplayValue('Office')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /Branch/ })).toBeDisabled()
    expect(
      screen.getByRole('switch', { name: 'Exclude weekends' }),
    ).toBeChecked()
    expect(
      screen.queryByRole('combobox', { name: /Saturday/ }),
    ).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Work shift name/), {
      target: { value: 'Office revised' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(mocks.update).toHaveBeenCalledWith(
      {
        id: 8,
        name: 'Office revised',
        branch_id: 4,
        is_generic: false,
        shift_days: shift.regular_shift_days.map(
          ({ day_id, shift_type_id }) => ({ day_id, shift_type_id }),
        ),
      },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
  })
  it('does not overwrite a draft when edit data refetches', async () => {
    const view = render(<AttendanceWorkshiftForm id={8} />)
    fireEvent.change(screen.getByLabelText(/Work shift name/), {
      target: { value: 'Draft' },
    })
    mocks.detail.mockReturnValue(
      query({ data: { ...shift, name: 'Refetched' } }),
    )
    view.rerender(<AttendanceWorkshiftForm id={8} />)
    expect(screen.getByDisplayValue('Draft')).toBeInTheDocument()
  })
  it('only shows the action widget for dirty edits and cancel restores the saved values', async () => {
    render(<AttendanceWorkshiftForm id={8} />)
    expect(
      screen.queryByText('Unsaved changes to Workshift'),
    ).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Work shift name/), {
      target: { value: 'Draft' },
    })
    expect(
      await screen.findByText('Unsaved changes to Workshift'),
    ).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('switch', { name: 'Exclude weekends' }),
    )
    expect(
      screen.getByRole('combobox', { name: /Saturday/ }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByLabelText(/Work shift name/)).toHaveValue('Office')
    expect(
      screen.queryByRole('combobox', { name: /Saturday/ }),
    ).not.toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.queryByText('Unsaved changes to Workshift'),
      ).not.toBeInTheDocument(),
    )
    expect(mocks.update).not.toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
  it('resets unsaved create values without navigating or saving', async () => {
    render(<AttendanceWorkshiftForm />)
    fireEvent.change(screen.getByLabelText(/Work shift name/), {
      target: { value: 'Draft' },
    })
    expect(await screen.findByText('Unsaved new Workshift')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByLabelText(/Work shift name/)).toHaveValue('')
    expect(mocks.create).not.toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
  it('starts new shifts blank and creates an all-branch weekday shift', async () => {
    render(<AttendanceWorkshiftForm />)
    expect(screen.getByLabelText(/Work shift name/)).toHaveValue('')
    await userEvent.type(
      screen.getByLabelText(/Work shift name/),
      'Generic shift',
    )
    await select(/Branch/, 'All branches')
    await userEvent.click(
      screen.getByRole('switch', { name: 'Exclude weekends' }),
    )
    for (const label of [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ])
      await select(label, 'Morning')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(mocks.create).toHaveBeenCalledWith(
      {
        name: 'Generic shift',
        branch_id: 'all',
        is_generic: true,
        shift_days: shift.regular_shift_days.map(
          ({ day_id, shift_type_id }) => ({ day_id, shift_type_id }),
        ),
      },
      expect.any(Object),
    )
  })
  it('adds both weekend fields back without losing weekday selections', async () => {
    render(<AttendanceWorkshiftForm id={8} />)
    await userEvent.click(
      screen.getByRole('switch', { name: 'Exclude weekends' }),
    )
    expect(screen.getByRole('combobox', { name: /Saturday/ })).toHaveValue('')
    expect(screen.getByRole('combobox', { name: /Monday/ })).toHaveValue(
      'Morning',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(mocks.update).not.toHaveBeenCalled()
  })
  it('requires confirmation and warns about existing assignments before deleting', async () => {
    render(<AttendanceWorkshifts />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    await userEvent.click(
      within(screen.getByRole('row', { name: /Office/ })).getByRole('button'),
    )
    await userEvent.click(screen.getByText('Delete'))
    expect(
      screen.getByText(/Affected employees may no longer have/),
    ).toBeInTheDocument()
    expect(mocks.remove).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mocks.remove).toHaveBeenCalledWith(8, expect.any(Object))
  })
  it.each([
    ['Edit', '/admin-dashboard/attendance/workshift/edit/$id'],
    ['Assign', '/admin-dashboard/attendance/workshift/assign-employee/$id'],
  ])('navigates through the %s popover action', async (label, to) => {
    render(<AttendanceWorkshifts />)
    await userEvent.click(
      within(screen.getByRole('row', { name: /Office/ })).getByRole('button'),
    )
    await userEvent.click(screen.getByText(label))
    expect(mocks.navigate).toHaveBeenCalledWith({ to, params: { id: '8' } })
    expect(
      screen.queryByRole('dialog', { name: 'Workshift details' }),
    ).not.toBeInTheDocument()
  })
  it('opens details by row click even with no mutation permissions', async () => {
    mocks.access.mockReturnValue({ canView: true })
    render(<AttendanceWorkshifts />)
    expect(mocks.detail).not.toHaveBeenCalled()
    await userEvent.click(screen.getByText('Office'))
    expect(
      await screen.findByRole('dialog', { name: 'Workshift details' }),
    ).toBeInTheDocument()
    expect(mocks.detail).toHaveBeenCalledWith(8)
    expect(screen.getByText('HR')).toBeInTheDocument()
    expect(mocks.navigate).not.toHaveBeenCalled()
    for (const label of ['View', 'Edit', 'Assign', 'Delete']) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })
  it('hides generic shift deletion for non-HQ admins', async () => {
    mocks.access.mockReturnValue({
      canView: true,
      canDelete: true,
      isHqAdmin: false,
    })
    mocks.list.mockReturnValue(
      query({ data: { results: [{ ...shift, is_generic: true }], total: 1 } }),
    )
    render(<AttendanceWorkshifts />)
    expect(
      within(screen.getByRole('row', { name: /Office/ })).queryByRole('button'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
  it('shows errors with retry and respects view permission', async () => {
    mocks.list.mockReturnValue({
      ...query(undefined),
      isError: true,
      error: new Error('Offline'),
    })
    const view = render(<AttendanceWorkshifts />)
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(mocks.refetch).toHaveBeenCalled()
    mocks.access.mockReturnValue({ canView: false })
    view.rerender(<AttendanceWorkshifts />)
    expect(screen.getByText('Access denied')).toBeInTheDocument()
  })
})

describe('shift assignments', () => {
  it('refreshes drawer details and closes without navigating', async () => {
    const onClose = vi.fn()
    render(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened
        onClose={onClose}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(mocks.refetch).toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
  it('loads the selected row ID when another workshift is selected', async () => {
    mocks.list.mockReturnValue(
      query({
        data: {
          results: [shift, { ...shift, id: 9, name: 'Warehouse' }],
          total: 2,
        },
      }),
    )
    render(<AttendanceWorkshifts />)
    await userEvent.click(screen.getByText('Office'))
    expect(mocks.detail).toHaveBeenLastCalledWith(8)
    await userEvent.keyboard('{Escape}')
    mocks.detail.mockReturnValue(
      query({ data: { ...shift, id: 9, name: 'Warehouse' } }),
    )
    await userEvent.click(screen.getByText('Warehouse'))
    expect(mocks.detail).toHaveBeenLastCalledWith(9)
    expect(
      screen.getByRole('heading', { name: 'Warehouse' }),
    ).toBeInTheDocument()
  })
  it('shows loading and query errors rather than stale drawer details', async () => {
    mocks.detail.mockReturnValue({ ...query(undefined), isLoading: true })
    const view = render(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened
        onClose={vi.fn()}
      />,
    )
    expect(
      screen.getByRole('status', { name: 'Loading workshift details' }),
    ).toBeInTheDocument()
    mocks.detail.mockReturnValue({
      ...query({ data: shift }),
      isError: true,
      error: new Error('Offline'),
    })
    view.rerender(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened
        onClose={vi.fn()}
      />,
    )
    expect(screen.queryByText('HR')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(mocks.refetch).toHaveBeenCalled()
  })
  it('gates drawer requests by open state and view permission', () => {
    const view = render(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened={false}
        onClose={vi.fn()}
      />,
    )
    expect(mocks.detail).toHaveBeenLastCalledWith(0)
    mocks.access.mockReturnValue({ canView: false })
    view.rerender(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened
        onClose={vi.fn()}
      />,
    )
    expect(mocks.detail).toHaveBeenLastCalledWith(0)
    expect(screen.getByText('Access denied')).toBeInTheDocument()
  })
  it('distinguishes off days and empty assignments', () => {
    mocks.detail.mockReturnValue(
      query({
        data: {
          ...shift,
          assignables: [],
          regular_shift_days: [{ day_id: 1, shift_type_id: 0 }],
        },
      }),
    )
    render(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('Off day')).toBeInTheDocument()
    expect(
      screen.getByText('No recipients are assigned to this workshift.'),
    ).toBeInTheDocument()
  })
  it('unassigns by assignment record ID only after confirmation', async () => {
    render(
      <AttendanceWorkshiftDetailDrawer
        selectedId={8}
        opened
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('HR')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Unassign' }))
    expect(mocks.unassign).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mocks.unassign).toHaveBeenCalledWith(
      { id: 8, assignable_id: 73 },
      expect.any(Object),
    )
  })
  it('preserves existing assignments and deduplicates new employee selections', async () => {
    render(<AttendanceWorkshiftAssignments id={8} />)
    await select('Employees', 'Ada')
    await userEvent.click(
      screen.getByRole('button', { name: 'Add selected recipients' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Add selected recipients' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Save assignments' }),
    )
    expect(mocks.assign).toHaveBeenCalledWith(
      {
        regular_shift_id: 8,
        assignables: [
          { type: 'department', type_id: 5 },
          { type: 'employee', type_id: 42 },
        ],
      },
      expect.any(Object),
    )
  })
  it('rejects an empty replacement instead of sending an invalid batch', async () => {
    render(<AttendanceWorkshiftAssignments id={8} />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove from list' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Save assignments' }),
    )
    expect(mocks.assign).not.toHaveBeenCalled()
    expect(
      screen.getByText('Select at least one assignment'),
    ).toBeInTheDocument()
  })
  it('does not show all-company recipient selection to non-HQ administrators', async () => {
    mocks.access.mockReturnValue({
      canView: true,
      canAssign: true,
      isHqAdmin: false,
    })
    render(<AttendanceWorkshiftAssignments id={8} />)
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Select employees by' }),
    )
    expect(
      screen.queryByRole('option', { name: 'All users' }),
    ).not.toBeInTheDocument()
  })
})

describe('settings, calendar and roster', () => {
  it('protects system shift types and normalizes edited browser time values', async () => {
    mocks.types.mockReturnValue(
      query({
        data: [
          ...types,
          {
            ...types[0],
            id: 1,
            name: 'No shift',
            is_system: 1,
            shift_start: '00:00:00',
            shift_end: '00:00:00',
          },
        ],
      }),
    )
    render(<AttendanceShiftTypes />)
    expect(screen.getByText(/No shift is a system/)).toBeInTheDocument()
    const name = screen.getByLabelText(/Shift name/)
    await userEvent.type(name, ' revised')
    expect(name).toHaveFocus()
    fireEvent.change(screen.getByLabelText(/Shift start/), {
      target: { value: '08:30' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(mocks.saveTypes).toHaveBeenCalledWith(
      {
        shift_types: [
          { ...types[0], name: 'Morning revised', shift_start: '08:30:00' },
        ],
      },
      expect.any(Object),
    )
  })
  it('places Add shift type above the list and cancels unsaved edits and rows', async () => {
    render(<AttendanceShiftTypes />)
    expect(
      screen.queryByRole('button', { name: 'Save' }),
    ).not.toBeInTheDocument()
    const add = screen.getByRole('button', { name: 'Add shift type' })
    const name = screen.getByLabelText(/Shift name/)
    expect(
      add.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await userEvent.type(name, ' revised')
    await userEvent.click(add)
    expect(screen.getAllByLabelText(/Shift name/)).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Save' }),
      ).not.toBeInTheDocument(),
    )
    expect(screen.getByLabelText(/Shift name/)).toHaveValue('Morning')
    expect(mocks.saveTypes).not.toHaveBeenCalled()
  })
  it('does not show editing actions without save permission', () => {
    mocks.access.mockReturnValue({
      canViewTypes: true,
      canSaveTypes: false,
      canDeleteTypes: false,
    })
    render(<AttendanceShiftTypes />)
    expect(
      screen.queryByRole('button', { name: 'Add shift type' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Save' }),
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Shift name/)).toBeDisabled()
  })
  it('does not restore a persisted deletion when cancelling a new row', async () => {
    render(<AttendanceShiftTypes />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete shift type' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mocks.removeType).toHaveBeenCalledWith(2, expect.any(Object))
    const callbacks = mocks.removeType.mock.lastCall?.[1]
    act(() => callbacks.onSuccess())
    await userEvent.click(
      screen.getByRole('button', { name: 'Add shift type' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByLabelText(/Shift name/)).not.toBeInTheDocument()
  })
  it('saves supported clock settings including zero-hour windows', async () => {
    render(<AttendanceShiftClock />)
    fireEvent.change(screen.getAllByLabelText('Hours before start')[0], {
      target: { value: '0' },
    })
    await userEvent.click(
      screen.getByRole('button', { name: 'Save clock settings' }),
    )
    expect(mocks.saveClock).toHaveBeenCalledWith(
      {
        clock_in: { hours_before_start: 0, hours_after_start: 3 },
        clock_out: { hours_before_start: 3, hours_after_start: 3 },
      },
      expect.any(Object),
    )
  })
  it('loads the current employee calendar and updates month boundaries', async () => {
    render(<AttendanceShiftCalendar />)
    expect(mocks.calendar).toHaveBeenCalledWith(
      expect.objectContaining({ employee_id: 42 }),
    )
    const previous = mocks.calendar.mock.lastCall?.[0].date_start
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(mocks.calendar.mock.lastCall?.[0].date_start).not.toBe(previous)
    expect(
      screen.getByText('No saved schedules for this period.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/A blank date means no saved schedule/),
    ).toBeInTheDocument()
  })
  it('opens saved shift details from its actual calendar event', async () => {
    const date = dayjs().format('YYYY-MM-DD')
    mocks.calendar.mockReturnValue(
      query({
        data: [
          {
            shift_type_id: 2,
            shift_type_name: 'Morning',
            shift_date_start: date,
            shift_date_end: date,
            shift_start: '09:00:00',
            shift_end: '17:00:00',
          },
        ],
      }),
    )
    render(<AttendanceShiftCalendar />)
    await userEvent.click(screen.getAllByText('Morning')[0])
    expect(await screen.findByText('Employee schedule')).toBeInTheDocument()
    expect(screen.getByText('09:00:00 - 17:00:00')).toBeInTheDocument()
  })
  it('validates roster dates and generates filters suitable for URL persistence', async () => {
    const onGenerate = vi.fn()
    render(
      <QueryClientProvider client={new QueryClient()}>
        <AttendanceShiftRoster onGenerate={onGenerate} />
      </QueryClientProvider>,
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate roster' }),
    )
    expect(onGenerate).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText(/Start date/), {
      target: { value: '2026-10-01' },
    })
    fireEvent.change(screen.getByLabelText(/End date/), {
      target: { value: '2026-10-31' },
    })
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate roster' }),
    )
    await waitFor(() =>
      expect(onGenerate).toHaveBeenCalledWith({
        fetch_by: 'company',
        fetch_by_id: [7],
        start_date: '2026-10-01',
        end_date: '2026-10-31',
      }),
    )
  })
  it('reloads roster filters passed from the URL rather than relying on navigation state', () => {
    const filters = {
      fetch_by: 'employee' as const,
      fetch_by_id: [42],
      start_date: '2026-10-01',
      end_date: '2026-10-31',
    }
    render(
      <QueryClientProvider client={new QueryClient()}>
        <AttendanceShiftRoster filters={filters} onGenerate={vi.fn()} />
      </QueryClientProvider>,
    )
    expect(mocks.roster).toHaveBeenCalledWith(filters, 1)
    expect(screen.getByLabelText(/Start date/)).toHaveValue('October 1, 2026')
  })
})
