import { MantineProvider } from '@mantine/core'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useCreateEditHrmLeaveApproverForm from './useCreateEditHrmLeaveApproverForm'

const employees = vi.hoisted(() => [
  { value: '1', label: 'Alice' },
  { value: '2', label: 'Bob' },
])

vi.mock('#/components', async () => {
  const { Button, Select } = await import('@mantine/core')
  return { TamsButton: Button, TamsSelectInput: Select }
})

vi.mock('#/lib/utils', async () => {
  const schemas = await import('../../utils/schema/hrm.schema')
  return { ...schemas, getErrorMessage: vi.fn() }
})

vi.mock('#/lib/api', () => ({
  useFetchOrganizationBranches: () => ({ data: [] }),
  useFetchOrganizationDepartments: () => ({ data: [] }),
  useGetEmployeeGrades: () => ({ data: [] }),
  useGetHrmLeaveTypeById: () => ({ data: undefined }),
  useCreateHrmLeaveApprover: vi.fn(),
  useUpdateHrmLeaveApprover: vi.fn(),
  useSearchOrganizationEmployees: () => ({
    data: employees,
  }),
}))

function ApproverForm() {
  const { form, fields } = useCreateEditHrmLeaveApproverForm({
    type: 'create',
    closeActionWidget: vi.fn(),
  })

  return (
    <>
      {fields[1].fields[0].listItems}
      <output data-testid="values">
        {JSON.stringify(form.getValues().approver_details)}
      </output>
    </>
  )
}

afterEach(cleanup)

describe('leave approver dropdowns', () => {
  it('keeps primary, alternate and additional row search text independent', async () => {
    const user = userEvent.setup()
    render(
      <MantineProvider env="test">
        <ApproverForm />
      </MantineProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Add Approver' }))
    const [primary, nextPrimary] =
      screen.getAllByPlaceholderText('Select Approver')
    const [alternate, nextAlternate] = screen.getAllByPlaceholderText(
      'Select Alt Approver',
    )

    await user.type(primary, 'Ali')
    expect(alternate).toHaveValue('')
    expect(nextPrimary).toHaveValue('')
    expect(nextAlternate).toHaveValue('')
    await user.click(await screen.findByRole('option', { name: 'Alice' }))
    expect(primary).toHaveValue('Alice')
    expect(alternate).toHaveValue('')

    await user.type(alternate, 'Bob')
    await user.click(await screen.findByRole('option', { name: 'Bob' }))
    expect(primary).toHaveValue('Alice')
    expect(alternate).toHaveValue('Bob')
    expect(screen.getByTestId('values')).toHaveTextContent(
      '"approver_person_id":"1","alt_approver_person_id":"2"',
    )

    await user.type(nextPrimary, 'Bob')
    await user.click(await screen.findByRole('option', { name: 'Bob' }))
    await user.click(screen.getAllByRole('button', { name: '' })[0])
    expect(screen.getByPlaceholderText('Select Approver')).toHaveValue('Bob')
    expect(screen.getByPlaceholderText('Select Alt Approver')).toHaveValue('')
  })
})
