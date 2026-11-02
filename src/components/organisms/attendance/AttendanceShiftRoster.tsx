import { useState } from 'react'
import { Grid, Group, Paper, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { TamsButton, TamsDateInput, TamsTable } from '#/components/atoms'
import {
  useShiftRoster,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import workshiftClient from '#/lib/api/client/workshift'
import { useTamsStore } from '#/lib/store'
import { getErrorMessage } from '#/lib/utils'
import { rosterTableRows } from '#/lib/utils/helpers/workshift'
import { rosterFilterSchema } from '#/lib/utils/schema/workshift.schema'
import type { RosterParams } from '#/lib/types/api/workshift'
import ShiftRecipients from './ShiftRecipients'
import type { ShiftRecipientsValue } from './ShiftRecipients'
import { AttendanceQueryError } from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'
import { TamsPageError } from '#/components/molecules'

export default function AttendanceShiftRoster({
  filters,
  onGenerate,
}: {
  filters?: RosterParams
  onGenerate: (filters: RosterParams) => void
}) {
  const { canView } = useWorkshiftAccess()
  const companyId = useTamsStore((state) => state.user?.employee.company_id)
  const [page, setPage] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const form = useForm({
    initialValues: {
      start_date: filters?.start_date ?? '',
      end_date: filters?.end_date ?? '',
    },
  })
  const [recipients, setRecipients] = useState<ShiftRecipientsValue>({
    type: filters?.fetch_by ?? 'company',
    ids:
      filters?.fetch_by_id.map(String) ??
      (companyId ? [String(companyId)] : []),
    branchId: filters?.branch_id ? String(filters.branch_id) : null,
  })
  const query = useShiftRoster(filters ?? null, page)
  const download = useMutation({
    mutationFn: async () => {
      if (!filters) throw new Error('Generate a roster before exporting')
      const response = await workshiftClient.exportRoster({
        ...filters,
        page: 1,
        perPage: 10,
      })
      const blob = await workshiftClient.downloadRosterFile(response.data)
      return { filename: response.data, blob }
    },
    onSuccess: ({ filename, blob }) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 0)
      notifications.show({
        title: 'Roster exported',
        message: 'The CSV includes all matching employees.',
        color: 'green',
      })
    },
    onError: (error) =>
      notifications.show({
        title: 'Roster export failed',
        message: getErrorMessage(error),
        color: 'red',
      }),
  })
  if (!canView) return <TamsPageError type="403" />
  return (
    <AttendanceWorkshiftsLayout>
      <Paper withBorder p="lg">
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitting(true)
            const parsed = rosterFilterSchema.safeParse({
              ...form.values,
              fetch_by: recipients.type,
              fetch_by_id: recipients.ids.map(Number),
              ...(recipients.type === 'department'
                ? { branch_id: Number(recipients.branchId) }
                : {}),
            })
            if (!parsed.success) {
              form.setErrors(
                Object.fromEntries(
                  parsed.error.issues.map((issue) => [
                    String(issue.path[0]),
                    issue.message,
                  ]),
                ),
              )
              setSubmitting(false)
              return
            }
            form.clearErrors()
            setPage(1)
            onGenerate(parsed.data)
            setSubmitting(false)
          }}
        >
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TamsDateInput
                  label="Start date"
                  withAsterisk
                  {...form.getInputProps('start_date')}
                  value={form.values.start_date || null}
                  onChange={(value) =>
                    form.setFieldValue('start_date', value ?? '')
                  }
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <TamsDateInput
                  label="End date"
                  withAsterisk
                  {...form.getInputProps('end_date')}
                  value={form.values.end_date || null}
                  onChange={(value) =>
                    form.setFieldValue('end_date', value ?? '')
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <ShiftRecipients value={recipients} onChange={setRecipients} />
                {(form.errors.fetch_by_id || form.errors.branch_id) && (
                  <Text c="red" role="alert">
                    {form.errors.fetch_by_id ?? form.errors.branch_id}
                  </Text>
                )}
              </Grid.Col>
            </Grid>
            <Group justify="flex-end">
              <TamsButton type="submit" loading={submitting}>
                Generate roster
              </TamsButton>
            </Group>
          </Stack>
        </form>
      </Paper>
      {query.isError && (
        <AttendanceQueryError
          error={query.error}
          retry={() => void query.refetch()}
        />
      )}
      {filters && (
        <>
          <Group justify="space-between">
            <Text>
              Roster: {filters.start_date} to {filters.end_date}
            </Text>
            <TamsButton
              variant="outline"
              loading={download.isPending}
              disabled={!query.data?.data.results.length || query.isFetching}
              onClick={() => download.mutate()}
            >
              Export CSV (all matching employees)
            </TamsButton>
          </Group>
          <TamsTable
            columns={[
              { label: 'PIN', accessor: 'pin' },
              { label: 'Name', accessor: 'name' },
              ...(query.data?.data.rosterDates.map((date) => ({
                label: date.readable_date,
                accessor: date.date,
              })) ?? []),
            ]}
            data={query.data ? rosterTableRows(query.data.data) : []}
            page={page}
            setPage={setPage}
            total={query.data?.data.total}
            loading={query.isLoading}
            disableSearch
          />
        </>
      )}
    </AttendanceWorkshiftsLayout>
  )
}
