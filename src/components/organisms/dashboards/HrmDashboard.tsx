import { useState } from 'react'
import { BarChart, DonutChart } from '@mantine/charts'
import { Divider, Grid, Group, Paper, Text } from '@mantine/core'
import { YearPickerInput } from '@mantine/dates'
import { useHrmStatistic } from '#/lib/api/services/dashboardStatistics'
import { DashboardPanel, DashboardStats, ScopeFilters } from './DashboardCommon'
import type { DashboardScope } from './DashboardCommon'
import { useGetPageHeader } from '#/lib'

export default function HrmDashboard() {
  const { pageHeader } = useGetPageHeader()
  const [scope, setScope] = useState<DashboardScope>({
    branch: 'all',
    department: 'all',
  })
  const [year, setYear] = useState<string | null>(null)
  const params = {
    branch_id: scope.branch,
    ...(scope.department !== 'all' && { department_id: scope.department }),
    ...(year && { year: Number(year.slice(0, 4)) }),
  }
  const entities = useHrmStatistic('entities_count', params)
  const gender = useHrmStatistic('gender_distribution', params)
  const retention = useHrmStatistic('employee_retention', params)
  const turnover = useHrmStatistic('employee_turnover', params)
  const movement = useHrmStatistic('joinee_vs_resignee', params)
  const data = entities.data?.data
  const genderData = gender.data?.data
  const genderChart = genderData
    ? [
        { name: 'Male', value: Number(genderData.male), color: 'teal.5' },
        { name: 'Female', value: Number(genderData.female), color: 'blue.5' },
        { name: 'Others', value: Number(genderData.others), color: 'yellow.5' },
      ]
    : []
  const retentionValue = retention.data?.data
  const turnoverValue = turnover.data?.data
  const percentage = (count: number | string, total: number | string) =>
    Number(total) > 0 ? Math.round((Number(count) / Number(total)) * 100) : 0
  const months = (movement.data?.data ?? []).map((item) => ({
    month: item.month,
    Joinees: Number(item.no_joinees),
    Resignees: Number(item.no_resignees),
  }))

  return (
    <main>
      <Paper withBorder p="md" radius="md" mb="md">
        <div>{pageHeader()}</div>
        <Divider my="md" />
        <Group align="end">
          <ScopeFilters scope={scope} onChange={setScope} />
          <YearPickerInput
            label="Reporting year"
            clearable
            placeholder="All years"
            value={year}
            onChange={setYear}
          />
        </Group>
      </Paper>
      <DashboardPanel
        title="Workforce overview"
        loading={entities.isLoading}
        error={entities.isError}
      >
        {data && (
          <DashboardStats
            items={[
              {
                label: 'Employees',
                value: data.employees_count?.total_employees ?? '—',
              },
              {
                label: 'Active Employees',
                value: data.employees_count?.number_of_active_employees ?? '—',
              },
              {
                label: 'Inactive Employees',
                value:
                  data.employees_count?.number_of_inactive_employees ?? '—',
              },
              {
                label: 'Exemption Requests',
                value: data.exemption_requests_count ?? '—',
              },
              {
                label: 'Leave Requests',
                value: data.leave_requests?.num_leave_requests ?? '—',
              },
              {
                label: 'Employees On Leave',
                value: data.leave_requests?.num_leave_requests_taken ?? '—',
              },
              {
                label: 'Leave Awaiting Approval',
                value: data.leave_requests?.num_leave_requests_pending ?? '—',
              },
              {
                label: 'Leave Scheduled',
                value: data.leave_requests?.num_leave_requests_scheduled ?? '—',
              },
              { label: 'Entry', value: data.entry_exits?.entry ?? '—' },
              { label: 'Exits', value: data.entry_exits?.exits ?? '—' },
            ]}
          />
        )}
      </DashboardPanel>
      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardPanel
            title="Gender Distribution"
            loading={gender.isLoading}
            error={gender.isError}
          >
            {genderChart.some((item) => item.value > 0) ? (
              <DonutChart
                data={genderChart}
                withLabelsLine
                withLabels
                tooltipDataSource="segment"
              />
            ) : (
              <Text c="dimmed">No employee data available.</Text>
            )}
          </DashboardPanel>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardPanel
            title="Employee Retention"
            loading={retention.isLoading}
            error={retention.isError}
          >
            {retentionValue && (
              <Text size="xl" fw={700}>
                {percentage(
                  retentionValue.entry,
                  retentionValue.total_employees,
                )}
                %
              </Text>
            )}
            <Text size="sm" c="dimmed">
              Active employees as a share of employees
            </Text>
          </DashboardPanel>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardPanel
            title="Employee Turnover"
            loading={turnover.isLoading}
            error={turnover.isError}
          >
            {turnoverValue && (
              <Text size="xl" fw={700}>
                {percentage(turnoverValue.exits, turnoverValue.total_employees)}
                %
              </Text>
            )}
            <Text size="sm" c="dimmed">
              Inactive employees as a share of employees
            </Text>
          </DashboardPanel>
        </Grid.Col>
        <Grid.Col span={12}>
          <DashboardPanel
            title="Joinees vs Resignees"
            loading={movement.isLoading}
            error={movement.isError}
          >
            {months.length ? (
              <BarChart
                h={300}
                data={months}
                dataKey="month"
                series={[
                  { name: 'Joinees', color: 'blue.6' },
                  { name: 'Resignees', color: 'yellow.6' },
                ]}
                withLegend
              />
            ) : (
              <Text c="dimmed">No employee movement data available.</Text>
            )}
          </DashboardPanel>
        </Grid.Col>
      </Grid>
    </main>
  )
}
