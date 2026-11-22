import { TamsButton, TamsModal2, TamsTextInput } from '#/components/atoms'
import {
  useAnswerFeedbackSurvey,
  useFetchAppliedFeedbackSurveys,
  useFetchAssignedFeedbackSurveys,
  useSearchOrganizationEmployees,
} from '#/lib'
import type {
  TFeedbackQuestion,
  TFeedbackSurvey,
} from '#/lib/types/api/performance'
import {
  Badge,
  Checkbox,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  Textarea,
  Radio,
  Select,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/ess/performance/feedback/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<'assigned' | 'received'>(
    'assigned',
  )
  const [selectedSurvey, setSelectedSurvey] = useState<TFeedbackSurvey | null>(
    null,
  )
  const [participantId, setParticipantId] = useState<number | null>(null)
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [answers, setAnswers] = useState<Record<number, unknown>>({})
  const [opened, { open, close }] = useDisclosure(false)

  const assignedQuery = useFetchAssignedFeedbackSurveys()
  const appliedQuery = useFetchAppliedFeedbackSurveys()
  const answerMutation = useAnswerFeedbackSurvey()

  const { data: employees } = useSearchOrganizationEmployees(
    employeeSearch ? { query: employeeSearch } : { query: ' ' },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id.toString(),
      })),
  )

  const assignedSurveys = useMemo(
    () => assignedQuery.data?.data ?? [],
    [assignedQuery.data],
  )
  const appliedSurveys = useMemo(
    () => appliedQuery.data?.data ?? [],
    [appliedQuery.data],
  )

  const openAnswerModal = (survey: TFeedbackSurvey) => {
    setSelectedSurvey(survey)
    setParticipantId(null)
    setAnswers({})
    open()
  }

  const closeAnswerModal = () => {
    close()
    setSelectedSurvey(null)
    setParticipantId(null)
    setAnswers({})
  }

  const setAnswer = (questionId: number, value: unknown) => {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  const canSubmit = useMemo(() => {
    if (!selectedSurvey || !participantId) return false
    return selectedSurvey.questions?.every((question) => {
      if (!question.required) return true
      const answer = answers[question.id]
      if (Array.isArray(answer)) return answer.length > 0
      return answer !== undefined && String(answer).trim().length > 0
    })
  }, [answers, participantId, selectedSurvey])

  const submitAnswers = async () => {
    if (!selectedSurvey || !participantId || !canSubmit) return
    await answerMutation.mutateAsync({
      survey_id: selectedSurvey.id,
      answered_for_id: participantId,
      question_answers: (selectedSurvey.questions ?? []).map((question) => ({
        question_id: question.id,
        answer: answers[question.id] ?? '',
      })),
    })
    closeAnswerModal()
  }

  const renderQuestion = (question: TFeedbackQuestion) => {
    const options = Array.isArray(question.type_value)
      ? question.type_value
      : typeof question.type_value === 'string'
        ? question.type_value
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean)
        : []

    if (question.type === 'dropdown') {
      return (
        <Select
          label={question.question}
          withAsterisk={question.required}
          data={options.map((option) => ({ label: option, value: option }))}
          value={(answers[question.id] as string) ?? null}
          onChange={(value) => setAnswer(question.id, value)}
        />
      )
    }

    if (question.type === 'multiple_choice') {
      return (
        <Radio.Group
          label={question.question}
          withAsterisk={question.required}
          value={(answers[question.id] as string) ?? ''}
          onChange={(value) => setAnswer(question.id, value)}
        >
          <Group mt="xs">
            {options.map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </Group>
        </Radio.Group>
      )
    }

    if (question.type === 'checkbox') {
      const selected = (answers[question.id] as string[]) ?? []
      return (
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            {question.question}
          </Text>
          {options.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={selected.includes(option)}
              onChange={(event) => {
                setAnswer(
                  question.id,
                  event.currentTarget.checked
                    ? [...selected, option]
                    : selected.filter((item) => item !== option),
                )
              }}
            />
          ))}
        </Stack>
      )
    }

    return (
      <Textarea
        label={question.question}
        withAsterisk={question.required}
        value={(answers[question.id] as string) ?? ''}
        onChange={(event) => setAnswer(question.id, event.currentTarget.value)}
      />
    )
  }

  return (
    <main className="px-7 pb-8">
      <section className="mb-5">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <p className="text-sm text-gray-500">
          Give feedback and review feedback received
        </p>
      </section>

      <SegmentedControl
        mb="md"
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
        data={[
          { label: 'Assigned to me', value: 'assigned' },
          { label: 'Received feedback', value: 'received' },
        ]}
      />

      {activeTab === 'assigned' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {assignedSurveys.map((survey) => (
            <Paper key={survey.id} withBorder radius="lg" p="lg">
              <Group justify="space-between">
                <div>
                  <Text fw={700}>{survey.name}</Text>
                  <Text size="sm" c="dimmed">
                    {survey.description}
                  </Text>
                </div>
                <Badge variant="light">
                  {survey.questions?.length ?? 0} questions
                </Badge>
              </Group>
              <TamsButton
                mt="md"
                radius="xl"
                onClick={() => openAnswerModal(survey)}
              >
                Give feedback
              </TamsButton>
            </Paper>
          ))}
          {!assignedQuery.isLoading && assignedSurveys.length === 0 && (
            <Text c="dimmed">No feedback surveys are assigned to you.</Text>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appliedSurveys.map((survey) => (
            <Paper key={survey.id} withBorder radius="lg" p="lg">
              <Title order={4}>{survey.name}</Title>
              <Text size="sm" c="dimmed">
                {survey.description}
              </Text>
              <Divider my="md" />
              {survey.allow_participants_view_answers ? (
                <Stack gap="md">
                  {(survey.graders as any[])?.map(
                    (grader: any, index: number) => (
                      <Paper
                        key={index}
                        withBorder
                        radius="md"
                        p="md"
                        bg="gray.0"
                      >
                        <Text fw={600}>
                          {grader.employee_details?.full_name ??
                            'Feedback giver'}
                        </Text>
                        <Stack mt="sm" gap="xs">
                          {grader.answers?.map((answer: any) => (
                            <Group key={answer.id} justify="space-between">
                              <Text size="sm">{answer.question}</Text>
                              <Text size="sm" c="dimmed">
                                {String(answer.answer)}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </Paper>
                    ),
                  )}
                  {!(survey.graders as any[])?.length && (
                    <Text size="sm" c="dimmed">
                      No feedback answers have been submitted.
                    </Text>
                  )}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  This feedback is not configured for participants to view
                  answers.
                </Text>
              )}
            </Paper>
          ))}
          {!appliedQuery.isLoading && appliedSurveys.length === 0 && (
            <Text c="dimmed">No feedback has been received.</Text>
          )}
        </div>
      )}

      <TamsModal2
        opened={opened}
        onClose={closeAnswerModal}
        title="Give Feedback"
        centered
        size="lg"
      >
        {selectedSurvey && (
          <div className="px-6 pb-6 space-y-5">
            <div>
              <Title order={4}>{selectedSurvey.name}</Title>
              <Text size="sm" c="dimmed">
                {selectedSurvey.description}
              </Text>
            </div>

            <TamsTextInput
              label="Search participant"
              placeholder="Search employee"
              value={employeeSearch}
              onChange={(event) => setEmployeeSearch(event.currentTarget.value)}
            />
            <Select
              label="Participant"
              placeholder="Select employee"
              searchable
              data={employees ?? []}
              value={participantId?.toString() ?? null}
              onChange={(value) =>
                setParticipantId(value ? Number(value) : null)
              }
            />

            <Divider />

            <Stack>
              {selectedSurvey.questions?.map((question) => (
                <div key={question.id}>{renderQuestion(question)}</div>
              ))}
            </Stack>

            <Group justify="flex-end">
              <TamsButton
                variant="default"
                radius="xl"
                onClick={closeAnswerModal}
              >
                Cancel
              </TamsButton>
              <TamsButton
                radius="xl"
                loading={answerMutation.isPending}
                disabled={!canSubmit}
                onClick={submitAnswers}
              >
                Submit feedback
              </TamsButton>
            </Group>
          </div>
        )}
      </TamsModal2>
    </main>
  )
}
