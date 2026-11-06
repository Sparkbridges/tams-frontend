import { useState } from 'react'
import {
  Alert,
  Badge,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import {
  ChartLineUpIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileXlsIcon,
} from '@phosphor-icons/react'
import { TamsButton, TamsTable } from '#/components/atoms'
import { TamsStatsCard } from '#/components/molecules'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'
import useHandleAttendanceReports from '#/lib/hooks/tables/useHandleAttendanceReports'
import type { AttendanceReportParams } from '#/lib/types/api/attendanceReports'
import AttendanceReportForm from '../forms/AttendanceReportForm'
import AttendanceReportDetailDrawer from '../drawers/AttendanceReportDetailDrawer'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from '../attendance/AttendanceDevicesLayout'

export default function AllAttendanceReports({
  params,
  onChange,
}: {
  params?: AttendanceReportParams
  onChange: (params?: AttendanceReportParams) => void
}) {
  const state = useHandleAttendanceReports(params)
  const [editing, setEditing] = useState(false)
  if (
    !state.allowed.length ||
    (params && !state.allowed.some((report) => report.value === params.type))
  )
    return <AttendanceAccessDenied />
  if (!params || editing)
    return (
      <AttendanceReportForm
        initial={params}
        onGenerate={(next) => {
          state.setSelectedRow(null)
          setEditing(false)
          onChange(next)
        }}
      />
    )
  const loading = state.query.isFetching
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <TamsButton variant="subtle" onClick={() => setEditing(true)}>
          Back to filters
        </TamsButton>
        <TamsButton
          variant="outline"
          loading={loading}
          onClick={() => {
            state.setSelectedRow(null)
            void state.query.refetch()
          }}
        >
          Refresh report
        </TamsButton>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <TamsStatsCard
          title="Report"
          value={state.definition?.label ?? ''}
          description={`${params.date_from} to ${params.date_to}`}
          icon={ChartLineUpIcon}
          color="blue"
        />
        <TamsStatsCard
          title={`Matching ${params.group_by === 'employee' ? 'employees' : 'dates'}`}
          value={String(state.query.data?.data.total ?? 0)}
          description="Groups, not individual punch rows"
          icon={ChartLineUpIcon}
          color="indigo"
        />
        <TamsStatsCard
          title="Rows on this page"
          value={String(state.rows.length)}
          description="Exports include all matching groups"
          icon={ChartLineUpIcon}
          color="dark"
        />
      </SimpleGrid>
      <Alert color="blue">
        <p className="text-xs">
          {state.definition?.description} A blank or missing shift is not
          automatically an off day or absence. Historical scope uses current
          employee and branch records.
        </p>
      </Alert>
      {params.type === 'summary' && (
        <Alert color="yellow">
          <p className="text-xs">
            Absent days is the source attendance total. Approved leave on absent
            dates is shown separately; it is not subtracted from that total.
            These counts overlap and must not be added together.
          </p>
        </Alert>
      )}

      {Array.isArray(state?.query?.data?.data?.warnings) &&
        state?.query?.data?.data?.warnings?.length > 0 && (
          <Alert color="yellow">
            <ul className="list-disc list-inside text-xs">
              {state.query.data?.data.warnings?.map((warning) => (
                <li key={warning.code}>{warning.message}</li>
              ))}
            </ul>
          </Alert>
        )}
      {state.query.isError ? (
        <AttendanceQueryError
          error={state.query.error}
          retry={() => void state.query.refetch()}
        />
      ) : (
        <Paper radius="lg">
          <TamsTable
            disableSearch
            columns={state.columns.map((column) => ({
              label: column.label,
              accessor: column.value,
            }))}
            data={state.tableData}
            loading={state.query.isLoading}
            page={params.page}
            limit={params.per_page}
            total={state.query.data?.data.total ?? 0}
            setPage={(page) => {
              state.setSelectedRow(null)
              onChange({ ...params, page })
            }}
            handleRowClick={(row) =>
              state.setSelectedRow(state.rows[Number(row.id)] ?? null)
            }
            filters={
              <Group justify="space-between" w="100%">
                <Group>
                  <Text fw={600}>{state.definition?.label}</Text>
                  <Badge variant="light">Preview</Badge>
                </Group>
                <TamsButtonDropdown
                  btnText={
                    state.exportReport.isPending ? 'Exporting...' : 'Export'
                  }
                  variant="outline"
                  radius="xl"
                  options={[
                    {
                      type: 'item',
                      label: 'Export all as CSV',
                      icon: FileCsvIcon,
                      disabled:
                        loading ||
                        state.exportReport.isPending ||
                        !state.query.data?.data.total,
                      onClick: () => state.exportReport.mutate('csv'),
                    },
                    {
                      type: 'item',
                      label: 'Export all as Excel',
                      icon: FileXlsIcon,
                      disabled:
                        loading ||
                        state.exportReport.isPending ||
                        !state.query.data?.data.total,
                      onClick: () => state.exportReport.mutate('xlsx'),
                    },
                    {
                      type: 'item',
                      label: 'Export all as PDF',
                      icon: FilePdfIcon,
                      disabled:
                        loading ||
                        state.exportReport.isPending ||
                        !state.query.data?.data.total,
                      onClick: () => state.exportReport.mutate('pdf'),
                    },
                  ]}
                />
              </Group>
            }
          />
        </Paper>
      )}
      {state.selectedRow && (
        <AttendanceReportDetailDrawer
          row={state.selectedRow}
          onClose={() => state.setSelectedRow(null)}
        />
      )}
    </Stack>
  )
}
