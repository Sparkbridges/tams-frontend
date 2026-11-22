import { TamsButton, TamsSpinner, TamsTextInput } from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditFeedbackSurveyForm } from '#/lib'
import type { TFeedbackQuestionPayload } from '#/lib/types/api/performance'
import {
  ActionIcon,
  Checkbox,
  Group,
  LoadingOverlay,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const questionTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'Multiple choice', value: 'multiple_choice' },
  { label: 'Checkbox', value: 'checkbox' },
]

const CreateEditFeedbackSurveyForm = ({ type, id }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoading,
    isError,
  } = useCreateEditFeedbackSurveyForm({ type, id })

  if (isError) return <TamsPageError type="404" />

  const questions =
    (
      form.getValues() as unknown as {
        survey_questions: TFeedbackQuestionPayload[]
      }
    ).survey_questions ?? []

  const updateQuestion = (
    index: number,
    patch: Partial<TFeedbackQuestionPayload>,
  ) => {
    form.setFieldValue(
      'survey_questions',
      questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question,
      ),
    )
  }

  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <Tams2ColsForm fields={fields} form={form} />

      {type === 'create' && (
        <div className="grid grid-cols-2 lg:grid-cols-12 space-y-3 mt-4">
          <div className="col-span-2 lg:col-span-5">
            <Text fw={600}>Survey Questions</Text>
          </div>
          <Paper p="lg" withBorder className="col-span-2 lg:col-span-7">
            <Group justify="space-between">
              <Title order={4}>Questions</Title>
              <TamsButton
                variant="light"
                leftSection={<PlusIcon />}
                onClick={() =>
                  form.setFieldValue('survey_questions', [
                    ...questions,
                    { question: '', required: true, type: 'text' },
                  ])
                }
              >
                Add question
              </TamsButton>
            </Group>
            <Stack mt="md">
              {questions.map((question, index) => (
                <Paper key={index} withBorder radius="md" p="md">
                  <Group align="flex-start" wrap="nowrap">
                    <Stack flex={1}>
                      <TamsTextInput
                        label={`Question ${index + 1}`}
                        value={question.question}
                        onChange={(event) =>
                          updateQuestion(index, {
                            question: event.currentTarget.value,
                          })
                        }
                        required
                      />
                      <SegmentedControl
                        value={question.type}
                        data={questionTypes}
                        onChange={(value) =>
                          updateQuestion(index, {
                            type: value as TFeedbackQuestionPayload['type'],
                            type_value:
                              value === 'text'
                                ? undefined
                                : question.type_value?.length
                                  ? question.type_value
                                  : [''],
                          })
                        }
                      />
                      {question.type !== 'text' && (
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>
                            Options
                          </Text>
                          {(question.type_value ?? []).map(
                            (option, optionIndex) => (
                              <Group key={optionIndex} wrap="nowrap">
                                <TamsTextInput
                                  label={`Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(event) => {
                                    const options = [
                                      ...(question.type_value ?? []),
                                    ]
                                    options[optionIndex] =
                                      event.currentTarget.value
                                    updateQuestion(index, {
                                      type_value: options,
                                    })
                                  }}
                                  required
                                />
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  aria-label={`Remove option ${optionIndex + 1}`}
                                  mt={24}
                                  disabled={
                                    (question.type_value?.length ?? 0) === 1
                                  }
                                  onClick={() => {
                                    const options = (
                                      question.type_value ?? []
                                    ).filter(
                                      (_, currentIndex) =>
                                        currentIndex !== optionIndex,
                                    )
                                    updateQuestion(index, {
                                      type_value: options,
                                    })
                                  }}
                                >
                                  <TrashIcon />
                                </ActionIcon>
                              </Group>
                            ),
                          )}
                          <TamsButton
                            variant="light"
                            size="sm"
                            leftSection={<PlusIcon />}
                            onClick={() =>
                              updateQuestion(index, {
                                type_value: [
                                  ...(question.type_value ?? []),
                                  '',
                                ],
                              })
                            }
                          >
                            Add option
                          </TamsButton>
                        </Stack>
                      )}
                      <Checkbox
                        label="Required"
                        checked={question.required}
                        onChange={(event) =>
                          updateQuestion(index, {
                            required: event.currentTarget.checked,
                          })
                        }
                      />
                    </Stack>
                    <ActionIcon
                      variant="light"
                      color="red"
                      aria-label="Remove question"
                      disabled={questions.length === 1}
                      onClick={() =>
                        form.setFieldValue(
                          'survey_questions',
                          questions.filter(
                            (_, questionIndex) => questionIndex !== index,
                          ),
                        )
                      }
                    >
                      <TrashIcon />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </div>
      )}

      <TamsActionWidget
        loading={loading}
        title={
          type === 'create'
            ? 'Unsaved new Feedback'
            : 'Unsaved changes to Feedback'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditFeedbackSurveyForm
