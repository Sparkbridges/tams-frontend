import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  FileInput,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { TamsDrawer } from '#/components/atoms'
import { useApplicant, useScreenApplicant } from '#/lib/api/services/ats'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import type { TApplicant, TUpdateApplicantStatus } from '#/lib/types/api/ats'
import { applicantStatusLabels } from '#/lib/utils/schema/ats.schema'
import {
  applicantAnswerParts,
  applicantAnswers,
  safeApplicantUrl,
} from '#/lib/utils/applicantAnswers'
import { getErrorMessage } from '#/lib/utils'
import RecruitmentApplicantDocumentLink from './RecruitmentApplicantDocumentLink'

function Answers({ value }: { value: unknown }) {
  try {
    const answers = applicantAnswers(value)
    return (
      <Stack>
        {answers.length ? (
          answers.map((answer, i) => (
            <div key={i}>
              <Text fw={600}>{answer.question}</Text>
              {applicantAnswerParts(answer.value).map((part, index) =>
                part.url ? (
                  <div key={index}>
                    <RecruitmentApplicantDocumentLink url={part.url}>
                      View submitted link/file
                    </RecruitmentApplicantDocumentLink>
                  </div>
                ) : (
                  <Text key={index} style={{ overflowWrap: 'anywhere' }}>
                    {part.text}
                  </Text>
                ),
              )}
            </div>
          ))
        ) : (
          <Text>No custom answers submitted.</Text>
        )}
      </Stack>
    )
  } catch (error) {
    return (
      <Alert color="red">
        Unable to read application answers: {getErrorMessage(error)}
      </Alert>
    )
  }
}

