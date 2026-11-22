import {
  newDayjs,
  normalizeStrings,
  useFetchOrganizationDashboardEmployeesPerAgeGroup,
} from '#/lib'
import type { TDashboardFilters } from '#/lib'
import { DonutChart } from '@mantine/charts'
import { Badge, Divider, Paper, Skeleton } from '@mantine/core'
import { useMemo } from 'react'

type OrgNoOfEmployeesChartProps = {
  filters: TDashboardFilters
}

const colors = [
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange',
  'teal',
]

const OrgNoOfEmployeesChart = ({ filters }: OrgNoOfEmployeesChartProps) => {
  const { data, isLoading } = useFetchOrganizationDashboardEmployeesPerAgeGroup(
    {
      branch_id: filters?.branch,
      department_id: filters?.department,
      year: !filters?.reporting_period
        ? 'all'
        : newDayjs(filters?.reporting_period).year(),
    },
  )

  const updatedData = useMemo(() => {
    if (!data?.data) return []
    return Object.entries(data.data).map(([key, value], index) => {
      return {
        name: normalizeStrings(key),
        value,
        color: colors[index],
      }
    })
  }, [data?.data])

  return (
    <Paper withBorder radius={'md'} px={'lg'} py={{ base: 'md', sm: 'xl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg mb-0.5">
            Demographic & Age Distribution
          </h2>
          <p className="font-light text-xs text-gray-600">
            Generational mix & enterprise retention breakdown
          </p>
        </div>
        <Badge color="green">Healthy Balance</Badge>
      </div>
      <Divider my="md" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6  mt-5">
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          {!isLoading && updatedData.length > 0 && (
            <DonutChart
              size={290}
              thickness={20}
              withLegend
              data={updatedData}
            />
          )}
          {isLoading && <Skeleton height={290} width={290} />}
        </div>
        <div className="md:col-span-6 flex flex-col gap-3">
          {updatedData.map((item) => (
            <div
              key={item.name}
              className="p-2.5 bg-primary-500/5  rounded-sm flex flex-col gap-1 border-l-4"
              style={{ borderColor: item.color }}
            >
              <div className="flex items-center justify-between">
                <span className="font-title-sm text-title-sm text-text-main">
                  {item.name}
                </span>
                <span className="font-title-sm text-title-sm text-text-main font-bold">
                  {item.value} Staff
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  )
}

export default OrgNoOfEmployeesChart
