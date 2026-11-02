import { useEffect, useState } from 'react'
import { Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TamsMultiSelect, TamsSelectInput } from '#/components/atoms'
import {
  useShiftBranches,
  useShiftDepartments,
  useShiftEmployeeSearch,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import { useTamsStore } from '#/lib/store'
import { AttendanceQueryError } from './AttendanceDevicesLayout'

export type ShiftRecipientsValue = {
  type: 'company' | 'branch' | 'department' | 'employee'
  ids: string[]
  branchId: string | null
}
export type RecipientOption = { value: string; label: string }

export default function ShiftRecipients({
  value,
  onChange,
  onOptions,
  companyHqOnly = false,
  allowedTypes = ['company', 'branch', 'department', 'employee'],
}: {
  value: ShiftRecipientsValue
  onChange: (value: ShiftRecipientsValue) => void
  onOptions?: (options: RecipientOption[]) => void
  companyHqOnly?: boolean
  allowedTypes?: ShiftRecipientsValue['type'][]
}) {
  const user = useTamsStore((state) => state.user)
  const { isHqAdmin } = useWorkshiftAccess()
  const branches = useShiftBranches(
    value.type === 'branch' || value.type === 'department',
  )
  const departments = useShiftDepartments(
    value.type === 'department' ? Number(value.branchId) : 0,
  )
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 300)
  const employees = useShiftEmployeeSearch(
    value.type === 'employee' ? debounced : '',
  )
  const [employeeOptions, setEmployeeOptions] = useState<RecipientOption[]>([])
  useEffect(() => {
    if (employees.data) {
      const found = employees.data.data.map((employee) => ({
        value: String(employee.id),
        label: employee.name,
      }))
      setEmployeeOptions((current) => [
        ...current.filter(
          (option) => !found.some((item) => item.value === option.value),
        ),
        ...found,
      ])
    }
  }, [employees.data])
  const branchOptions =
    branches.data?.data.results.map((branch) => ({
      value: String(branch.id),
      label: branch.station_name,
    })) ?? []
  const departmentOptions =
    departments.data?.data.map((department) => ({
      value: String(department.id),
      label: department.department_name,
    })) ?? []
  const companyOption = {
    value: String(user?.employee.company_id),
    label: user?.employee.company.company_name ?? 'Company',
  }
  const availableOptions =
    value.type === 'company'
      ? [companyOption]
      : value.type === 'branch'
        ? branchOptions
        : value.type === 'department'
          ? departmentOptions
          : employeeOptions
  const options = [
    ...availableOptions,
    ...value.ids
      .filter((id) => !availableOptions.some((option) => option.value === id))
      .map((id) => ({ value: id, label: `ID ${id}` })),
  ]
  useEffect(() => {
    onOptions?.(options)
  }, [
    branches.data,
    departments.data,
    employeeOptions,
    value.type,
    user,
    onOptions,
  ])
  return (
    <Stack>
      <TamsSelectInput
        label="Select employees by"
        value={value.type}
        data={[
          ...(!companyHqOnly || isHqAdmin
            ? [{ value: 'company', label: 'All users' }]
            : []),
          { value: 'branch', label: 'Branch' },
          { value: 'department', label: 'Department' },
          { value: 'employee', label: 'Individuals' },
        ].filter((option) =>
          allowedTypes.some((type) => type === option.value),
        )}
        allowDeselect={false}
        onChange={(type) => {
          if (
            type === 'company' ||
            type === 'branch' ||
            type === 'department' ||
            type === 'employee'
          ) {
            onChange({
              type,
              ids: type === 'company' ? [companyOption.value] : [],
              branchId: null,
            })
          }
        }}
      />
      {branches.isError && (
        <AttendanceQueryError
          error={branches.error}
          retry={() => void branches.refetch()}
        />
      )}
      {departments.isError && (
        <AttendanceQueryError
          error={departments.error}
          retry={() => void departments.refetch()}
        />
      )}
      {employees.isError && (
        <AttendanceQueryError
          error={employees.error}
          retry={() => void employees.refetch()}
        />
      )}
      {value.type === 'department' && (
        <TamsSelectInput
          label="Department branch"
          searchable
          clearable
          data={branchOptions}
          value={value.branchId}
          disabled={branches.isLoading}
          onChange={(branchId) => onChange({ ...value, branchId, ids: [] })}
        />
      )}
      {value.type !== 'company' && (
        <TamsMultiSelect
          label={
            value.type === 'branch'
              ? 'Branches'
              : value.type === 'department'
                ? 'Departments'
                : 'Employees'
          }
          description={
            value.type === 'employee'
              ? 'Type a name to search employees.'
              : undefined
          }
          searchable
          clearable
          data={options}
          value={value.ids}
          disabled={
            (value.type === 'department' &&
              (!value.branchId || departments.isLoading)) ||
            (value.type === 'branch' && branches.isLoading)
          }
          onChange={(ids) => onChange({ ...value, ids })}
          {...(value.type === 'employee'
            ? { searchValue: search, onSearchChange: setSearch }
            : {})}
        />
      )}
      {(employees.isFetching ||
        branches.isLoading ||
        departments.isLoading) && (
        <Text size="sm" role="status">
          Loading recipients...
        </Text>
      )}
    </Stack>
  )
}
