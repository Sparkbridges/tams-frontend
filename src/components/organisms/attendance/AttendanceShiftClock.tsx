import {
  Alert,
  Group,
  NumberInput,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { useNavigate } from '@tanstack/react-router'
import { TamsButton } from '#/components/atoms'
import {
  useSaveShiftClock,
  useShiftClock,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import { clockSchema } from '#/lib/utils/schema/workshift.schema'
import type { ClockSetting } from '#/lib/types/api/workshift'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'

function ClockEditor({ setting }: { setting: ClockSetting }) {
  const { canSaveClock } = useWorkshiftAccess()
  const mutation = useSaveShiftClock()
  const navigate = useNavigate()
  const form = useForm({
    initialValues: setting.value,
    validate: schemaResolver(clockSchema),
  })
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (!mutation.isPending && canSaveClock)
          mutation.mutate(values, {
            onSuccess: () => {
              void navigate({
                to: '/admin-dashboard/attendance/workshift/settings',
              })
            },
          })
      })}
    >
      <Stack>
        <Alert color="blue">
          These company-wide settings control which clock records can match a
          shift when function keys are ignored. Hours may range from 0 to 30.
        </Alert>
        {setting.default && (
          <Text size="sm">
            Showing service defaults. Saving creates company settings.
          </Text>
        )}
        {(['clock_in', 'clock_out'] as const).map((key) => (
          <Stack key={key}>
            <Text fw={600}>
              {key === 'clock_in' ? 'Clock in' : 'Clock out'}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <NumberInput
                label="Hours before start"
                min={0}
                max={30}
                disabled={!canSaveClock || mutation.isPending}
                {...form.getInputProps(`${key}.hours_before_start`)}
              />
              <NumberInput
                label="Hours after start"
                min={0}
                max={30}
                disabled={!canSaveClock || mutation.isPending}
                {...form.getInputProps(`${key}.hours_after_start`)}
              />
            </SimpleGrid>
          </Stack>
        ))}
        {canSaveClock && (
          <Group justify="flex-end">
            <TamsButton type="submit" loading={mutation.isPending}>
              Save clock settings
            </TamsButton>
          </Group>
        )}
      </Stack>
    </form>
  )
}

export default function AttendanceShiftClock() {
  const { canViewClock } = useWorkshiftAccess()
  const query = useShiftClock()
  if (!canViewClock) return <AttendanceAccessDenied />
  return (
    <AttendanceWorkshiftsLayout>
      {query.isError ? (
        <AttendanceQueryError
          error={query.error}
          retry={() => void query.refetch()}
        />
      ) : query.isLoading ? (
        <Skeleton height={300} />
      ) : (
        query.data && <ClockEditor setting={query.data.data} />
      )}
    </AttendanceWorkshiftsLayout>
  )
}
