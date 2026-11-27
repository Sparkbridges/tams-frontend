import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../../../test-utils/render'
import AtsRequirementsModal from './AtsRequirementsModal'

const mocks = vi.hoisted(() => ({ query: vi.fn(), save: vi.fn() }))
vi.mock('#/router', () => ({ getRouter: vi.fn() }))
vi.mock('#/lib/api/services/ats', () => ({
  useScreeningRequirements: mocks.query,
  useSaveScreeningRequirements: () => ({
    mutateAsync: mocks.save,
    isPending: false,
  }),
}))
beforeEach(() => {
  vi.clearAllMocks()
  mocks.query.mockReturnValue({
    data: {
      data: {
        role: 'Developer',
        description: 'Build products with React',
        requirements: {
          required_skills: ['React'],
          preferred_skills: [],
          qualifications: [],
          minimum_years_experience: null,
        },
      },
    },
    dataUpdatedAt: 1,
  })
})
afterEach(cleanup)
describe('screening requirements', () => {
  it('saves recruiter-confirmed requirements, preserving a null experience requirement', async () => {
    const onClose = vi.fn()
    mocks.save.mockResolvedValue({})
    render(<AtsRequirementsModal opened jobId={8} onClose={onClose} />)
    expect(screen.getByText('Build products with React')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Save requirements' }))
    await waitFor(() =>
      expect(mocks.save).toHaveBeenCalledWith({
        id: 8,
        required_skills: ['React'],
        preferred_skills: [],
        qualifications: [],
        minimum_years_experience: null,
      }),
    )
    expect(onClose).toHaveBeenCalled()
  })
  it('surfaces requirement loading failures and offers retry', () => {
    const retry = vi.fn()
    mocks.query.mockReturnValue({
      isError: true,
      error: new Error('Not found'),
      refetch: retry,
    })
    render(<AtsRequirementsModal opened jobId={8} onClose={vi.fn()} />)
    expect(screen.getByText(/Not found/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(retry).toHaveBeenCalled()
  })
})
