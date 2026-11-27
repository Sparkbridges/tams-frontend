import { useState } from 'react'
import {
  Alert,
  Button,
  FileInput,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core'
import { TamsModal } from '#/components/atoms'
import {
  useApplicantCsvFields,
  useImportApplicants,
} from '#/lib/api/services/ats'
import { getErrorMessage } from '#/lib/utils'

function downloadSample() {
  const csv =
    'name,email,phone_number,years_of_experience,resume_url,job_id\nJane Example,jane@example.com,08000000000,3,https://example.com/cv.pdf,REPLACE_WITH_JOB_UUID\n'
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'applicants-sample.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function AtsImportModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [fields, setFields] = useState<
    { label: string; value: string | null }[]
  >([])
  const headers = useApplicantCsvFields()
  const importer = useImportApplicants()
  const reset = () => {
    setFile(null)
    setFields([])
    headers.reset()
    importer.reset()
    onClose()
  }
  const inspect = async () => {
    if (!file) return
    try {
      const response = await headers.mutateAsync(file)
      setFields(
        response.data.fieldsFromCSV.map((label) => ({
          label,
          value: response.data.applicantsUploadFields.some(
            (field) => field.value === label,
          )
            ? label
            : null,
        })),
      )
    } catch (error) {
      console.error('Unable to read applicant CSV', error)
    }
  }
  const submit = async () => {
    if (!file) return
    try {
      await importer.mutateAsync({ file, fields })
      reset()
    } catch (error) {
      console.error('Unable to import applicants', error)
    }
  }
  return (
    <TamsModal
      opened={opened}
      onClose={reset}
      title="Import applicants"
      size="lg"
    >
      <Stack>
        <Alert>
          Import up to 1,000 applicants. Job ID must be the posting UUID, not
          its numeric ID. No rows are saved if validation fails. Imported CV
          links require a PDF/DOCX upload before local screening.
        </Alert>
        <Button variant="subtle" onClick={downloadSample}>
          Download CSV sample
        </Button>
        <FileInput
          label="Applicants CSV"
          accept=".csv,text/csv"
          disabled={headers.isPending || importer.isPending}
          value={file}
          onChange={(value) => {
            setFile(value)
            setFields([])
            headers.reset()
            importer.reset()
          }}
        />
        <Button
          onClick={inspect}
          disabled={!file || importer.isPending}
          loading={headers.isPending}
        >
          Read columns
        </Button>
        {fields.length > 0 && (
          <Text size="sm">
            Map every required applicant field once. Leave unrelated columns
            unmapped.
          </Text>
        )}
        {fields.map((field, index) => (
          <Select
            key={field.label}
            label={field.label}
            clearable
            data={headers.data?.data.applicantsUploadFields || []}
            value={field.value}
            onChange={(value) =>
              setFields((current) =>
                current.map((item, i) =>
                  i === index ? { ...item, value } : item,
                ),
              )
            }
          />
        ))}
        {(headers.isError || importer.isError) && (
          <Alert color="red">
            {getErrorMessage(headers.error || importer.error)}
          </Alert>
        )}
        <Group justify="flex-end">
          <Button
            variant="default"
            onClick={reset}
            disabled={importer.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!fields.length || headers.isPending}
            loading={importer.isPending}
          >
            Import applicants
          </Button>
        </Group>
      </Stack>
    </TamsModal>
  )
}
