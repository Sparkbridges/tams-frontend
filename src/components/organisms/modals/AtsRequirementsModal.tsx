import {
  Alert,
  Button,
  Group,
  NumberInput,
  Stack,
  TagsInput,
  Text,
} from '@mantine/core'
import { TamsModal } from '#/components/atoms'
import { useScreeningRequirements } from '#/lib/api/services/ats'
import useAtsRequirementsForm from '#/lib/hooks/forms/useAtsRequirementsForm'
import type { TScreeningRequirements } from '#/lib/types/api/ats'
import { getErrorMessage } from '#/lib/utils'

function RequirementsForm({
  jobId,
  initial,
  onClose,
}: {
  jobId: number
  initial: TScreeningRequirements
  onClose: () => void
}) {
  const { form, onSubmit, mutation } = useAtsRequirementsForm(
    jobId,
    initial,
    onClose,
  )
  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Alert>
          Use job-related requirements only. These are keyword checks, not
          automatic hiring decisions. Enter alternative wording as separate
          terms when needed.
        </Alert>
        <TagsInput
          label="Required skills"
          description="Press Enter after each skill (maximum 30)."
          key={form.key('required_skills')}
          {...form.getInputProps('required_skills')}
        />
        <TagsInput
          label="Preferred skills"
          key={form.key('preferred_skills')}
          {...form.getInputProps('preferred_skills')}
        />
        <TagsInput
          label="Qualifications"
          key={form.key('qualifications')}
          {...form.getInputProps('qualifications')}
        />
        <NumberInput
          label="Minimum years of experience"
          description="Compared with the applicant's declaration, not verified CV employment dates."
          min={0}
          max={60}
          key={form.key('minimum_years_experience')}
          {...form.getInputProps('minimum_years_experience')}
          onChange={(value) =>
            form.setFieldValue(
              'minimum_years_experience',
              typeof value === 'number' ? value : null,
            )
          }
        />
        {mutation.isError && (
          <Alert color="red">{getErrorMessage(mutation.error)}</Alert>
        )}
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Save requirements
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default function AtsRequirementsModal({
  jobId,
  opened,
  onClose,
}: {
  jobId: number
  opened: boolean
  onClose: () => void
}) {
  const query = useScreeningRequirements(jobId, opened)
  return (
    <TamsModal
      title="CV screening requirements"
      opened={opened}
      onClose={onClose}
      size="lg"
    >
      {query.isLoading ? (
        <Text role="status">Loading requirements...</Text>
      ) : query.isError ? (
        <Alert color="red">
          {getErrorMessage(query.error)}{' '}
          <Button onClick={() => query.refetch()}>Retry</Button>
        </Alert>
      ) : (
        query.data && (
          <Stack>
            <Text fw={700}>{query.data.data.role}</Text>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {query.data.data.description}
            </Text>
            <RequirementsForm
              key={`${jobId}-${query.dataUpdatedAt}`}
              jobId={jobId}
              initial={query.data.data.requirements}
              onClose={onClose}
            />
          </Stack>
        )
      )}
    </TamsModal>
  )
}
