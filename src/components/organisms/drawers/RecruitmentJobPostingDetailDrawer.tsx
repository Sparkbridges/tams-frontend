import { TamsDrawer, TamsSpinner } from '#/components/atoms'
import {
  useFetchRecruitmentJobPostingById,
  useRecruitmentAccess,
} from '#/lib/api/services/recruitment'
import type { TRecruitmentJobPosting } from '#/lib/types'
import { getErrorMessage } from '#/lib/utils'
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number | string | null
}

type Question = {
  question: string
  answer_type: string
  required: boolean
  options?: string[]
}

type Document = { name: string; required: boolean }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isQuestion = (value: unknown): value is Question =>
  isRecord(value) &&
  typeof value.question === 'string' &&
  typeof value.answer_type === 'string' &&
  typeof value.required === 'boolean' &&
  (value.options === undefined ||
    (Array.isArray(value.options) &&
      value.options.every((item: unknown) => typeof item === 'string')))

const isDocument = (value: unknown): value is Document =>
  isRecord(value) &&
  typeof value.name === 'string' &&
  typeof value.required === 'boolean'

function readList<T>(value: unknown, isItem: (item: unknown) => item is T) {
  if (value === null || value === undefined)
    return { items: [], invalid: false, missing: true }
  let parsed: unknown = value
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value)
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error
      return { items: [], invalid: true, missing: false }
    }
  }
  if (parsed === null) return { items: [], invalid: false, missing: true }
  if (!Array.isArray(parsed) || !parsed.every(isItem))
    return { items: [], invalid: true, missing: false }
  return { items: parsed, invalid: false, missing: false }
}

const formatValue = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === ''
    ? 'Not provided'
    : String(value)

const formatCategory = (value: string | null | undefined) => {
  if (!value) return 'Not provided'
  const labels: Record<string, string> = {
    fulltime: 'Full-time',
    parttime: 'Part-time',
    onsite: 'On-site',
  }
  return (
    labels[value] ??
    value.replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase())
  )
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
      {label}
    </Text>
    <Text
      size="sm"
      mt={4}
      style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
    >
      {value}
    </Text>
  </div>
)

function PostingDetails({ posting }: { posting: TRecruitmentJobPosting }) {
  const questions = readList(posting.custom_fields, isQuestion)
  const documents = readList(posting.required_documents, isDocument)
  const formats = readList(
    posting.accepted_formats,
    (value): value is string => typeof value === 'string',
  )

  return (
    <Stack p="lg" gap="lg">
      <Paper withBorder radius="lg" p="lg" bg="white">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
              Job posting #{posting.id}
            </Text>
            <Title order={3}>{formatValue(posting.role)}</Title>
          </div>
          <Badge
            color={
              posting.status === 'active'
                ? 'green'
                : posting.status === 'draft'
                  ? 'orange'
                  : 'gray'
            }
            variant="light"
            size="lg"
          >
            {formatCategory(posting.status)}
          </Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="lg">
          <Detail label="Work mode" value={formatCategory(posting.work_mode)} />
          <Detail label="Job type" value={formatCategory(posting.type)} />
          <Detail label="Branch ID" value={formatValue(posting.station_id)} />
          <Detail
            label="Department ID"
            value={formatValue(posting.department_id)}
          />
          <Detail
            label="Country ID"
            value={formatValue(posting.job_location_country_id)}
          />
          <Detail
            label="State ID"
            value={formatValue(posting.job_location_state_id)}
          />
          <Detail label="Created" value={formatDate(posting.created_at)} />
          <Detail label="Last updated" value={formatDate(posting.updated_at)} />
          <Detail
            label="Requested by requisition ID"
            value={formatValue(posting.job_request_id)}
          />
          <Detail
            label="Created by employee ID"
            value={formatValue(posting.created_by_id)}
          />
        </SimpleGrid>
      </Paper>
      <Paper withBorder radius="lg" p="lg" bg="white">
        <Title order={4} mb="md">
          Job description
        </Title>
        <Text
          size="sm"
          style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
        >
          {formatValue(posting.description)}
        </Text>
      </Paper>
      <Paper withBorder radius="lg" p="lg" bg="white">
        <Title order={4} mb="md">
          Application settings
        </Title>
        <Stack gap="md">
          <Detail
            label="Accepted CV formats"
            value={
              formats.invalid
                ? 'Unable to read formats'
                : formats.items.length
                  ? formats.items.join(', ')
                  : formats.missing
                    ? 'Company default'
                    : 'None'
            }
          />
          <Detail
            label="Maximum CV size"
            value={
              posting.max_file_size_mb == null
                ? 'Company default'
                : `${posting.max_file_size_mb} MB`
            }
          />
          <div>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
              Application questions
            </Text>
            {questions.invalid ? (
              <Text size="sm" c="red">
                Unable to read application questions.
              </Text>
            ) : questions.items.length === 0 ? (
              <Text size="sm">None</Text>
            ) : (
              <Stack gap="xs" mt="xs">
                {questions.items.map((question, index) => (
                  <div key={index}>
                    <Text size="sm" fw={600}>
                      {question.question}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatCategory(question.answer_type)} ·{' '}
                      {question.required ? 'Required' : 'Optional'}
                    </Text>
                    {question.options && question.options.length > 0 && (
                      <Text size="sm">{question.options.join(', ')}</Text>
                    )}
                  </div>
                ))}
              </Stack>
            )}
          </div>
          <div>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
              Documents
            </Text>
            {documents.invalid ? (
              <Text size="sm" c="red">
                Unable to read documents.
              </Text>
            ) : documents.items.length === 0 ? (
              <Text size="sm">None</Text>
            ) : (
              <Stack gap="xs" mt="xs">
                {documents.items.map((document, index) => (
                  <Text size="sm" key={index}>
                    {document.name} ·{' '}
                    {document.required ? 'Required' : 'Optional'}
                  </Text>
                ))}
              </Stack>
            )}
          </div>
        </Stack>
      </Paper>
    </Stack>
  )
}

const RecruitmentJobPostingDetailDrawer = ({
  opened,
  onClose,
  selectedId,
}: Props) => {
  const id = Number(selectedId)
  const hasSelection = Number.isInteger(id) && id > 0
  const { canViewJobPostingDetails } = useRecruitmentAccess()
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetchRecruitmentJobPostingById(
      opened && hasSelection && canViewJobPostingDetails ? id : 0,
    )
  const posting = data?.data

  return (
    <TamsDrawer
      title="Job Posting Details"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      {!canViewJobPostingDetails ? (
        <Alert color="red" title="Access denied" role="alert" m="lg">
          You do not have permission to view job posting details.
        </Alert>
      ) : !hasSelection ? (
        <Text p="lg">Select a job posting to view its details.</Text>
      ) : isLoading ? (
        <Stack
          align="center"
          justify="center"
          h={260}
          role="status"
          aria-label="Loading job posting details"
        >
          <TamsSpinner size="md" />
        </Stack>
      ) : isError ? (
        <Alert
          color="red"
          title="Unable to load job posting"
          role="alert"
          m="lg"
        >
          <Text size="sm">{getErrorMessage(error)}</Text>
          <Button
            mt="sm"
            variant="light"
            onClick={() => void refetch()}
            loading={isFetching}
          >
            Try again
          </Button>
        </Alert>
      ) : !posting ? (
        <Alert color="red" title="Job posting not found" role="alert" m="lg">
          The requested job posting is unavailable.
        </Alert>
      ) : (
        <PostingDetails posting={posting} />
      )}
    </TamsDrawer>
  )
}

export default RecruitmentJobPostingDetailDrawer
