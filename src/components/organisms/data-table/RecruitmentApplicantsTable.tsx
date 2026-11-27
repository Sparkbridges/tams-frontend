import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTabs } from '#/components/molecules'
import useApplicantTrackingTable from '#/lib/hooks/tables/useApplicantTrackingTable'
import { applicantStatusLabels } from '#/lib/utils/schema/ats.schema'
import { getErrorMessage } from '#/lib/utils'
import RecruitmentApplicantDetailDrawer from '../drawers/RecruitmentApplicantDetailDrawer'
import AtsRequirementsModal from '../modals/AtsRequirementsModal'
import {
  useApplicantStatistics,
  useScreeningRequirements,
} from '#/lib/api/services/ats'
import type { TTamsTabs } from '#/lib/types'

export default function RecruitmentApplicantsTable({
  jobId,
}: {
  jobId: number
}) {
  const table = useApplicantTrackingTable(jobId)
  const [requirementsOpened, setRequirementsOpened] = useState(false)
  const requirements = useScreeningRequirements(jobId, true)
  const stats = useApplicantStatistics({ job_posting_id: jobId })
  const counts = stats.data?.data
  const tabs: TTamsTabs[] = [
    { label: 'All applicants', value: 'all' },
    ...Object.entries(applicantStatusLabels).map(([value, label]) => ({
      value,
      label,
      value2: Number(
        counts?.[`${value}_applications` as keyof typeof counts] || 0,
      ),
    })),
  ]
  const data = table.query.data?.data.results
  // Changing the result set clears bulk selection without remounting the search field.
  const clearedSelection = useMemo<number[]>(() => [], [data])
  return (
    <Stack>
      <Group justify="space-between">
        <div>
          <h2 className="font-bold text-xl">
            {requirements.data?.data.role || `Job #${jobId}`}
          </h2>
        </div>
        {table.access.canCreateJobPosting && (
          <Button variant="light" onClick={() => setRequirementsOpened(true)}>
            Screening requirements
          </Button>
        )}
      </Group>
      {requirements.isError && (
        <Alert color="red">
          {getErrorMessage(requirements.error)}{' '}
          <Button onClick={() => requirements.refetch()}>
            Retry job details
          </Button>
        </Alert>
      )}
      {stats.isError && (
        <Alert color="red">
          {getErrorMessage(stats.error)}{' '}
          <Button onClick={() => stats.refetch()}>Retry counts</Button>
        </Alert>
      )}
      <TamsTabs
        data={tabs}
        tabValue={table.search.tab || 'all'}
        onTabChange={(tab) =>
          table.changeSearch({ tab: tab as typeof table.search.tab })
        }
      />
      {table.query.isError ? (
        <Alert color="red">
          {getErrorMessage(table.query.error)}{' '}
          <Button onClick={() => table.query.refetch()}>Retry</Button>
        </Alert>
      ) : (
        <TamsTable
          columns={table.columns}
          data={table.tableData}
          loading={table.query.isLoading}
          page={table.search.page || 1}
          setPage={(page) => table.changeSearch({ page })}
          search={table.search.search || ''}
          setSearch={(search) => table.changeSearch({ search })}
          total={table.query.data?.data.total}
          selectedIds={clearedSelection}
          bulkSelectionOptions={table.bulkSelectionOptions}
          handleRowClick={(row) => {
            if (table.access.canViewApplicantDetails)
              table.setSelectedId(Number(row.id))
          }}
          filters={
            <Group gap="xs">
              <Select
                aria-label="Application source"
                placeholder="Source"
                clearable
                data={[
                  { label: 'Website', value: 'website' },
                  { label: 'CSV upload', value: 'upload' },
                ]}
                value={table.search.source || null}
                onChange={(source) =>
                  table.changeSearch({
                    source:
                      source === 'website' || source === 'upload'
                        ? source
                        : undefined,
                  })
                }
                w={150}
              />
              <NumberInput
                aria-label="Minimum experience"
                placeholder="Min. years"
                min={0}
                w={120}
                value={table.search.minimum ?? ''}
                onChange={(value) =>
                  table.changeSearch({
                    minimum: typeof value === 'number' ? value : undefined,
                  })
                }
              />
              <NumberInput
                aria-label="Maximum experience"
                placeholder="Max. years"
                min={0}
                w={120}
                value={table.search.maximum ?? ''}
                onChange={(value) =>
                  table.changeSearch({
                    maximum: typeof value === 'number' ? value : undefined,
                  })
                }
              />
            </Group>
          }
        />
      )}
      <RecruitmentApplicantDetailDrawer
        selectedId={table.selectedId}
        opened={table.selectedId !== null}
        onClose={() => table.setSelectedId(null)}
        onAction={table.beginAction}
        onDelete={table.setDeletingId}
      />
      <TamsConfirmation
        opened={!!table.action}
        onClose={() => table.setAction(null)}
        title={
          table.action?.status === 'shortlisted'
            ? table.action.schedule
              ? 'Schedule interview'
              : 'Shortlist applicants'
            : table.action?.status === 'completed'
              ? 'Mark applicants as hired'
              : 'Reject applicants'
        }
        message={`Update ${table.action?.ids.length || 0} applicant(s)? Configured recruitment emails will be triggered.`}
        loading={table.update.isPending}
        onConfirm={table.confirmAction}
        content={
          <Stack mt="md">
            {table.action?.schedule && (
              <>
                <TextInput
                  label="Interview date"
                  type="date"
                  value={table.interviewDate}
                  onChange={(event) =>
                    table.setInterviewDate(event.target.value)
                  }
                />
                <TextInput
                  label="Interview time"
                  description="Use your organisation's local time."
                  type="time"
                  value={table.interviewTime}
                  onChange={(event) =>
                    table.setInterviewTime(event.target.value)
                  }
                />
              </>
            )}
            {table.validation && <Alert color="red">{table.validation}</Alert>}
            {table.update.isError && (
              <Alert color="red">{getErrorMessage(table.update.error)}</Alert>
            )}
          </Stack>
        }
      />
      <TamsConfirmation
        opened={table.deletingId !== null}
        onClose={() => table.setDeletingId(null)}
        title="Delete application"
        message="Permanently delete this application and its stored screening text and assessment? This does not delete the CV file from cloud storage."
        isCritical
        onConfirm={table.confirmDelete}
        loading={table.deletion.isPending}
        content={
          table.deletion.isError ? (
            <Alert color="red">{getErrorMessage(table.deletion.error)}</Alert>
          ) : undefined
        }
      />
      {requirementsOpened && (
        <AtsRequirementsModal
          jobId={jobId}
          opened
          onClose={() => setRequirementsOpened(false)}
        />
      )}
    </Stack>
  )
}
