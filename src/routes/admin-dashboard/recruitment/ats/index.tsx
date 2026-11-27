import { documentHelper, useGetPageHeader } from '#/lib'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Alert,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import {
  TamsButton,
  TamsPageError,
  TamsTable,
  TamsTextInput,
} from '#/components'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import { useApplicantStatistics } from '#/lib/api/services/ats'
import useRecruitmentAtsJobsTable from '#/lib/hooks/tables/useRecruitmentAtsJobsTable'
import AtsImportModal from '#/components/organisms/modals/AtsImportModal'
import { getErrorMessage } from '#/lib/utils'

export const Route = createFileRoute('/admin-dashboard/recruitment/ats/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Applicant Tracking System | Tams',
      content: 'Applicant Tracking System Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const access = useRecruitmentAccess()
  const jobs = useRecruitmentAtsJobsTable()
  const [importOpened, setImportOpened] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [period, setPeriod] = useState<{
    start_date?: string
    end_date?: string
  }>({})
  const stats = useApplicantStatistics(period)
  const invalidPeriod = !startDate || !endDate || startDate > endDate
  if (!access.canViewApplicants) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        {access.canUpdateApplicants && (
          <TamsButton onClick={() => setImportOpened(true)}>
            Import applicants
          </TamsButton>
        )}
      </section>
      <Divider my="md" />
      <Stack>
        <Group align="end">
          <TamsTextInput
            type="date"
            label="Statistics from"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <TamsTextInput
            type="date"
            label="Statistics to"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <TamsButton
            disabled={invalidPeriod}
            onClick={() =>
              setPeriod({ start_date: startDate, end_date: endDate })
            }
          >
            Apply dates
          </TamsButton>
          <TamsButton
            variant="subtle"
            onClick={() => {
              setPeriod({})
              setStartDate('')
              setEndDate('')
            }}
          >
            Reset
          </TamsButton>
        </Group>
        {stats.isError ? (
          <Alert color="red">
            {getErrorMessage(stats.error)}{' '}
            <TamsButton onClick={() => stats.refetch()}>
              Retry statistics
            </TamsButton>
          </Alert>
        ) : (
          <SimpleGrid cols={{ base: 2, md: 5 }}>
            {[
              ['Jobs', stats.data?.data.totalJobPosting],
              ['Pending', stats.data?.data.pending_applications],
              ['Interview', stats.data?.data.shortlisted_applications],
              ['Hired', stats.data?.data.completed_applications],
              ['Rejected', stats.data?.data.rejected_applications],
            ].map(([label, count]) => (
              <Paper key={label} p="md" withBorder radius="lg">
                <Text c="dimmed">{label}</Text>
                <Text fw={700} size="xl">
                  {stats.isLoading ? 'Loading...' : (count ?? 0)}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        )}
        {!access.canViewJobPostings ? (
          <Alert>
            You need permission to view job postings to select a job.
          </Alert>
        ) : jobs.query.isError ? (
          <Alert color="red">
            {getErrorMessage(jobs.query.error)}{' '}
            <TamsButton onClick={() => jobs.query.refetch()}>
              Retry jobs
            </TamsButton>
          </Alert>
        ) : (
          <TamsTable
            columns={jobs.columns}
            data={jobs.tableData}
            page={jobs.page}
            setPage={jobs.setPage}
            loading={jobs.query.isLoading}
            search={jobs.search}
            setSearch={jobs.setSearch}
            total={jobs.query.data?.data.total}
          />
        )}
      </Stack>
      {importOpened && (
        <AtsImportModal opened onClose={() => setImportOpened(false)} />
      )}
    </main>
  )
}
