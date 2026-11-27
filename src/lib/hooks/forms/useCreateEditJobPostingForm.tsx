import {
  answerTypes,
  editJobPostingInitials,
  jobTypeOptions,
  workModeOptions,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { randomId, useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'
import { editJobPostingSchema } from '#/lib/utils/schema/recruitment.schema'
import type { TEditJobPostingPayload } from '#/lib/utils/schema/recruitment.schema'
import {
  useEditRecruitmentJobPosting,
  useFetchRecruitmentJobPostingById,
  useRecruitmentTalentRequests,
} from '#/lib/api/services/recruitment'
import { useGetCountries, useGetStates } from '#/lib/api'
import { ActionIcon, Divider, Group, TagsInput } from '@mantine/core'
import {
  TamsButton,
  TamsSelectInput,
  TamsSwitchInput,
  TamsTextInput,
} from '#/components'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { ACCEPTED_FILE_TYPES, fileToBase64 } from '#/lib/utils'

type Props = {
  id: number
}

const useCreateEditJobPostingForm = ({ id }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const form = useTamsForm({
    defaultValues: {
      ...editJobPostingInitials,
      items: [
        {
          question: '',
          answer_type: '',
          required: true,
          options: [] as string[],
          key: randomId(),
        },
      ],
    },
    schema: editJobPostingSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        openActionWidget()
      } else {
        closeActionWidget()
      }
    },
    transformValues: (values) => {
      return {
        ...values,
        custom_fields: JSON.stringify(
          values.items?.map((item) => ({
            question: item.question,
            answer_type: item.answer_type,
            required: item.required,
            options: item.options,
          })) ?? [],
        ),
      }
    },
  })

  const mutateAsyncUpdateJobPosting = useEditRecruitmentJobPosting()

  const {
    data: details,
    isLoading: isLoadingDetails,
    isError,
  } = useFetchRecruitmentJobPostingById(id)

  const country_id = form.useWatchValue('job_location_country_id')

  const { data: countries } = useGetCountries((data) =>
    data.data.map((country: any) => ({
      value: String(country.id),
      label: country.name,
    })),
  )

  const { data: states } = useGetStates(
    { country_id: Number(country_id) },
    (data) =>
      data.data.map((state: any) => ({
        value: String(state.id),
        label: state.name,
      })),
  )

  const { data: talentRequests } = useRecruitmentTalentRequests(
    {
      status: 'approved',
      page: 1,
      per_page: 1000,
    },
    (data) => data.data.results,
  )

  useEffect(() => {
    const initializeForm = async () => {
      const data = details?.data
      if (id && data) {
        const resolvedCustomFields =
          typeof data.custom_fields === 'string'
            ? JSON.parse(data.custom_fields ?? '[]')
            : ((data.custom_fields ?? []) as any[])
        const initials = {
          id,
          description: data.description ?? '',
          job_request_id: Number(data.job_request_id ?? 0),
          role: data.role ? data.role : '',
          work_mode: data.work_mode as string,
          job_location_country_id: data.job_location_country_id ?? 0,
          job_location_state_id: data.job_location_state_id ?? 0,
          custom_fields:
            typeof data.custom_fields === 'string'
              ? JSON.parse(data.custom_fields ?? '[]')
              : (JSON.stringify(data.custom_fields) ?? ''),
          type: data.type as string,
          items: resolvedCustomFields.map((item: any) => ({
            ...item,
            key: randomId(),
          })),
          required_documents: [],
          files: JSON.parse(
            typeof data.required_documents === 'string'
              ? data.required_documents
              : '[]',
          ),
        }
        form.initialize(initials)
        form.resetDirty(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [details, id])

  const listItems = (
    <section className="space-y-2">
      <div className="space-y-2.5">
        {form.getValues().items?.map((i, index) => (
          <div
            key={index}
            className="space-y-1.5 border-b pb-4 border-b-gray-300"
          >
            <Group key={index} align="flex-end" mt="xs">
              <TamsTextInput
                placeholder="Enter question"
                label="Question"
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`items.${index}.question`)}
                {...form.getInputProps(`items.${index}.question`)}
              />

              <TamsSelectInput
                placeholder="Select Answer type"
                label="Answer Type"
                style={{ flex: 1 }}
                key={form.key(`items.${index}.answer_type`)}
                {...form.getInputProps(`items.${index}.answer_type`)}
                data={answerTypes}
              />

              <TamsSwitchInput
                label="Required"
                key={form.key(`items.${index}.required`)}
                {...form.getInputProps(`items.${index}.required`, {
                  type: 'checkbox',
                })}
              />
              <Divider orientation="vertical" />

              <ActionIcon
                color="red"
                variant="light"
                onClick={() => form.removeListItem('items', index)}
              >
                <TrashIcon size={16} />
              </ActionIcon>
            </Group>
            {['dropdown', 'checkbox'].includes(i.answer_type) && (
              <TagsInput
                label="Options"
                key={form.key(`items.${index}.options`)}
                {...form.getInputProps(`items.${index}.options`)}
                data={i.options}
                placeholder="Enter options"
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <TamsButton
          leftSection={<PlusIcon size={16} />}
          variant="outline"
          onClick={() =>
            form.insertListItem('items', {
              question: '',
              answer_type: '',
              key: randomId(),
              required: true,
              options: [] as string[],
            })
          }
        >
          Add Question
        </TamsButton>
      </div>
    </section>
  )

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Job Posting Information',
      fields: [
        {
          label: 'Role',
          name: 'role',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Work Mode',
          name: 'work_mode',
          type: 'select',
          cols: 6,
          required: true,
          disabled: true,
          options: workModeOptions,
        },
        {
          label: 'Job Type',
          name: 'type',
          type: 'select',
          cols: 6,
          disabled: true,
          required: true,
          options: jobTypeOptions,
        },
        {
          label: 'Talent Request (Source)',
          name: 'job_request_id',
          placeholder: 'Select Talent Request',
          type: 'select',
          cols: 6,
          required: true,
          disabled: true,
          options:
            talentRequests?.map((request) => ({
              value: request.id.toString(),
              label: request.role,
            })) ?? [],
        },
        {
          label: 'Country',
          name: 'job_location_country_id',
          type: 'select',
          cols: 6,
          required: true,
          options: countries,
        },
        {
          label: 'State',
          name: 'job_location_state_id',
          type: 'select',
          cols: 6,
          required: true,
          options: states,
          hidden: !Number(country_id),
        },
        {
          label: 'Description',
          name: 'description',
          type: 'rich-text',
          cols: 12,
          required: true,
        },
      ],
    },
    {
      title: 'Additional Information',
      fields: [
        {
          label: 'Custom Questions',
          name: 'items',
          type: 'list',
          cols: 12,
          listItems,
        },
        {
          label: 'Required Documents',
          name: 'files',
          type: 'file',
          cols: 12,
          acceptedTypes: ACCEPTED_FILE_TYPES,
          acceptMultipleFiles: true,
        },
      ],
    },
  ]

  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        try {
          const { items, files, ...rest } = values as TEditJobPostingPayload
          const docs = await Promise.all(
            (files ?? [])
              .filter((file): file is File => file instanceof File)
              .map(async (file) => ({
                name: file.name,
                size: file.size,
                required: true,
                data: (await fileToBase64(file)) as string,
              })),
          )
          const existingFiles = (files ?? []).filter(
            (file): file is { url: string; name: string; required: boolean } =>
              !(file instanceof File),
          )

          const required_docs = [...docs, ...existingFiles]

          await mutateAsyncUpdateJobPosting.mutateAsync({
            ...rest,
            id: id,
            required_documents: required_docs as any,
          })
          closeActionWidget()
        } catch (error) {
          console.error('Error submitting form', error)
        }
      },
      (errors) => {
        console.log('errors', errors)
      },
    )()
  }
  const handleCancel = () => {
    form.reset()
    closeActionWidget()
  }
  return {
    form,
    fields,
    openedActionWidget,
    openActionWidget,
    closeActionWidget,
    handleSubmit,
    handleCancel,
    loading: mutateAsyncUpdateJobPosting.isPending,
    isLoadingDetails,
    isError,
  }
}

export default useCreateEditJobPostingForm
