import { TamsButton, TamsDrawer, TamsSelectInput } from '#/components/atoms'
import { getErrorMessage, useReassignPendingLeaves } from '#/lib'
import { Checkbox, Paper } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'

type DrawerProps = {
  opened: boolean
  onClose: () => void
  roleOptions?: { label: string; value: string }[]
  members?: { label: string; value: string }[]
  selectedId?: number
}
const ReassignLeaveRequestToLeaveTypes = ({
  opened,
  onClose,
  roleOptions,
  members,
  selectedId,
}: DrawerProps) => {
  const [value, setValue] = useState<string[]>([])
  const [newRoleId, setNewRoleId] = useState<number | null>(null)

  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: reassignPendingLeavesAsync, isPending: isReassigning } =
    useReassignPendingLeaves()

  const handleConfirm = async () => {
    try {
      if (!newRoleId) {
        setError('Please select a new role')
        return
      }
      setError(null)
      if (
        selectedId &&
        newRoleId &&
        newRoleId !== selectedId &&
        value.length > 0
      ) {
        await reassignPendingLeavesAsync({
          source_leave_type_id: selectedId,
          leave_ids: value.map(Number),
          target_leave_type_id: newRoleId,
        })
        onClose()
      }
    } catch (e) {
      const errMsgv = getErrorMessage(e)
      console.error(e)
      notifications.show({
        title: 'Error',
        message: errMsgv,
        color: 'red',
      })
    }
  }
  return (
    <TamsDrawer
      size={'md'}
      title="Re-assign Leave Types"
      opened={opened}
      onClose={onClose}
      bodyclassname="px-0 flex flex-col h-[calc(100dvh---spacing(17))] pb-0"
    >
      <section className="py-4 px-4 space-y-2 overflow-y-auto flex-1">
        <TamsSelectInput
          label="Select Leave Type"
          data={roleOptions?.filter(
            (role) => Number(role.value) !== selectedId,
          )}
          value={newRoleId?.toString() || ''}
          onChange={(val) => setNewRoleId(Number(val))}
          error={error}
        />
        <Paper p={'md'}>
          <Checkbox.Group
            label="Select leave requests for reassignment"
            styles={{ label: { marginBottom: '16px' } }}
            value={value}
            onChange={setValue}
          >
            {members?.map((member, index) => (
              <Checkbox
                key={index}
                value={member.value}
                label={member.label}
                className="block mb-2"
              />
            ))}
          </Checkbox.Group>
        </Paper>
      </section>
      <Paper py={'sm'} className="flex items-center gap-4" px={'md'}>
        <TamsButton
          radius="xl"
          size="md"
          onClick={handleConfirm}
          loading={isReassigning}
          disabled={
            !selectedId ||
            !newRoleId ||
            newRoleId === selectedId ||
            value.length === 0
          }
        >
          Confirm
        </TamsButton>
        <TamsButton radius="xl" size="md" color="gray.6" onClick={onClose}>
          Cancel
        </TamsButton>
      </Paper>
    </TamsDrawer>
  )
}

export default ReassignLeaveRequestToLeaveTypes
