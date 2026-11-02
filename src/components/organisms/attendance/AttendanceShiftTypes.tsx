import { useState } from 'react'
import {
  Alert,
  ColorInput,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { TamsButton, TamsTextInput } from '#/components/atoms'
import { TamsActionWidget, TamsConfirmation } from '#/components/molecules'
import {
  useDeleteShiftType,
  useSaveShiftTypes,
  useShiftTypes,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import type { ShiftType } from '#/lib/types/api/workshift'
import { shiftTypesSchema } from '#/lib/utils/schema/workshift.schema'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'

function ShiftTypesEditor({ types }: { types: ShiftType[] }) {
  const access = useWorkshiftAccess()
  const save = useSaveShiftTypes()
  const remove = useDeleteShiftType()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState<ShiftType | null>(null)
  const form = useForm({
    initialValues: {
      shift_types: types.map((type) => ({ ...type, key: randomId() })),
    },
    validate: schemaResolver(shiftTypesSchema),
  })
  const pending = save.isPending || remove.isPending
  const handleSubmit = form.onSubmit((values) => {
    if (pending || !access.canSaveTypes) return
    const payload = shiftTypesSchema.parse(values)
    save.mutate(payload, {
      onSuccess: () => {
        form.setInitialValues(values)
        form.resetDirty(values)
        void navigate({
          to: '/admin-dashboard/attendance/workshift/settings',
        })
      },
    })
  })
  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {access.canSaveTypes && (
          <Group justify="flex-end">
            <TamsButton
              variant="outline"
              disabled={pending}
              onClick={() =>
                form.insertListItem('shift_types', {
                  key: randomId(),
                  name: '',
                  day_span: 1,
                  shift_start: '09:00:00',
                  shift_end: '17:00:00',
                  color_code: '#066aff',
                })
              }
            >
              Add shift type
            </TamsButton>
          </Group>
        )}
        {form.values.shift_types.length === 0 && (
          <Alert color="blue">No shift types have been created.</Alert>
        )}
        {form.values.shift_types.map((type, index) => (
          <Paper key={type.key} withBorder p="lg">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              <TamsTextInput
                label="Shift name"
                withAsterisk
                disabled={!access.canSaveTypes || pending}
                {...form.getInputProps(`shift_types.${index}.name`)}
              />
              <NumberInput
                label="Duration (days)"
                min={1}
                max={14}
                allowDecimal={false}
                withAsterisk
                disabled={!access.canSaveTypes || pending}
                {...form.getInputProps(`shift_types.${index}.day_span`)}
              />
              <TamsTextInput
                label="Shift start"
                type="time"
                step={1}
                withAsterisk
                disabled={!access.canSaveTypes || pending}
                {...form.getInputProps(`shift_types.${index}.shift_start`)}
              />
              <TamsTextInput
                label="Shift end"
                type="time"
                step={1}
                withAsterisk
                disabled={!access.canSaveTypes || pending}
                {...form.getInputProps(`shift_types.${index}.shift_end`)}
              />
              <ColorInput
                label="Color"
                format="hex"
                disabled={!access.canSaveTypes || pending}
                {...form.getInputProps(`shift_types.${index}.color_code`)}
              />
              <Group align="end">
                {(type.id === undefined
                  ? access.canSaveTypes
                  : access.canDeleteTypes) && (
                  <TamsButton
                    variant="subtle"
                    color="red"
                    disabled={pending}
                    onClick={() => {
                      if (type.id !== undefined) setDeleting(type)
                      else form.removeListItem('shift_types', index)
                    }}
                  >
                    {type.id === undefined
                      ? 'Remove new row'
                      : 'Delete shift type'}
                  </TamsButton>
                )}
              </Group>
            </SimpleGrid>
          </Paper>
        ))}
        <TamsActionWidget
          title="Unsaved changes to Shift types"
          opened={access.canSaveTypes && form.isDirty()}
          loading={pending}
          onConfirm={handleSubmit}
          onCancel={() => {
            if (!pending) form.reset()
          }}
        />
        <TamsConfirmation
          opened={deleting !== null}
          title="Delete shift type"
          isCritical
          message={`Delete "${deleting?.name ?? ''}"? Existing shifts may depend on this type. This cannot be undone.`}
          loading={remove.isPending}
          onClose={() => {
            if (!remove.isPending) setDeleting(null)
          }}
          onConfirm={() => {
            if (deleting?.id !== undefined && !remove.isPending)
              remove.mutate(deleting.id, {
                onSuccess: () => {
                  const initialValues = {
                    shift_types: form
                      .getInitialValues()
                      .shift_types.filter((type) => type.id !== deleting.id),
                  }
                  form.setInitialValues(initialValues)
                  form.resetDirty(initialValues)
                  form.setFieldValue(
                    'shift_types',
                    form.values.shift_types.filter(
                      (type) => type.id !== deleting.id,
                    ),
                  )
                  setDeleting(null)
                },
              })
          }}
        />
      </Stack>
    </form>
  )
}

export default function AttendanceShiftTypes() {
  const { canViewTypes } = useWorkshiftAccess()
  const query = useShiftTypes()
  if (!canViewTypes) return <AttendanceAccessDenied />
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
        query.data && (
          <>
            {query.data.data
              .filter((type) => type.is_system)
              .map((type) => (
                <Alert key={type.id} color="blue">
                  {type.name} is a system shift type and cannot be edited or
                  deleted.
                </Alert>
              ))}
            <ShiftTypesEditor
              types={query.data.data.filter((type) => !type.is_system)}
            />
          </>
        )
      )}
    </AttendanceWorkshiftsLayout>
  )
}
