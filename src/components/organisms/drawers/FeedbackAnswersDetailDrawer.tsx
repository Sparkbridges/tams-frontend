import { TamsDrawer, TamsSpinner } from '#/components/atoms'
import { useDeleteFeedbackAnswers, useFetchFeedbackAnswers } from '#/lib'
import { TamsConfirmation } from '#/components/molecules'
import { useDisclosure } from '@mantine/hooks'
import { Badge, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'

const FeedbackAnswersDetailDrawer = ({
  surveyId,
  opened,
  onClose,
}: {
  surveyId: number | null
  opened: boolean
  onClose: () => void
}) => {
  const query = useFetchFeedbackAnswers(surveyId ?? 0, opened)
  const deleteMutation = useDeleteFeedbackAnswers()
  const [deletePair, setDeletePair] = useState<{
    answeredById: number
    answeredForId: number
  } | null>(null)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const surveys = query.data?.data ?? []
  const survey = surveys[0]

  const handleDeleteAnswers = async () => {
    if (!surveyId || !deletePair) return
    await deleteMutation.mutateAsync({
      id: surveyId,
      answered_by_id: deletePair.answeredById,
      answered_for_id: deletePair.answeredForId,
    })
    closeConfirmation()
    setDeletePair(null)
  }

  return (
    <>
      <TamsDrawer
        title="Feedback Answers"
        opened={opened}
        onClose={onClose}
        size="xl"
      >
        {query.isLoading ? (
          <Stack align="center" justify="center" h={260}>
            <TamsSpinner size="md" />
          </Stack>
        ) : query.isError ? (
          <Stack align="center" justify="center" h={260} gap="sm">
            <Text fw={600}>Unable to load feedback answers</Text>
            <Text size="sm" c="dimmed">
              Please try again.
            </Text>
          </Stack>
        ) : !survey ? (
          <Stack align="center" justify="center" h={260} gap="sm">
            <Text fw={600}>No feedback answers</Text>
            <Text size="sm" c="dimmed">
              No participant has submitted answers yet.
            </Text>
          </Stack>
        ) : (
          <Stack p="lg" gap="lg">
            <Paper withBorder radius="lg" p="lg" bg="white">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Feedback #{survey.id}
              </Text>
              <Title order={3}>{survey.name}</Title>
              <Text mt="sm" c="dimmed">
                {survey.description}
              </Text>
            </Paper>

            {(survey.answers as any[])?.map(
              (participant: any, participantIndex: number) => (
                <Paper
                  key={participant.employee_id ?? participantIndex}
                  withBorder
                  radius="lg"
                  p="lg"
                  bg="white"
                >
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text size="xs" c="dimmed">
                        Participant
                      </Text>
                      <Text fw={700}>
                        {participant.participant_details?.full_name ??
                          'Unknown employee'}
                      </Text>
                    </div>
                    <Badge variant="light">
                      {participant.answers?.length ?? 0} grader(s)
                    </Badge>
                  </Group>

                  {participant.answers?.map((grader: any) => (
                    <Paper
                      key={grader.employee_id}
                      withBorder
                      radius="md"
                      p="md"
                      mb="sm"
                      bg="gray.0"
                    >
                      <Group justify="space-between">
                        <Text fw={600}>
                          {grader.grader_details?.full_name ?? 'Unknown grader'}
                        </Text>
                        <button
                          type="button"
                          className="text-sm font-medium text-red-600"
                          onClick={() => {
                            setDeletePair({
                              answeredById: grader.employee_id,
                              answeredForId: participant.employee_id,
                            })
                            openConfirmation()
                          }}
                        >
                          Delete answers
                        </button>
                      </Group>
                      <Stack mt="sm" gap="xs">
                        {grader.answers?.map((answer: any) => (
                          <Group
                            key={answer.id}
                            justify="space-between"
                            align="flex-start"
                          >
                            <Text size="sm" fw={500}>
                              {answer.question}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {String(answer.answer ?? 'No answer')}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Paper>
                  ))}

                  {!participant.answers?.length && (
                    <Text size="sm" c="dimmed">
                      No feedback submitted for this participant.
                    </Text>
                  )}
                </Paper>
              ),
            )}
          </Stack>
        )}
      </TamsDrawer>

      <TamsConfirmation
        opened={openedConfirmation}
        onClose={() => {
          closeConfirmation()
          setDeletePair(null)
        }}
        onConfirm={handleDeleteAnswers}
        loading={deleteMutation.isPending}
        isCritical
        confirmText="Delete answers"
        title="Delete Feedback Answers"
        message="Are you sure you want to permanently delete this grader's answers?"
      />
    </>
  )
}

export default FeedbackAnswersDetailDrawer
