import {
  newDayjs,
  useFetchOrganizationDashboardEmployeesMonthOnMonth,
} from '#/lib'
import type { TDashboardFilters } from '#/lib'
import { LineChart } from '@mantine/charts'
import { Divider, Paper, Skeleton } from '@mantine/core'
import { useMemo } from 'react'

type OrgNoOfEmployeesChartProps = {
  filters: TDashboardFilters
}

const OrgNoOfEmployeesChart = ({ filters }: OrgNoOfEmployeesChartProps) => {
  const { data, isLoading } =
    useFetchOrganizationDashboardEmployeesMonthOnMonth({
      branch_id: filters?.branch,
      department_id: filters?.department,
      year: !filters?.reporting_period
        ? 'all'
        : newDayjs(filters?.reporting_period).year(),
    })

  const updatedData = useMemo(() => {
    if (!data?.data) return []
    return Object.entries(data.data).map(([key, value]) => {
      return {
        date: key,
        Apples: value,
      }
    })
  }, [data?.data])

  return (
    <Paper withBorder radius={'md'} px={'lg'} py={{ base: 'md', sm: 'xl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg mb-0.5">
            Workforce Headcount & Hiring Trends
          </h2>
          <p className="font-light text-xs text-gray-600">
            Month-by-month staff onboarding, active presence, and turnover delta
          </p>
        </div>
      </div>
      <Divider my="md" />
      <div>
        {data?.data && !isLoading && (
          <LineChart
            h={300}
            data={updatedData}
            dataKey="date"
            series={[
              {
                name: 'Apples',
                label: 'Employee count per month',
                color: 'indigo.6',
              },
            ]}
            curveType="linear"
          />
        )}
        {isLoading && <Skeleton height={300} className="w-full" />}
      </div>
    </Paper>
  )
}

export default OrgNoOfEmployeesChart
