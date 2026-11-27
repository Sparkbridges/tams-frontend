import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AtsImportModal from './AtsImportModal'

const mocks = vi.hoisted(() => ({
  inspect: vi.fn(),
  upload: vi.fn(),
  query: vi.fn(),
}))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/api/services/ats', () => ({
  useApplicantCsvFields: () => ({
    ...mocks.query(),
    mutateAsync: mocks.inspect,
    reset: vi.fn(),
  }),
  useImportApplicants: () => ({
    mutateAsync: mocks.upload,
    reset: vi.fn(),
    isPending: false,
  }),
}))
beforeEach(() => {
  vi.clearAllMocks()
  mocks.query.mockReturnValue({})
})
afterEach(cleanup)

describe('applicant CSV import', () => {
  it('reads the CSV headers, maps known columns and submits the same file', async () => {
    const response = {
      data: {
        fieldsFromCSV: ['name', 'email'],
        applicantsUploadFields: [
          { label: 'Name', value: 'name' },
          { label: 'Email', value: 'email' },
        ],
      },
    }
    mocks.inspect.mockResolvedValue(response)
    mocks.query.mockReturnValue({ data: response })
    mocks.upload.mockResolvedValue({})
    const onClose = vi.fn()
    const { container } = render(<AtsImportModal opened onClose={onClose} />)
    const input = container.ownerDocument.querySelector('input[type="file"]')!
    const file = new File(
      ['name,email\nJane,jane@example.com'],
      'applicants.csv',
      { type: 'text/csv' },
    )
    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(screen.getByRole('button', { name: 'Read columns' }))
    await waitFor(() => expect(mocks.inspect).toHaveBeenCalledWith(file))
    await waitFor(() =>
      expect(
        screen.getByRole('combobox', { name: 'name' }),
      ).toBeInTheDocument(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Import applicants' }))
    await waitFor(() =>
      expect(mocks.upload).toHaveBeenCalledWith({
        file,
        fields: [
          { label: 'name', value: 'name' },
          { label: 'email', value: 'email' },
        ],
      }),
    )
    expect(onClose).toHaveBeenCalled()
  })
  it('shows parser errors rather than offering an empty mapping form', () => {
    mocks.query.mockReturnValue({
      isError: true,
      error: new Error('Empty CSV'),
    })
    render(<AtsImportModal opened onClose={vi.fn()} />)
    expect(screen.getByText('Empty CSV')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Import applicants' }),
    ).toBeDisabled()
  })
})
