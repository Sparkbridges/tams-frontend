import type { ReactNode } from 'react'
import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'
import useGetPageHeader from '#/lib/hooks/useGetPageHeader'

const location = vi.hoisted(() => ({
  pathname: '/admin-dashboard/attendance/workshift',
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => location,
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
afterEach(cleanup)

describe('shared workshift page headers', () => {
  it.each([
    ['/admin-dashboard/attendance/workshift', 'Work shifts'],
    ['/admin-dashboard/attendance/workshift/edit/8', 'Edit work shift'],
    ['/admin-dashboard/attendance/workshift/details/8', 'Work shift: Office'],
    [
      '/admin-dashboard/attendance/workshift/calendar',
      'Employee shift calendar',
    ],
    ['/admin-dashboard/attendance/workshift/settings/clock', 'Clock settings'],
  ])('renders the standard header on %s', (pathname, title) => {
    location.pathname = pathname
    render(
      <AttendanceWorkshiftsLayout actions={<button>Page action</button>}>
        <p>Page content</p>
      </AttendanceWorkshiftsLayout>,
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Manage weekly workshifts, assignments and employee calendars',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'attendance' })).toHaveAttribute(
      'href',
      '/admin-dashboard/attendance',
    )
    expect(
      screen.getByRole('button', { name: 'Page action' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('preserves pathname-based headers for existing hook consumers', () => {
    location.pathname = '/admin-dashboard/attendance/devices'
    function ExistingPage() {
      const { pageHeader } = useGetPageHeader()
      return pageHeader()
    }
    render(<ExistingPage />)
    expect(
      screen.getByRole('heading', { name: 'Attendance Devices' }),
    ).toBeInTheDocument()
  })
})
