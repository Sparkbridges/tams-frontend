import { TamsAvatar, TamsSpinner } from '#/components'
import { TamsGoBackNavigation } from '#/components/molecules'
import { documentHelper, useFetchOrganizationAllEmployeeDetails } from '#/lib'
import { newDayjs } from '#/lib/utils'
import {
  ActionIcon,
  Badge,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  BuildingOfficeIcon,
  CalendarBlankIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  HashIcon,
  MapPinIcon,
  NoteIcon,
  PhoneIcon,
  UserIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/employees/details/$id',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Employee Details | Tams',
      content: 'Organization Employee Details Page',
      name: 'description',
    }),
})

const formatValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '')
    return 'Not provided'
  return value.toString()
}

const formatDate = (value?: string | number | null) => {
  if (!value) return 'Not provided'

  const date = newDayjs(value as string)
  if (!date.isValid()) return value.toString()

  return date.format('MMMM D, YYYY')
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <Group gap="sm" align="flex-start" wrap="nowrap">
    <ThemeIcon variant="light" size="lg" radius="md" color="blue">
      {icon}
    </ThemeIcon>
    <Stack gap={2}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.4}>
        {label}
      </Text>
      <Text size="sm" fw={500} c="gray.8">
        {value}
      </Text>
    </Stack>
  </Group>
)

