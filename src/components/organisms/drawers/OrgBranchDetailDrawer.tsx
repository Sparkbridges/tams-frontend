import { TamsSpinner } from '#/components/atoms'
import { TamsDrawer } from '#/components/atoms/drawer'
import { useFetchOrganizationBranchDetails } from '#/lib'
import type { TGetBranchDetails } from '#/lib/types'
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
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'

type Props = {
  opened: boolean
  onClose: () => void
  selectedId: number | string
}

const formatValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '')
    return 'Not provided'
  return value.toString()
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Not provided'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date)
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

const OrgBranchDetailDrawer = ({ opened, onClose, selectedId }: Props) => {
  const {
    data: branchDetails,
    isLoading: isLoadingBranchDetails,
    isError,
  } = useFetchOrganizationBranchDetails<TGetBranchDetails>(
    {
      branch_id: Number(selectedId),
    },
    (data) => data.data,
  )

  return (
    <TamsDrawer
      title="Branch Details"
      size={'lg'}
      opened={opened}
      onClose={onClose}
    >
      {isLoadingBranchDetails ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <TamsSpinner size="md" />
        </Stack>
      ) : isError || !branchDetails ? (
        <Stack align="center" justify="center" h={260} gap="sm">
          <Text fw={600}>Unable to load branch details</Text>
          <Text size="sm" c="dimmed">
            Please try again or select another branch.
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg" p="lg">
          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.6}>
                  Organization branch
                </Text>
                <Title order={3} fw={700} c="gray.8">
                  {branchDetails.station_name}
                </Title>
              </Stack>

              <Group gap="xs">
                {branchDetails.is_hq === 1 && (
                  <Badge color="blue" variant="light" radius="sm" size="lg">
                    Headquarters
                  </Badge>
                )}
                <Badge color="gray" variant="light" radius="sm" size="lg">
                  {branchDetails.branch_type || 'Branch'}
                </Badge>
              </Group>
            </Group>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Branch head
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(branchDetails.branch_head_name)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Parent branch
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatValue(branchDetails.parent_branch)}
                </Text>
              </Paper>

              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  Last updated
                </Text>
                <Text mt={6} fw={600} c="gray.8">
                  {formatDate(branchDetails.updated_at)}
                </Text>
              </Paper>
            </SimpleGrid>
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Paper withBorder radius="lg" p="lg" bg="white">
              <Group gap="xs" mb="md">
                <ActionIcon variant="light" color="blue" radius="md">
                  <BuildingOfficeIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Branch profile
                </Text>
              </Group>

              <Stack gap="md">
                <DetailRow
                  icon={<UserIcon size={16} />}
                  label="Branch head"
                  value={formatValue(branchDetails.branch_head_name)}
                />
                <DetailRow
                  icon={<UsersThreeIcon size={16} />}
                  label="HR manager"
                  value={formatValue(branchDetails.branch_hr_manager_name)}
                />
                <DetailRow
                  icon={<BuildingOfficeIcon size={16} />}
                  label="Account manager"
                  value={formatValue(branchDetails.branch_account_manager_name)}
                />
                <DetailRow
                  icon={<CalendarBlankIcon size={16} />}
                  label="Created"
                  value={formatDate(branchDetails.created_at)}
                />
              </Stack>
            </Paper>

            <Paper withBorder radius="lg" p="lg" bg="white">
              <Group gap="xs" mb="md">
                <ActionIcon variant="light" color="green" radius="md">
                  <MapPinIcon size={18} />
                </ActionIcon>
                <Text fw={700} size="lg" c="gray.8">
                  Contact & location
                </Text>
              </Group>

              <Stack gap="md">
                <DetailRow
                  icon={<MapPinIcon size={16} />}
                  label="Address"
                  value={formatValue(branchDetails.address)}
                />
                <DetailRow
                  icon={<MapPinIcon size={16} />}
                  label="Location"
                  value={`${formatValue(branchDetails.city)}, ${formatValue(branchDetails.state)} · ${formatValue(branchDetails.country)}`}
                />
                <DetailRow
                  icon={<PhoneIcon size={16} />}
                  label="Primary phone"
                  value={formatValue(branchDetails.branch_phone_no)}
                />
                <DetailRow
                  icon={<PhoneIcon size={16} />}
                  label="Alternate phone"
                  value={formatValue(branchDetails.branch_alt_phone_no)}
                />
              </Stack>
            </Paper>
          </SimpleGrid>

          <Paper withBorder radius="lg" p="lg" bg="white">
            <Group gap="xs" mb="md">
              <ActionIcon variant="light" color="grape" radius="md">
                <EnvelopeSimpleIcon size={18} />
              </ActionIcon>
              <Text fw={700} size="lg" c="gray.8">
                Additional details
              </Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DetailRow
                icon={<EnvelopeSimpleIcon size={16} />}
                label="Email"
                value={formatValue(branchDetails.email)}
              />
              <DetailRow
                icon={<GlobeIcon size={16} />}
                label="Website"
                value={formatValue(branchDetails.website)}
              />
              <DetailRow
                icon={<MapPinIcon size={16} />}
                label="ZIP code"
                value={formatValue(branchDetails.zip_code)}
              />
              <DetailRow
                icon={<BuildingOfficeIcon size={16} />}
                label="Currency"
                value={formatValue(branchDetails.currency_sign)}
              />
            </SimpleGrid>

            <Divider my="md" />

            <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.4}>
              Notes
            </Text>
            <Text mt="xs" size="sm" c="gray.7" lh={1.6}>
              {formatValue(
                branchDetails.additional_info ??
                  branchDetails.other_information,
              )}
            </Text>
          </Paper>
        </Stack>
      )}
    </TamsDrawer>
  )
}

export default OrgBranchDetailDrawer
