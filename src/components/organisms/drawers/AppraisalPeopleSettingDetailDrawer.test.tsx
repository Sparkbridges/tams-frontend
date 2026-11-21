import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AppraisalPeopleSettingDetailDrawer from './AppraisalPeopleSettingDetailDrawer'

vi.mock('#/router', () => ({ getRouter: vi.fn() }))
const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  retry: vi.fn(),
  pending: false,
  error: false,
  data: {
    id: 12,
    name: 'Annual Review',
    description: 'Final reviews',
    approvalType: 'sequential',
    category: 'department',
    branchId: 3,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-02',
    assignments: [{ value: '8', label: 'Sales' }],
    persons: [
      {
        level: 1,
        personId: 9,
        personType: 'static',
        name: 'Jane Doe',
        alternateName: 'John Doe',
      },
    ],
  },
}))
vi.mock('#/lib/api', () => ({
  useAppraisalPeopleSetting: (...args: unknown[]) => {
    mocks.query(...args)
    return {
      data: mocks.data,
      isPending: mocks.pending,
      isError: mocks.error,
      error: new Error('Request failed'),
      refetch: mocks.retry,
    }
  },
}))

describe('appraisal people settings detail drawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.pending = false
    mocks.error = false
  })
  afterEach(cleanup)

  it.each(['appraiser', 'approver'] as const)(
    'shows %s details with an edit action',
    (kind) => {
      const edit = vi.fn()
      render(
        <AppraisalPeopleSettingDetailDrawer
          opened
          kind={kind}
          selectedId={12}
          onEdit={edit}
          onClose={vi.fn()}
        />,
      )
      expect(mocks.query).toHaveBeenCalledWith(kind, 12)
      expect(screen.getByText('Annual Review')).toBeInTheDocument()
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
      if (kind === 'appraiser')
        expect(screen.getByText('Sales')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Edit Settings' }))
      expect(edit).toHaveBeenCalledOnce()
    },
  )

  it('displays loading and failed-request feedback', () => {
    mocks.pending = true
    const { rerender } = render(
      <AppraisalPeopleSettingDetailDrawer
        opened
        kind="approver"
        selectedId={12}
        onEdit={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading settings')
    mocks.pending = false
    mocks.error = true
    rerender(
      <AppraisalPeopleSettingDetailDrawer
        opened
        kind="approver"
        selectedId={12}
        onEdit={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('Unable to load settings')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(mocks.retry).toHaveBeenCalledOnce()
  })
})
