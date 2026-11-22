import { TamsStatsCard } from '#/components/molecules'
import { newDayjs, useFetchOrganizationDashboardEntitiesCount } from '#/lib'
import type { TDashboardFilters, TStatsCard } from '#/lib'
import {
  BuildingOfficeIcon,
  UsersIcon,
  UsersThreeIcon,
  WarehouseIcon,
} from '@phosphor-icons/react'
import { useMemo } from 'react'

type OrgEmployeeStatsCountProps = {
  filters: TDashboardFilters
}

const OrgEmployeeStatsCount = ({ filters }: OrgEmployeeStatsCountProps) => {
  const { data, isLoading } = useFetchOrganizationDashboardEntitiesCount({
    branch_id: filters?.branch,
    department_id: filters?.department,
    year: !filters?.reporting_period
      ? 'all'
      : newDayjs(filters?.reporting_period).year(),
  })

  const stats = useMemo((): TStatsCard[] => {
    return [
      {
        title: 'Total Employees',
        value: data?.data.employees_count?.total_employees || 0,
        icon: UsersIcon,
        color: 'blue',
        loading: isLoading,
      },
      {
        title: 'Total Registered Branches',
        value: data?.data.branch_count || 0,
        icon: BuildingOfficeIcon,
        color: 'gray',
        loading: isLoading,
      },
      {
        title: 'Total Departments',
        value: data?.data.department_count || 0,
        icon: WarehouseIcon,
        color: 't-purple',
        loading: isLoading,
      },
      {
        title: 'Total Teams',
        value: data?.data.team_count || 0,
        icon: UsersThreeIcon,
        color: 'dark',
        loading: isLoading,
      },
    ]
  }, [data])
  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat, index) => (
        <TamsStatsCard
          fontSize={40}
          isFullWidth
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          loading={stat.loading}
        />
      ))}
    </div>
  )
}

export default OrgEmployeeStatsCount