function RouteComponent() {
  const { id } = Route.useParams()
  const {
    data: employee,
    isLoading,
    isError,
  } = useFetchOrganizationAllEmployeeDetails(
    { id: Number(id) },
    (data) => data.data,
  )

  const fullName = employee
    ? `${employee.first_name} ${employee.last_name}`.trim()
    : ''

  return (
    <main className="space-y-4 px-7">
      <TamsGoBackNavigation label="Back to Employees" />

      {isLoading ? (
        <Stack align="center" justify="center" h={300} gap="sm">
          <TamsSpinner size="lg" />
        </Stack>
      ) : isError || !employee ? (
        <Stack align="center" justify="center" h={300} gap="sm">
          <Text fw={600}>Unable to load employee details</Text>
          <Text size="sm" c="dimmed">
            Please try again or select another employee.
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg">
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Group align="flex-start" gap="md">
                <TamsAvatar
                  name={fullName}
                  color="initials"
                  size={80}
                  radius="xl"
                />
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                    Employee profile
                  </Text>
                  <Title order={3} fw={700} c="gray.8">
                    {fullName || 'Not provided'}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {formatValue(
                      employee.employee_designation?.designation_name,
                    )}
                    {' · '}
                    {formatValue(employee.department?.department_name)}
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge
                  color={employee.is_active ? 'green' : 'gray'}
                  variant="light"
                  radius="sm"
                  size="lg"
                >
                  {employee.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge color="blue" variant="light" radius="sm" size="lg">
                  PIN #{formatValue(employee.pin)}
                </Badge>
              </Group>
            </Group>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Branch
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(employee.branch?.station_name)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Department
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(employee.department?.department_name)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Custom ID
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(employee.custom_employee_id)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Joined
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatDate(employee.appointment_date)}
                </Text>
              </Paper>
            </SimpleGrid>
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Paper withBorder radius="lg" p="lg" bg="white">
              <Group gap="xs" mb="md">
                <ActionIcon variant="light" color="blue" radius="md">
                  <UserIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Personal information
                </Text>
              </Group>

              <Stack gap="md">
                <DetailRow
                  icon={<UserIcon size={16} />}
                  label="Gender"
                  value={formatValue(employee.gender)}
                />
                <DetailRow
                  icon={<CalendarBlankIcon size={16} />}
                  label="Date of birth"
                  value={formatDate(employee.date_of_birth)}
                />
                <DetailRow
                  icon={<GlobeIcon size={16} />}
                  label="Nationality"
                  value={formatValue(employee.nationality)}
                />
                <DetailRow
                  icon={<NoteIcon size={16} />}
                  label="Blood group"
                  value={formatValue(employee.blood_group)}
                />
                <DetailRow
                  icon={<NoteIcon size={16} />}
                  label="Genotype"
                  value={formatValue(employee.genotype)}
                />
                <DetailRow
                  icon={<UsersThreeIcon size={16} />}
                  label="Marital status"
                  value={formatValue(employee.marital_status)}
                />
              </Stack>
            </Paper>

            <Paper withBorder radius="lg" p="lg" bg="white">
              <Group gap="xs" mb="md">
                <ActionIcon variant="light" color="green" radius="md">
                  <PhoneIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Contact information
                </Text>
              </Group>

              <Stack gap="md">
                <DetailRow
                  icon={<EnvelopeSimpleIcon size={16} />}
                  label="Email"
                  value={formatValue(employee.email)}
                />
                <DetailRow
                  icon={<PhoneIcon size={16} />}
                  label="Mobile number"
                  value={formatValue(employee.mobile_number)}
                />
                <DetailRow
                  icon={<PhoneIcon size={16} />}
                  label="Alternate number"
                  value={formatValue(employee.alt_mobile_number)}
                />
                <DetailRow
                  icon={<MapPinIcon size={16} />}
                  label="Address"
                  value={formatValue(employee.address)}
                />
                <DetailRow
                  icon={<MapPinIcon size={16} />}
                  label="Location"
                  value={`${formatValue(employee.city)}, ${formatValue(employee.state)} · ${formatValue(employee.country)}`}
                />
              </Stack>
            </Paper>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Paper withBorder radius="lg" p="lg" bg="white">
              <Group gap="xs" mb="md">
                <ActionIcon variant="light" color="grape" radius="md">
                  <BuildingOfficeIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Employment details
                </Text>
              </Group>

              <Stack gap="md">
                <DetailRow
                  icon={<BuildingOfficeIcon size={16} />}
                  label="Branch"
                  value={formatValue(employee.branch?.station_name)}
                />
                <DetailRow
                  icon={<UsersThreeIcon size={16} />}
                  label="Department"
                  value={formatValue(employee.department?.department_name)}
                />
                <DetailRow
                  icon={<HashIcon size={16} />}
                  label="Employee PIN"
                  value={formatValue(employee.pin)}
                />
                <DetailRow
                  icon={<UserIcon size={16} />}
                  label="Designation"
                  value={formatValue(
                    employee.employee_designation?.designation_name,
                  )}
                />
                <DetailRow
                  icon={<CalendarBlankIcon size={16} />}
                  label="Appointment date"
                  value={formatDate(employee.appointment_date)}
                />

                {employee.roles?.length > 0 && (
                  <Stack gap={6}>
                    <Text
                      size="xs"
                      c="dimmed"
                      fw={600}
                      tt="uppercase"
                      lts={0.4}
                    >
                      Roles
                    </Text>
                    <Group gap="xs">
                      {employee.roles.map((role) => (
                        <Badge
                          key={role.id}
                          color="blue"
                          variant="light"
                          radius="sm"
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Paper>

            <Paper withBorder radius="lg" p="lg" bg="white">
              <Group gap="xs" mb="md">
                <ActionIcon variant="light" color="teal" radius="md">
                  <NoteIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Bank details
                </Text>
              </Group>

              <Stack gap="md">
                <DetailRow
                  icon={<UserIcon size={16} />}
                  label="Account name"
                  value={formatValue(employee.account_name)}
                />
                <DetailRow
                  icon={<HashIcon size={16} />}
                  label="Account number"
                  value={formatValue(employee.account_number)}
                />
                <DetailRow
                  icon={<BuildingOfficeIcon size={16} />}
                  label="Bank name"
                  value={formatValue(employee.bank_name)}
                />
                <DetailRow
                  icon={<HashIcon size={16} />}
                  label="Bank code"
                  value={formatValue(employee.bank_code)}
                />
              </Stack>
            </Paper>
          </SimpleGrid>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md">
              <ActionIcon variant="light" color="red" radius="md">
                <PhoneIcon size={18} />
              </ActionIcon>
              <Text fw={700} size="lg" c="gray.8">
                Emergency contact
              </Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailRow
                icon={<UserIcon size={16} />}
                label="Contact name"
                value={formatValue(employee.emergency_contact_name)}
              />
              <DetailRow
                icon={<UsersThreeIcon size={16} />}
                label="Relationship"
                value={formatValue(employee.emergency_contact_rel)}
              />
              <DetailRow
                icon={<PhoneIcon size={16} />}
                label="Contact number"
                value={formatValue(employee.emergency_contact_no)}
              />
              <DetailRow
                icon={<MapPinIcon size={16} />}
                label="Contact address"
                value={formatValue(employee.emergency_contact_address)}
              />
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md">
              <ActionIcon variant="light" color="orange" radius="md">
                <HashIcon size={18} />
              </ActionIcon>
              <Text fw={700} size="lg" c="gray.8">
                Identification & compliance
              </Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <DetailRow
                icon={<HashIcon size={16} />}
                label="Means of identity"
                value={formatValue(employee.means_of_identity)}
              />
              <DetailRow
                icon={<HashIcon size={16} />}
                label="ID number"
                value={formatValue(employee.id_no)}
              />
              <DetailRow
                icon={<CalendarBlankIcon size={16} />}
                label="ID expiration"
                value={formatDate(employee.id_expiration)}
              />
              <DetailRow
                icon={<HashIcon size={16} />}
                label="TAX ID"
                value={formatValue(employee.tax_id)}
              />
              <DetailRow
                icon={<HashIcon size={16} />}
                label="RSA PIN"
                value={formatValue(employee.rsa_pin)}
              />
              <DetailRow
                icon={<HashIcon size={16} />}
                label="Staff ID"
                value={formatValue(employee.staff_id)}
              />
            </SimpleGrid>
          </Paper>
        </Stack>
      )}
    </main>
  )
}
