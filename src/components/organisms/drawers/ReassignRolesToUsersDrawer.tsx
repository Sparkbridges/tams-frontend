import { TamsButton, TamsDrawer, TamsSelectInput } from '#/components/atoms'
import { useReassignRoleMembers } from '#/lib'
import { Checkbox, Paper } from '@mantine/core'
import { useState } from 'react'

type ReassignRolesToUsersDrawerProps = {
  opened: boolean
  onClose: () => void
  roleOptions?: { label: string; value: string }[]
  members?: { label: string; value: string }[]
  selectedRoleId?: number
}
const ReassignRolesToUsersDrawer = ({
  opened,
  onClose,
  roleOptions,
  members,
  selectedRoleId,
}: ReassignRolesToUsersDrawerProps) => {
  const [value, setValue] = useState<string[]>([])
  const [newRoleId, setNewRoleId] = useState<number | null>(null)

  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: reassignRoleMembersAsync, isPending: isReassigning } =
    useReassignRoleMembers()

  const handleConfirm = async () => {
    try {
      if (!newRoleId) {
        setError('Please select a new role')
        return
      }
      setError(null)
      if (
        selectedRoleId &&
        newRoleId &&
        newRoleId !== selectedRoleId &&
        value.length > 0
      ) {
        await reassignRoleMembersAsync({
          role_id: selectedRoleId,
          user_ids: value.map(Number),
          new_role_id: newRoleId,
        })
        onClose()
      }
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <TamsDrawer
      size={'md'}
      title="Re-assign Roles to Users"
      opened={opened}
      onClose={onClose}
      bodyclassname="px-0 flex flex-col h-[calc(100dvh---spacing(17))] pb-0"
    >
      <section className="py-4 px-4 space-y-2 overflow-y-auto flex-1">
        <TamsSelectInput
          label="Select Role"
          data={roleOptions?.filter(
            (role) => Number(role.value) !== selectedRoleId,
          )}
          value={newRoleId?.toString() || ''}
          onChange={(val) => setNewRoleId(Number(val))}
          error={error}
        />
        <Paper p={'md'}>
          <Checkbox.Group
            label="Select users for reassignment"
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
            !selectedRoleId ||
            !newRoleId ||
            newRoleId === selectedRoleId ||
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

export default ReassignRolesToUsersDrawer
