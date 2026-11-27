import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Tams2ColsForm from '#/components/molecules/forms/Tams2ColsForm'
import { render } from '../../../../test-utils/render'
import useCreateEditJobPostingForm from './useCreateEditJobPostingForm'

const mocks = vi.hoisted(() => ({
  update: vi.fn().mockResolvedValue({}),
  details: {
    data: {
      id: 8,
      role: 'Engineer',
      job_request_id: 42,
      work_mode: 'remote',
      type: 'fulltime',
      description: 'Build things',
      job_location_country_id: 1,
      job_location_state_id: 2,
      custom_fields: '[{"question":"Existing"}]',
      required_documents: '[{"name":"Existing"}]',
    },
  },
}))

vi.mock('#/components/atoms', async () => {
  const { TextInput, Select, Textarea } = await import('@mantine/core')
  return {
    TamsTextInput: TextInput,
    TamsSelectInput: Select,
    TamsTextArea: Textarea,
  }
})
vi.mock('#/components/molecules/inputs', () => ({}))
vi.mock('#/lib/api/services/recruitment', () => ({
  useEditRecruitmentJobPosting: () => ({
    mutateAsync: mocks.update,
    isPending: false,
  }),
  useFetchRecruitmentJobPostingById: () => ({
    data: mocks.details,
    isLoading: false,
    isError: false,
  }),
}))
vi.mock('#/lib/api', () => ({
  useGetCountries: (select: (data: unknown) => unknown) => ({
    data: select({ data: [{ id: 1, name: 'Nigeria' }] }),
  }),
  useGetStates: (_params: unknown, select: (data: unknown) => unknown) => ({
    data: select({ data: [{ id: 2, name: 'Lagos' }] }),
  }),
}))

function EditForm() {
  const { form, fields, handleSubmit } = useCreateEditJobPostingForm({ id: 8 })
  return (
    <>
      <Tams2ColsForm form={form} fields={fields} />
      <button onClick={handleSubmit}>Save</button>
    </>
  )
}

describe('job posting edit', () => {
  it('displays the immutable request and existing locations, and preserves unrelated fields on save', async () => {
    render(<EditForm />)
    expect(
      await screen.findByLabelText('Talent Request ID (Source)'),
    ).toHaveValue('42')
    expect(screen.getByLabelText('Talent Request ID (Source)')).toHaveAttribute(
      'readonly',
    )
    expect(screen.getByRole('combobox', { name: /Country/ })).toHaveValue(
      'Nigeria',
    )
    expect(screen.getByRole('combobox', { name: /State/ })).toHaveValue('Lagos')
    fireEvent.change(screen.getByLabelText(/^Role/), {
      target: { value: 'Senior Engineer' },
    })
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith({
        id: 8,
        role: 'Senior Engineer',
        work_mode: 'remote',
        type: 'fulltime',
        description: 'Build things',
        job_location_country_id: 1,
        job_location_state_id: 2,
      }),
    )
  })
})
