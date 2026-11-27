import { Link } from '@tanstack/react-router'
import {
  Alert,
  Badge,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import { useGetPageHeader } from '#/lib'
import { useRecruitmentDashboard } from '#/lib/api/services/recruitmentDashboard'
import { DashboardPanel } from './DashboardCommon'

const linkClass = 'text-blue-600 hover:underline font-semibold text-sm'

function Retry({ onRetry }: { onRetry: () => void }) {
  return (
    <Button variant="light" size="xs" mt="sm" onClick={onRetry}>
      Retry
    </Button>
  )
}

export default function RecruitmentDashboard() {
  const { pageHeader } = useGetPageHeader({ key: 'recruitment' })
  const { access, pendingRequests, activeJobs, applications } =
    useRecruitmentDashboard()
  const anyAccess =
    access.canViewApplicants ||
    access.canViewJobPostings ||
    access.canViewTalentRequests
  const stats = applications.data?.data
  const stages = stats
    ? [
        {
          label: 'Pending',
          value: Number(stats.pending_applications ?? 0),
          color: 'blue',
        },
        {
          label: 'Shortlisted',
          value: Number(stats.shortlisted_applications ?? 0),
          color: 'violet',
        },
        {
          label: 'Hired',
          value: Number(stats.completed_applications ?? 0),
          color: 'green',
        },
        {
          label: 'Rejected',
          value: Number(stats.rejected_applications ?? 0),
          color: 'red',
        },
      ]
    : []
  const rawTotal = stats?.total_applications
  const total = Number(rawTotal)
  const invalidTotal =
    !!stats &&
    ((typeof rawTotal !== 'number' && typeof rawTotal !== 'string') ||
      (typeof rawTotal === 'string' && rawTotal.trim() === '') ||
      !Number.isSafeInteger(total) ||
      total < 0)
  const applicationsError = applications.isError || invalidTotal

  return (
    <main>
      <Paper withBorder p="md" radius="md" mb="md">
        {pageHeader()}
        <Divider my="md" />
        <Text size="sm" c="dimmed">
          All-time overview for your managed branches. Application stages
          reflect current status, not historical events.
        </Text>
      </Paper>
      {!anyAccess && (
        <Alert color="red">
          You do not have permission to view recruitment data.
        </Alert>
      )}
      {anyAccess && (
        <Stack>
          <Grid>
            {access.canViewJobPostings && (
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DashboardPanel
                  title="Active job postings"
                  loading={activeJobs.isLoading}
                  error={activeJobs.isError}
                >
                  <Text fw={700} size="xl">
                    {activeJobs.data?.data.total}
                  </Text>
                  <Text size="sm" c="dimmed" mb="sm">
                    Published, non-archived jobs
                  </Text>
                  <Link
                    className={linkClass}
                    to="/admin-dashboard/recruitment/job-postings"
                  >
                    View job postings
                  </Link>
                </DashboardPanel>
                {activeJobs.isError && (
                  <Retry onRetry={() => activeJobs.refetch()} />
                )}
              </Grid.Col>
            )}
            {access.canViewTalentRequests && (
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DashboardPanel
                  title="Requests awaiting approval"
                  loading={pendingRequests.isLoading}
                  error={pendingRequests.isError}
                >
                  <Text fw={700} size="xl">
                    {pendingRequests.data?.data.total}
                  </Text>
                  <Text size="sm" c="dimmed" mb="sm">
                    Pending talent requisitions
                  </Text>
                  <Link
                    className={linkClass}
                    to="/admin-dashboard/recruitment/talent-requisition"
                  >
                    View talent requests
                  </Link>
                </DashboardPanel>
                {pendingRequests.isError && (
                  <Retry onRetry={() => pendingRequests.refetch()} />
                )}
              </Grid.Col>
            )}
            {access.canViewApplicants && (
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DashboardPanel
                  title="Applications"
                  loading={applications.isLoading}
                  error={applicationsError}
                >
                  <Text fw={700} size="xl">
                    {stats ? total : null}
                  </Text>
                  <Text size="sm" c="dimmed" mb="sm">
                    Applications received across jobs
                  </Text>
                  <Link
                    className={linkClass}
                    to="/admin-dashboard/recruitment/ats"
                  >
                    Open applicant tracking
                  </Link>
                </DashboardPanel>
                {applications.isError && (
                  <Retry onRetry={() => applications.refetch()} />
                )}
                {invalidTotal && (
                  <Alert color="red" mt="sm">
                    Application totals are unavailable. Update the backend
                    recruitment analytics endpoint and retry.
                    <Retry onRetry={() => applications.refetch()} />
                  </Alert>
                )}
              </Grid.Col>
            )}
          </Grid>
          <Grid>
            {access.canViewApplicants && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DashboardPanel
                  title="Applicant pipeline"
                  loading={applications.isLoading}
                  error={applicationsError}
                >
                  <Text size="sm" c="dimmed" mb="md">
                    Current application statuses, including applications on
                    archived jobs. Shortlisted does not necessarily mean an
                    interview is scheduled.
                  </Text>
                  {stats && (
                    <>
                      {total === 0 && (
                        <Text c="dimmed" mb="md">
                          No applications received yet.
                        </Text>
                      )}
                      <Stack>
                        {stages.map((stage) => (
                          <div key={stage.label}>
                            <Group justify="space-between" mb={4}>
                              <Text size="sm">{stage.label}</Text>
                              <Text size="sm" fw={700}>
                                {stage.value}
                              </Text>
                            </Group>
                            <Progress
                              value={total ? (stage.value / total) * 100 : 0}
                              color={stage.color}
                            />
                          </div>
                        ))}
                      </Stack>
                    </>
                  )}
                </DashboardPanel>
                {applications.isError && (
                  <Retry onRetry={() => applications.refetch()} />
                )}
              </Grid.Col>
            )}
            {access.canViewTalentRequests && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DashboardPanel
                  title="Recent pending requests"
                  loading={pendingRequests.isLoading}
                  error={pendingRequests.isError}
                >
                  <Text size="sm" c="dimmed" mb="md">
                    The five most recently created requests awaiting approval.
                  </Text>
                  {pendingRequests.data &&
                    (pendingRequests.data.data.results.length === 0 ? (
                      <Text c="dimmed">No pending talent requests.</Text>
                    ) : (
                      <Table.ScrollContainer minWidth={360}>
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Role</Table.Th>
                              <Table.Th>Department</Table.Th>
                              <Table.Th>Requested</Table.Th>
                              <Table.Th>Status</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {pendingRequests.data.data.results.map(
                              (request) => (
                                <Table.Tr key={request.id}>
                                  <Table.Td>{request.role}</Table.Td>
                                  <Table.Td>
                                    {request.department?.department_name ||
                                      'Not specified'}
                                  </Table.Td>
                                  <Table.Td>
                                    {request.created_at?.slice(0, 10) ||
                                      'Not provided'}
                                  </Table.Td>
                                  <Table.Td>
                                    <Badge color="orange">Pending</Badge>
                                  </Table.Td>
                                </Table.Tr>
                              ),
                            )}
                          </Table.Tbody>
                        </Table>
                      </Table.ScrollContainer>
                    ))}
                  <Group mt="md">
                    <Link
                      className={linkClass}
                      to="/admin-dashboard/recruitment/talent-requisition"
                    >
                      Manage requests
                    </Link>
                  </Group>
                </DashboardPanel>
                {pendingRequests.isError && (
                  <Retry onRetry={() => pendingRequests.refetch()} />
                )}
              </Grid.Col>
            )}
          </Grid>
        </Stack>
      )}
    </main>
  )
}
