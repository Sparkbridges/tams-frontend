import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AppraisalPeopleSettingModal from './AppraisalPeopleSettingModal'
import type { TAppraisalPeopleSetting } from '#/lib/types/api/performance'

vi.mock('#/router', () => ({ getRouter: vi.fn() }))

const mocks = vi.hoisted(() => ({
  save: vi.fn(),
  detail: undefined as TAppraisalPeopleSetting | undefined,
  detailError: false,
  branches: [{ value: '3', label: 'Head Office' }],
  employees: [{ value: '9', label: 'Jane Doe' }],
  empty: [],
}))

vi.mock('#/lib/api', () => ({
  useAppraisalPeopleSetting: () => ({
    data: mocks.detail,
    isPending: false,
    isError: mocks.detailError,
    error: new Error('Unable to fetch setting'),
    refetch: vi.fn(),
  }),
  useSaveAppraisalPeopleSetting: () => ({
    mutateAsync: mocks.save,
    isPending: false,
    isError: false,
  }),
  useFetchOrganizationBranches: () => ({ data: mocks.branches }),
  useFetchOrganizationDepartments: () => ({ data: mocks.empty }),
  useGetEmployeeGrades: () => ({ data: mocks.empty }),
  useSearchOrganizationEmployees: () => ({ data: mocks.employees }),
}))

const detail: TAppraisalPeopleSetting = {
  id: 12,
  name: 'Annual Review',
  description: 'Annual Review',
  approvalType: 'sequential',
  category: 'employees',
  branchId: 3,
  assignments: [{ value: '8', label: 'John Doe' }],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-02',
  persons: [
    {
      level: 1,
      personId: 9,
      personType: 'static',
      name: 'Jane Doe',
      alternateId: 10,
      alternateType: 'static',
      alternateName: 'James Doe',
    },
  ],
}

describe('appraisal setting create/edit modal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.save.mockResolvedValue({})
    mocks.detail = undefined
    mocks.detailError = false
  })
  afterEach(cleanup)

  it.each(['appraiser', 'approver'] as const)(
    'creates a new %s setting',
    async (kind) => {
      const close = vi.fn()
      render(<AppraisalPeopleSettingModal opened kind={kind} onClose={close} />)
      fireEvent.change(screen.getByLabelText(/^Name/), {
        target: { value: 'New setting' },
      })
      if (kind === 'appraiser') {
        fireEvent.click(screen.getByRole('combobox', { name: 'Assignments' }))
        fireEvent.click(await screen.findByRole('option', { name: 'Jane Doe' }))
      }
      fireEvent.click(
        screen.getByRole('combobox', {
          name: kind === 'appraiser' ? 'Appraiser' : 'Approver',
        }),
      )
      fireEvent.click(await screen.findByRole('option', { name: 'Jane Doe' }))
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
      await waitFor(() =>
        expect(mocks.save).toHaveBeenCalledWith(
          kind === 'appraiser'
            ? {
                kind,
                id: undefined,
                data: {
                  description: 'New setting',
                  approval_types: 'Sequential',
                  no_approvals: 1,
                  category_type: 'employees',
                  employees: [9],
                  appraiser_details: [
                    {
                      appraiser_person_id: 9,
                      alt_appraiser_person_id: undefined,
                    },
                  ],
                },
              }
            : {
                kind,
                id: undefined,
                data: {
                  name: 'New setting',
                  description: '',
                  approval_type: 'sequential',
                  approver_persons: [
                    { approver_person_id: 9, approver_person_type: 'static' },
                  ],
                },
              },
        ),
      )
      expect(close).toHaveBeenCalledOnce()
    },
  )

  it('loads appraiser assignments and alternate appraisers before editing', async () => {
    mocks.detail = detail
    const close = vi.fn()
    render(
      <AppraisalPeopleSettingModal
        opened
        kind="appraiser"
        selectedId={12}
        onClose={close}
      />,
    )
    expect(screen.getByLabelText(/^Name/)).toHaveValue('Annual Review')
    expect(
      screen.getByRole('combobox', { name: 'Alternate Appraiser' }),
    ).toHaveValue('James Doe')
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { value: 'Updated Review' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(mocks.save).toHaveBeenCalledWith({
        kind: 'appraiser',
        id: 12,
        data: {
          description: 'Updated Review',
          approval_types: 'Sequential',
          no_approvals: 1,
          category_type: 'employees',
          employees: [8],
          appraiser_details: [
            { appraiser_person_id: 9, alt_appraiser_person_id: 10 },
          ],
        },
      }),
    )
    expect(close).toHaveBeenCalledOnce()
  })

  it('preserves dynamic approvers and concurrent approval when editing', async () => {
    mocks.detail = {
      ...detail,
      approvalType: 'concurrent',
      persons: [
        {
          level: 1,
          personId: 4,
          personType: 'dynamic',
          name: "Employee's HR Manager",
          alternateId: 9,
          alternateType: 'static',
          alternateName: 'Jane Doe',
        },
      ],
    }
    render(
      <AppraisalPeopleSettingModal
        opened
        kind="approver"
        selectedId={12}
        onClose={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { value: 'HR Approval' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(mocks.save).toHaveBeenCalledWith({
        kind: 'approver',
        id: 12,
        data: {
          name: 'HR Approval',
          description: 'Annual Review',
          approval_type: 'concurrent',
          approver_persons: [
            {
              approver_person_id: 4,
              approver_person_type: 'dynamic',
              alt_approver_person_id: 9,
              alt_approver_person_type: 'static',
            },
          ],
        },
      }),
    )
  })

  it('does not save a new setting with an empty person or assignment', async () => {
    render(
      <AppraisalPeopleSettingModal opened kind="appraiser" onClose={vi.fn()} />,
    )
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { value: 'New review' },
    })
    fireEvent.submit(
      screen.getByRole('button', { name: 'Save' }).closest('form')!,
    )
    expect(mocks.save).not.toHaveBeenCalled()
    expect(
      await screen.findByText('Select at least one assignment.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Select an appraiser.')).toBeInTheDocument()
  })

  it('keeps the form open after a failed save', async () => {
    mocks.detail = detail
    mocks.save.mockRejectedValueOnce(new Error('Save failed'))
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    const close = vi.fn()
    render(
      <AppraisalPeopleSettingModal
        opened
        kind="appraiser"
        selectedId={12}
        onClose={close}
      />,
    )
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { value: 'Updated review' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(mocks.save).toHaveBeenCalledOnce())
    expect(close).not.toHaveBeenCalled()
  })

  it('shows an explicit error and retry rather than an empty edit form', () => {
    mocks.detailError = true
    render(
      <AppraisalPeopleSettingModal
        opened
        kind="approver"
        selectedId={12}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('Unable to load settings')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Save' }),
    ).not.toBeInTheDocument()
  })
})
