import { useState } from 'react'
import dayjs from 'dayjs'
import { BarChart } from '@mantine/charts'
import { Divider, Grid, Group, Paper, Text, TextInput } from '@mantine/core'
import { useAttendanceStatistic } from '#/lib/api/services/dashboardStatistics'
import { DashboardPanel, DashboardStats, ScopeFilters } from './DashboardCommon'
import type { DashboardScope } from './DashboardCommon'
import { useGetPageHeader } from '#/lib'

export default function AttendanceDashboard() {
  const { pageHeader } = useGetPageHeader()
  const [scope, setScope] = useState<DashboardScope>({
    branch: 'all',
    department: 'all',
  })
  const [date, setDate] = useState(() => dayjs().format('YYYY-MM-DD'))
  const params = {
    branch_id: scope.branch,
    ...(scope.department !== 'all' && { department_id: scope.department }),
    date,
  }
  const entities = useAttendanceStatistic('entities_count', params)
  const distribution = useAttendanceStatistic('attendance_distribution', params)
  const early = useAttendanceStatistic('early_rate', params)
  const absent = useAttendanceStatistic('absentee_rate', params)
  const average = useAttendanceStatistic('average_absenteism', params)
  const data = entities.data?.data
  const labels = ['6–7', '7–8', '8–9', '9–10', '10–11', 'After 11']
  const times = Object.values(distribution.data?.data ?? {}).map(
    (value, index) => ({
      time: labels[index] ?? `Period ${index + 1}`,
      Employees: Number(value),
    }),
  )
  const absenteeism = (average.data?.data ?? []).map((item) => ({
    month: item.short_month,
    Rate: Number(item.rate),
  }))
  const rate = (value: {
    rate: number | string
    number_of_active_employees: number | string
  }) =>
    Number(value.number_of_active_employees) > 0
      ? Math.round(
          (Number(value.rate) / Number(value.number_of_active_employees)) * 100,
        )
      : 0

  return (
    <main>
      <Paper withBorder p="md" radius="md" mb="md">
        <div>{pageHeader()}</div>
        <Divider my="md" />
        <Group align="end">
          <ScopeFilters scope={scope} onChange={setScope} />
          <TextInput
            label="Date"
            type="date"
            value={date}
            onChange={(event) => {
              if (event.currentTarget.value) setDate(event.currentTarget.value)
            }}
          />
        </Group>
      </Paper>
      <DashboardPanel
        title="Attendance overview"
        loading={entities.isLoading}
        error={entities.isError}
      >
        {data && (
          <DashboardStats
            items={[
              {
                label: 'Present Employees',
                value: data.present_employees ?? '—',
              },
              {
                label: 'Absent Employees',
                value: data.absent_employees ?? '—',
              },
              { label: 'Early Comers', value: data.early_in_employees ?? '—' },
              { label: 'Late Comers', value: data.late_employees ?? '—' },
              { label: 'Total Employees', value: data.total_employees ?? '—' },
              {
                label: 'Active Employees',
                value: data.number_of_active_employees ?? '—',
              },
              {
                label: 'Inactive Employees',
                value: data.number_of_inactive_employees ?? '—',
              },
              {
                label: 'Total Devices',
                value: data.devices_activity?.total ?? '—',
              },
              {
                label: 'Devices Online',
                value: data.devices_activity?.online ?? '—',
              },
              {
                label: 'Devices Offline',
                value: data.devices_activity?.offline ?? '—',
              },
            ]}
          />
        )}
      </DashboardPanel>
      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DashboardPanel
            title="Attendance in Time Distribution"
            loading={distribution.isLoading}
            error={distribution.isError}
          >
            {times.length ? (
              <BarChart
                h={300}
                data={times}
                dataKey="time"
                series={[{ name: 'Employees', color: 'blue.6' }]}
              />
            ) : (
              <Text c="dimmed">No attendance distribution available.</Text>
            )}
          </DashboardPanel>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardPanel
            title="Average Early Rate"
            loading={early.isLoading}
            error={early.isError}
          >
            {early.data && (
              <Text size="xl" fw={700}>
                {rate(early.data.data)}%
              </Text>
            )}
            <Text size="sm" c="dimmed">
              Of active employees
            </Text>
          </DashboardPanel>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardPanel
            title="Average Absenteeism Rate"
            loading={absent.isLoading}
            error={absent.isError}
          >
            {absent.data && (
              <Text size="xl" fw={700}>
                {rate(absent.data.data)}%
              </Text>
            )}
            <Text size="sm" c="dimmed">
              Of active employees
            </Text>
          </DashboardPanel>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DashboardPanel
            title="Absenteeism Chart"
            loading={average.isLoading}
            error={average.isError}
          >
            {absenteeism.length ? (
              <BarChart
                h={300}
                data={absenteeism}
                dataKey="month"
                series={[{ name: 'Rate', color: 'blue.6' }]}
                unit="%"
              />
            ) : (
              <Text c="dimmed">No absenteeism data available.</Text>
            )}
          </DashboardPanel>
        </Grid.Col>
      </Grid>
    </main>
  )
}
