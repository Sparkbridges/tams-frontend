import { useEffect, useState } from 'react'
import { Alert, Group, Skeleton, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Link, useNavigate } from '@tanstack/react-router'
import { TamsButton, TamsTable } from '#/components/atoms'
import {
  useAssignWorkshift,
  useWorkshift,
  useWorkshiftAccess,
} from '#/lib/api/services/workshift'
import { workshiftAssignmentSchema } from '#/lib/utils/schema/workshift.schema'
import type { ShiftAssignment } from '#/lib/types/api/workshift'
import ShiftRecipients from './ShiftRecipients'
import type { RecipientOption, ShiftRecipientsValue } from './ShiftRecipients'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'

type DraftAssignment = Pick<
  ShiftAssignment,
  'type' | 'type_id' | 'type_name' | 'branch_id'
>
export default function AttendanceWorkshiftAssignments({ id }: { id: number }) {
  const access = useWorkshiftAccess()
  const query = useWorkshift(id)
  const mutation = useAssignWorkshift()
  const navigate = useNavigate()
  const [recipients, setRecipients] = useState<ShiftRecipientsValue>({
    type: 'employee',
    ids: [],
    branchId: null,
  })
  const [options, setOptions] = useState<RecipientOption[]>([])
  const form = useForm<{ assignables: DraftAssignment[] }>({
    initialValues: { assignables: [] },
  })
  useEffect(() => {
    if (query.data && !form.initialized)
      form.initialize({ assignables: query.data.data.assignables })
  }, [query.data, form])
  if (!access.canView || !access.canAssign) return <AttendanceAccessDenied />
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
        <Stack>
          <Alert color="blue">
            Assignments apply to the selected groups or individuals. Saving
            replaces this shift's assignment list. To remove the last
            assignment, use Unassign on the details page.
          </Alert>
          <Alert color="yellow">
            Branch department selections are applied to current eligible
            employees as individual assignments. Reapply after new hires or
            transfers. Individual assignments take priority over department and
            branch routines.
          </Alert>
          <ShiftRecipients
            value={recipients}
            onChange={setRecipients}
            onOptions={setOptions}
            companyHqOnly
          />
          <TamsButton
            variant="outline"
            disabled={!recipients.ids.length || mutation.isPending}
            onClick={() => {
              const additions = recipients.ids.map((type_id) => ({
                type: recipients.type,
                ...(recipients.type === 'department' && recipients.branchId
                  ? { branch_id: Number(recipients.branchId) }
                  : {}),
                type_id: Number(type_id),
                type_name:
                  options.find((option) => option.value === type_id)?.label ??
                  type_id,
              }))
              form.setFieldValue('assignables', [
                ...form.values.assignables,
                ...additions.filter(
                  (item) =>
                    !form.values.assignables.some(
                      (existing) =>
                        existing.type === item.type &&
                        existing.type_id === item.type_id &&
                        existing.branch_id === item.branch_id,
                    ),
                ),
              ])
              form.clearErrors()
            }}
          >
            Add selected recipients
          </TamsButton>
          {form.errors.assignables && (
            <Text c="red" role="alert">
              {form.errors.assignables}
            </Text>
          )}
          <TamsTable
            columns={[
              { label: 'Type', accessor: 'type' },
              { label: 'Name', accessor: 'name' },
              {
                label: 'Actions',
                accessor: 'actions',
                render: (row) => (
                  <TamsButton
                    variant="subtle"
                    color="red"
                    disabled={mutation.isPending}
                    onClick={() =>
                      form.setFieldValue(
                        'assignables',
                        form.values.assignables.filter(
                          (item) =>
                            `${item.type}:${item.type_id}:${item.branch_id ?? ''}` !==
                            row.id,
                        ),
                      )
                    }
                  >
                    Remove from list
                  </TamsButton>
                ),
              },
            ]}
            data={form.values.assignables.map((item) => ({
              id: `${item.type}:${item.type_id}:${item.branch_id ?? ''}`,
              type: item.type,
              name: item.branch_id
                ? `${item.type_name} (branch #${item.branch_id}, current employees)`
                : item.type_name,
            }))}
            page={1}
            disablePagination
            disableSearch
          />
          <Group justify="flex-end">
            <Link to="/admin-dashboard/attendance/workshift">Cancel</Link>
            <TamsButton
              loading={mutation.isPending}
              onClick={() => {
                const parsed = workshiftAssignmentSchema.safeParse({
                  regular_shift_id: id,
                  assignables: form.values.assignables.map(
                    ({ type, type_id, branch_id }) => ({
                      type,
                      type_id,
                      ...(branch_id ? { branch_id } : {}),
                    }),
                  ),
                })
                if (!parsed.success) {
                  form.setFieldError(
                    'assignables',
                    parsed.error.issues[0].message,
                  )
                  return
                }
                if (!mutation.isPending)
                  mutation.mutate(parsed.data, {
                    onSuccess: () => {
                      void navigate({
                        to: '/admin-dashboard/attendance/workshift',
                      })
                    },
                  })
              }}
            >
              Save assignments
            </TamsButton>
          </Group>
        </Stack>
      )}
    </AttendanceWorkshiftsLayout>
  )
}
