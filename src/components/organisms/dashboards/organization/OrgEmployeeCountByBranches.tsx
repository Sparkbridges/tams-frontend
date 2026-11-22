import { TamsButton } from '#/components/atoms'
import { useFetchOrganizationDashboardEmployeesPerBranch } from '#/lib'
import { Badge, Divider, Paper, Progress, Text } from '@mantine/core'
import { useState } from 'react'

const OrgEmployeeCountByBranches = () => {
  const [expanded, setExpanded] = useState(false)
  const { data } = useFetchOrganizationDashboardEmployeesPerBranch()
  const branches = expanded
    ? (data?.data ?? [])
    : (data?.data ?? []).slice(0, 3)
  const grandTotal = branches.reduce(
    (total, branch) => total + branch.total_employees,
    0,
  )

  return (
    <Paper withBorder radius="md" px="lg" py={{ base: 'md', sm: 'xl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg mb-0.5">
            Employee Per Branch / Location
          </h2>
          <p className="font-light text-xs text-gray-600">
            Total employees per branch
          </p>
        </div>
        <Badge size="sm" variant="light">
          {data?.data.length}
        </Badge>
      </div>
      <Divider my="md" />
      <div className="space-y-4">
        {branches.map((branch) => {
          const percentage =
            grandTotal > 0
              ? Math.round((branch.total_employees / grandTotal) * 100)
              : 0

          return (
            <div
              key={branch.station_name}
              className="rounded-md border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Text fw={600} truncate>
                      {branch.station_name}
                    </Text>
                    {branch.is_station_head && (
                      <Badge size="sm" variant="light">
                        Headquarters
                      </Badge>
                    )}
                  </div>
                  <Text size="sm" c="dimmed">
                    {branch.station_head
                      ? `Branch head: ${branch.station_head}`
                      : 'No branch head assigned'}
                  </Text>
                </div>
                <Text fw={600}>{branch.total_employees}</Text>
              </div>
              <Progress
                value={percentage}
                size="sm"
                mt="sm"
                aria-label={`${branch.station_name}: ${branch.total_employees} employees`}
              />
              <Text size="xs" c="dimmed" mt="xs">
                {branch.number_of_active_employees} active ·{' '}
                {branch.number_of_inactive_employees} inactive
              </Text>
            </div>
          )
        })}
      </div>
      <Divider my="md" />
      <div className="flex justify-end">
        {Number(data?.data.length ?? 1) > 3 && (
          <TamsButton variant="subtle" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show Less' : 'Show More'}
          </TamsButton>
        )}
      </div>
    </Paper>
  )
}

export default OrgEmployeeCountByBranches
