import { useShiftDepartments } from '#/lib/api/services/workshift'
import { useTamsStore } from '#/lib/store'
import {
  Alert,
  Grid,
  Paper,
  Select,
  Skeleton,
  Text,
  Title,
} from '@mantine/core'
import type { ReactNode } from 'react'

export type DashboardScope = { branch: string; department: string }

export function ScopeFilters({
  scope,
  onChange,
}: {
  scope: DashboardScope
  onChange: (scope: DashboardScope) => void
}) {
  const branches = useTamsStore((state) => state.user?.managingBranches)
  const departments = useShiftDepartments(
    scope.branch === 'all' ? 0 : Number(scope.branch),
  )
  return (
    <>
      {departments.isError && (
        <Alert color="red">Unable to load dashboard filter options.</Alert>
      )}
      <Select
        label="Branch"
        value={scope.branch}
        data={[
          { value: 'all', label: 'All branches' },
          ...(branches ?? []).map((branch) => ({
            value: String(branch.id),
            label: branch.station_name,
          })),
        ]}
        onChange={(branch) => branch && onChange({ branch, department: 'all' })}
        allowDeselect={false}
        searchable
      />
      <Select
        label="Department"
        value={scope.department}
        disabled={scope.branch === 'all' || departments.isLoading}
        data={[
          { value: 'all', label: 'All departments' },
          ...(departments.data?.data ?? []).map((department) => ({
            value: String(department.id),
            label: department.department_name,
          })),
        ]}
        onChange={(department) =>
          department && onChange({ ...scope, department })
        }
        allowDeselect={false}
        searchable
      />
    </>
  )
}

export function DashboardPanel({
  title,
  loading,
  error,
  children,
}: {
  title: string
  loading: boolean
  error: boolean
  children: ReactNode
}) {
  return (
    <Paper withBorder radius="md" p="lg" h="100%">
      <Title order={3} size="h4" mb="md">
        {title}
      </Title>
      {loading ? (
        <Skeleton height={180} />
      ) : error ? (
        <Alert color="red">Unable to load {title.toLowerCase()}.</Alert>
      ) : (
        children
      )}
    </Paper>
  )
}

export function DashboardStats({
  items,
}: {
  items: { label: string; value: number | string }[]
}) {
  return (
    <Grid>
      {items.map((item) => (
        <Grid.Col key={item.label} span={{ base: 6, sm: 4, lg: 2.4 }}>
          <Paper withBorder radius="md" p="md" h="100%">
            <Text size="sm" c="dimmed">
              {item.label}
            </Text>
            <Text fw={700} size="xl">
              {item.value}
            </Text>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  )
}
