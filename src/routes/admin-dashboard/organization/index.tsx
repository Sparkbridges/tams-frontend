import {
  OrgEmployeeAgeDistributionChart,
  OrgEmployeeCountByBranches,
  OrgEmployeeCountByDepartments,
  OrgEmployeeStatsCount,
  OrgNoOfEmployeesChart,
  TamsButton,
  TamsDashboardFilters,
} from '#/components'
import { useGetPageHeader } from '#/lib'
import type { TDashboardFilters } from '#/lib'
import { Divider, Grid, Group, Paper } from '@mantine/core'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin-dashboard/organization/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const [filters, setFilters] = useState<TDashboardFilters>({
    branch: 'all',
    department: 'all',
    reporting_period: null,
  })
  return (
    <main>
      <Paper withBorder p="md" radius="md">
        <section className="flex items-center justify-between">
          {pageHeader()}
          <Group>
            <TamsButton
              onClick={() =>
                setFilters({
                  branch: 'all',
                  department: 'all',
                  reporting_period: null,
                })
              }
              size="sm"
              disabled={
                filters.branch === 'all' &&
                filters.department === 'all' &&
                filters.reporting_period === null
              }
              color="gray"
              leftSection={<ArrowCounterClockwiseIcon />}
            >
              Reset Filters
            </TamsButton>
          </Group>
        </section>
        <Divider my="md" />
        <TamsDashboardFilters filters={filters} onFilterChange={setFilters} />
      </Paper>

      <Grid gap={'md'} className="mt-4">
        <Grid.Col span={12}>
          <OrgEmployeeStatsCount filters={filters} />
        </Grid.Col>
        <Grid.Col span={{ lg: 8, xs: 12 }}>
          <OrgNoOfEmployeesChart filters={filters} />
        </Grid.Col>
        <Grid.Col span={{ lg: 4, xs: 12 }}>
          <OrgEmployeeCountByBranches />
        </Grid.Col>
        <Grid.Col span={{ lg: 4, xs: 12 }}>
          <OrgEmployeeCountByDepartments />
        </Grid.Col>
        <Grid.Col span={{ lg: 8, xs: 12 }}>
          <OrgEmployeeAgeDistributionChart filters={filters} />
        </Grid.Col>
      </Grid>
    </main>
  )
}