function ApplicantDetails({
  applicant,
  onAction,
  onDelete,
}: {
  applicant: TApplicant
  onAction: (
    status: TUpdateApplicantStatus['status'],
    ids: number[],
    schedule?: boolean,
  ) => void
  onDelete: (id: number) => void
}) {
  const access = useRecruitmentAccess()
  const screening = useScreenApplicant()
  const [file, setFile] = useState<File | null>(null)
  const resume = safeApplicantUrl(applicant.resume_url)
  const run = async () => {
    try {
      await screening.mutateAsync({ id: applicant.id, file: file || undefined })
      setFile(null)
    } catch (error) {
      console.error('Unable to screen applicant CV', error)
    }
  }
  const result = applicant.screening
  return (
    <Stack p="lg">
      <Paper withBorder p="lg" radius="lg">
        <Group justify="space-between">
          <Title order={3}>{applicant.name}</Title>
          <Badge>{applicantStatusLabels[applicant.status]}</Badge>
        </Group>
        <Text>{applicant.job_posting.role}</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
          <Text>Email: {applicant.email}</Text>
          <Text>Phone: {applicant.phone_number}</Text>
          <Text>
            Declared experience: {applicant.years_of_experience} years
          </Text>
          <Text>Source: {applicant.source}</Text>
          <Text>Applied: {applicant.created_at.slice(0, 10)}</Text>
          <Text>
            Work mode: {applicant.job_posting.work_mode || 'Not provided'}
          </Text>
          <Text>
            Employment type: {applicant.job_posting.type || 'Not provided'}
          </Text>
          <Text>
            Interview:{' '}
            {applicant.interview_date?.slice(0, 10) || 'Not scheduled'}{' '}
            {applicant.interview_time}
          </Text>
        </SimpleGrid>
        {resume ? (
          <RecruitmentApplicantDocumentLink url={resume}>
            View CV
          </RecruitmentApplicantDocumentLink>
        ) : (
          <Text>No valid CV link available.</Text>
        )}
        <Group mt="md">
          {access.canUpdateApplicants && (
            <>
              {applicant.status === 'pending' && (
                <Button
                  variant="light"
                  onClick={() => onAction('shortlisted', [applicant.id])}
                >
                  Shortlist
                </Button>
              )}
              <Button
                variant="light"
                onClick={() => onAction('shortlisted', [applicant.id], true)}
              >
                Schedule / reschedule interview
              </Button>
              {applicant.status !== 'completed' && (
                <Button
                  color="green"
                  onClick={() => onAction('completed', [applicant.id])}
                >
                  Mark as hired
                </Button>
              )}
              {applicant.status !== 'rejected' && (
                <Button
                  color="red"
                  variant="light"
                  onClick={() => onAction('rejected', [applicant.id])}
                >
                  Reject
                </Button>
              )}
            </>
          )}
          {access.canDeleteApplicants && (
            <Button color="red" onClick={() => onDelete(applicant.id)}>
              Delete application
            </Button>
          )}
        </Group>
      </Paper>
      <Paper withBorder p="lg" radius="lg">
        <Title order={4} mb="sm">
          Local CV screening
        </Title>
        <Alert>
          Advisory keyword evidence only. A mention does not verify proficiency;
          an absent mention does not prove a missing skill. Experience is
          applicant-declared. Recruiters make all decisions.
        </Alert>
        {applicant.screening_stale && (
          <Alert color="orange" mt="sm">
            Job requirements or description changed. Rerun screening before
            using this assessment.
          </Alert>
        )}
        {result ? (
          <Stack mt="md">
            <Text fw={600}>
              {result.status === 'complete'
                ? 'Assessment complete'
                : result.status.replaceAll('_', ' ')}
            </Text>
            <Text size="sm">{result.message}</Text>
            <Text size="xs" c="dimmed">
              Assessed: {new Date(result.assessed_at).toLocaleString()}
            </Text>
            {result.experience.minimum !== null && (
              <Text>
                Experience requirement: {result.experience.minimum} years;
                declared: {result.experience.declared} years (
                {result.experience.outcome.replaceAll('_', ' ')}). Verify
                relevance manually.
              </Text>
            )}
            {result.findings.map((finding, i) => (
              <Paper withBorder p="sm" key={i}>
                <Group justify="space-between">
                  <Text fw={600}>
                    {finding.requirement} ({finding.category})
                  </Text>
                  <Badge
                    color={finding.outcome === 'mentioned' ? 'blue' : 'orange'}
                  >
                    {finding.outcome.replaceAll('_', ' ')}
                  </Badge>
                </Group>
                <Text size="sm">
                  {finding.evidence ||
                    'Not mentioned in the extracted text. Review the CV manually.'}
                </Text>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text mt="md">
            Not assessed. Existing/imported applications may need a CV upload.
          </Text>
        )}
        {access.canUpdateApplicants && (
          <Stack mt="md">
            <FileInput
              label="Replace CV and screen (optional)"
              description="PDF/DOCX, up to 10MB. Replaces the CV link after successful extraction. Without a file, screening uses previously extracted text."
              accept=".pdf,.docx"
              value={file}
              onChange={setFile}
              clearable
            />
            <Button onClick={run} loading={screening.isPending}>
              Run local screening
            </Button>
            {screening.isError && (
              <Alert color="red">{getErrorMessage(screening.error)}</Alert>
            )}
          </Stack>
        )}
      </Paper>
      <Paper withBorder p="lg" radius="lg">
        <Title order={4} mb="md">
          Application answers
        </Title>
        <Answers value={applicant.custom_answers} />
      </Paper>
    </Stack>
  )
}

export default function RecruitmentApplicantDetailDrawer({
  selectedId,
  opened,
  onClose,
  onAction,
  onDelete,
}: {
  selectedId: number | null
  opened: boolean
  onClose: () => void
  onAction: (
    status: TUpdateApplicantStatus['status'],
    ids: number[],
    schedule?: boolean,
  ) => void
  onDelete: (id: number) => void
}) {
  const { canViewApplicantDetails } = useRecruitmentAccess()
  const query = useApplicant(selectedId, opened)
  if (!canViewApplicantDetails) return null
  return (
    <TamsDrawer
      opened={opened}
      onClose={onClose}
      title="Candidate details"
      size="xl"
    >
      {query.isLoading ? (
        <Text role="status">Loading candidate details...</Text>
      ) : query.isError ? (
        <Alert color="red">
          {getErrorMessage(query.error)}{' '}
          <Button onClick={() => query.refetch()}>Retry</Button>
        </Alert>
      ) : query.data ? (
        <ApplicantDetails
          key={selectedId}
          applicant={query.data.data}
          onAction={onAction}
          onDelete={onDelete}
        />
      ) : (
        <Text>Candidate not found.</Text>
      )}
    </TamsDrawer>
  )
}
