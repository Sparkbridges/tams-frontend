import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Accordion,
  Alert,
  Badge,
  Divider,
  Group,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
} from '@mantine/core'
import { YearPickerInput } from '@mantine/dates'
import performanceReportsClient from '#/lib/api/client/performanceReports'
import { useAttendanceScope } from '#/lib/api/services/attendance'
import { useAttendanceReportTeams } from '#/lib/api/services/attendanceReports'
import { useTamsStore } from '#/lib/store'
import type { PerformanceReportParams } from '#/lib/types/api/performanceReports'
import { DashboardPanel, ScopeFilters } from './DashboardCommon'
import type { DashboardScope } from './DashboardCommon'
import { useGetPageHeader } from '#/lib'

export default function PerformanceDashboard() {
  const { pageHeader } = useGetPageHeader()
  const allowed = useTamsStore(
    (state) =>
      state.user?.permissions.includes('generate performance report') ?? false,
  )
  const branches = useTamsStore((state) => state.user?.managingBranches)
  const context = useAttendanceScope()
  const [scope, setScope] = useState<DashboardScope>({
    branch: 'all',
    department: 'all',
  })
  const [team, setTeam] = useState('all')
  const [year, setYear] = useState(`${new Date().getFullYear()}-01-01`)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState('5')
  const teams = useAttendanceReportTeams(allowed && scope.branch !== 'all', '')
  const branchIds =
    scope.branch === 'all'
      ? (branches ?? []).map((branch) => branch.id)
      : [Number(scope.branch)]
  const params: PerformanceReportParams = {
    fetch_by:
      team !== 'all'
        ? 'team'
        : scope.department !== 'all'
          ? 'department'
          : 'branch',
    fetch_by_id:
      team !== 'all'
        ? [Number(team)]
        : scope.department !== 'all'
          ? [Number(scope.department)]
          : branchIds,
    ...(scope.branch !== 'all' && { branch_id: Number(scope.branch) }),
    columns: ['first_name', 'last_name'],
    year: Number(year.slice(0, 4)),
    group_by: 'employee',
    page,
    perPage: Number(perPage),
  }
  const report = useQuery({
    queryKey: ['performance-dashboard', context, params],
    queryFn: () => performanceReportsClient.generate(params),
    enabled: allowed && branchIds.length > 0,
    retry: false,
  })

  if (!allowed)
    return (
      <Alert color="red">
        You do not have permission to generate performance reports.
      </Alert>
    )

  return (
    <main>
      <Paper withBorder p="md" radius="md" mb="md">
        <div>{pageHeader()}</div>
        <Divider my="md" />
        <Group align="end">
          <ScopeFilters
            scope={scope}
            onChange={(next) => {
              setScope(next)
              setTeam('all')
              setPage(1)
            }}
          />
          <Select
            label="Team"
            value={team}
            disabled={scope.branch === 'all' || teams.isLoading}
            data={[
              { value: 'all', label: 'All teams' },
              ...(teams.data ?? [])
                .filter(
                  (item) =>
                    item.is_generic || item.station_id === Number(scope.branch),
                )
                .map((item) => ({
                  value: String(item.id),
                  label: item.team_name,
                })),
            ]}
            onChange={(value) => {
              if (!value) return
              setTeam(value)
              if (value !== 'all') setScope({ ...scope, department: 'all' })
              setPage(1)
            }}
            allowDeselect={false}
            searchable
          />
          <YearPickerInput
            label="Reporting year"
            value={year}
            onChange={(value) => {
              if (value) {
                setYear(value)
                setPage(1)
              }
            }}
          />
        </Group>
        {teams.isError && (
          <Alert color="red" mt="md">
            Unable to load teams.
          </Alert>
        )}
      </Paper>
      <DashboardPanel
        title="Scorecard reports"
        loading={report.isLoading}
        error={report.isError}
      >
        {branchIds.length === 0 && (
          <Text c="dimmed">No managing branches available.</Text>
        )}
        {report.data && (
          <>
            {report.data.data.reports.length === 0 ? (
              <Text c="dimmed">No scorecard report available.</Text>
            ) : (
              <Accordion multiple>
                {report.data.data.reports.map((employee) => (
                  <Accordion.Item key={employee.id} value={String(employee.id)}>
                    <Accordion.Control>
                      {employee.first_name} {employee.last_name}
                    </Accordion.Control>
                    <Accordion.Panel>
                      {employee.scorecards.length === 0 ? (
                        <Text c="dimmed">No matching scorecards.</Text>
                      ) : (
                        <Accordion>
                          {employee.scorecards.map((card) => (
                            <Accordion.Item
                              key={card.id}
                              value={String(card.id)}
                            >
                              <Accordion.Control>
                                {card.appraisalGroup.name} ·{' '}
                                {card.appraisalGroup.appraisalPeriod?.name ??
                                  '—'}{' '}
                                · Score: {card.grade_score ?? '—'} ·{' '}
                                <Badge>{card.approval_status}</Badge>
                              </Accordion.Control>
                              <Accordion.Panel>
                                <Text size="sm">
                                  Employee ID: {card.employee.id} · Year:{' '}
                                  {card.appraisalGroup.appraisal_year} ·
                                  Created: {card.created_at}
                                </Text>
                                <Table.ScrollContainer minWidth={500}>
                                  <Table>
                                    <Table.Thead>
                                      <Table.Tr>
                                        <Table.Th>Performance area</Table.Th>
                                        <Table.Th>Area weight</Table.Th>
                                        <Table.Th>KPI category</Table.Th>
                                        <Table.Th>KPI subcategory</Table.Th>
                                        <Table.Th>Weight</Table.Th>
                                      </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                      {card.appraisalGroup.performanceAreas.flatMap(
                                        (area) =>
                                          area.kpiCategories.flatMap(
                                            (category) =>
                                              (category.kpiSubcategories.length
                                                ? category.kpiSubcategories
                                                : [null]
                                              ).map((subcategory, index) => (
                                                <Table.Tr
                                                  key={`${area.id}-${category.id}-${subcategory?.id ?? index}`}
                                                >
                                                  <Table.Td>
                                                    {area.name}
                                                  </Table.Td>
                                                  <Table.Td>
                                                    {area.weight}
                                                  </Table.Td>
                                                  <Table.Td>
                                                    {category.name}
                                                  </Table.Td>
                                                  <Table.Td>
                                                    {subcategory?.name ??
                                                      'No subcategories'}
                                                  </Table.Td>
                                                  <Table.Td>
                                                    {subcategory?.weight ?? '—'}
                                                  </Table.Td>
                                                </Table.Tr>
                                              )),
                                          ),
                                      )}
                                    </Table.Tbody>
                                  </Table>
                                </Table.ScrollContainer>
                                {!card.appraisalGroup.performanceAreas
                                  .length && (
                                  <Text c="dimmed">
                                    No performance areas found.
                                  </Text>
                                )}
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      )}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
            <Group justify="space-between" mt="md">
              <Text size="sm">{report.data.data.total} employees</Text>
              <Select
                label="Rows per page"
                w={120}
                value={perPage}
                data={['5', '10', '20', '50']}
                allowDeselect={false}
                onChange={(value) => {
                  if (value) {
                    setPerPage(value)
                    setPage(1)
                  }
                }}
              />
              <Pagination
                value={page}
                onChange={setPage}
                total={Math.max(
                  1,
                  Math.ceil(report.data.data.total / Number(perPage)),
                )}
              />
            </Group>
          </>
        )}
      </DashboardPanel>
    </main>
  )
}
