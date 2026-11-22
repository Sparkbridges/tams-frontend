import { TamsButton } from '#/components/atoms'
import { useFetchOrganizationDashboardEmployeesPerDepartment } from '#/lib'
import { Badge, Divider, Paper, Progress, Text } from '@mantine/core'
import { useState } from 'react'

const OrgEmployeeCountByDepartments = () => {
  const [expanded, setExpanded] = useState(false)
  const { data } = useFetchOrganizationDashboardEmployeesPerDepartment()
  const departments = expanded
    ? (data?.data ?? [])
    : (data?.data ?? []).slice(0, 3)
  const grandTotal = data?.data?.reduce(
    (total, department) => total + department.total_employees,
    0,
  )

  return (
    <Paper withBorder radius="md" px="lg" py={{ base: 'md', sm: 'xl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg mb-0.5">
            Employee Per Department
          </h2>
          <p className="font-light text-xs text-gray-600">
            Total employees per department
          </p>
        </div>
        <Badge size="sm" variant="light">
          {data?.data.length}
        </Badge>
      </div>
      <Divider my="md" />
      <div className="space-y-4">
        {departments.map((department) => {
          const percentage =
            Number(grandTotal ?? 1) > 0
              ? Math.round(
                  (department.total_employees / Number(grandTotal ?? 1)) * 100,
                )
              : 0

          return (
            <div
              key={department.department_name}
              className="rounded-md border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Text fw={600} truncate>
                      {department.department_name}
                    </Text>
                  </div>
                </div>
                <Text fw={600}>{department.total_employees}</Text>
              </div>
              <Progress
                value={percentage}
                size="sm"
                mt="sm"
                aria-label={`${department.department_name}: ${department.total_employees} employees`}
              />
              <Text size="xs" c="dimmed" mt="xs">
                {department.number_of_active_employees} active ·{' '}
                {department.number_of_inactive_employees} inactive
              </Text>
            </div>
          )
        })}
      </div>
      <Divider my="md" />
      <div className="flex justify-end">
        <TamsButton
          size="xs"
          variant="subtle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'View Less' : 'View All Departments'}
        </TamsButton>
      </div>
    </Paper>
  )
}

export default OrgEmployeeCountByDepartments
