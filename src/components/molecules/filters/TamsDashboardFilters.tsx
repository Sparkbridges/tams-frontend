import { TamsSelectInput } from '#/components/atoms'
import {
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
} from '#/lib'
import type { TDashboardFilters } from '#/lib'
import { YearPickerInput } from '@mantine/dates'
import { BuildingOfficeIcon, CalendarBlankIcon } from '@phosphor-icons/react'

type TamsDashboardFiltersProps = {
  onFilterChange?: (filters: TDashboardFilters) => void
  filters: TDashboardFilters
}

const TamsDashboardFilters = ({
  onFilterChange,
  filters,
}: TamsDashboardFiltersProps) => {
  const { data: branchesData } = useFetchOrganizationBranches(
    undefined,
    (data) => {
      const branches = data?.data.results?.map((branch) => ({
        value: branch.id.toString(),
        label: branch.station_name,
      }))
      return [{ value: 'all', label: 'All Branches' }, ...branches]
    },
  )

  const { data: departments } = useFetchOrganizationDepartments(
    undefined,
    (data) => data.data.results,
  )

  const departmentsData = departments
    ?.filter((dept) => dept.station_id === Number(filters?.branch))
    .map((department) => ({
      value: department.id.toString(),
      label: department.department_name,
    }))
  return (
    <div className="flex flex-wrap gap-4">
      <YearPickerInput
        clearable
        value={filters?.reporting_period}
        onChange={(value) =>
          onFilterChange?.({ ...filters, reporting_period: value })
        }
        label="Reporting Period"
        size="xs"
        leftSection={<CalendarBlankIcon />}
      />
      <TamsSelectInput
        leftSection={<BuildingOfficeIcon />}
        label="Branch"
        data={branchesData}
        size="xs"
        value={filters?.branch}
        onChange={(value) =>
          onFilterChange?.({ ...filters, branch: value as string })
        }
      />
      <TamsSelectInput
        disabled={
          filters?.branch === 'all' ||
          !departmentsData ||
          departmentsData.length === 0
        }
        leftSection={<BuildingOfficeIcon />}
        label="Department"
        data={departmentsData}
        size="xs"
        value={filters?.department}
        onChange={(value) =>
          onFilterChange?.({ ...filters, department: value as string })
        }
      />
    </div>
  )
}

export default TamsDashboardFilters
