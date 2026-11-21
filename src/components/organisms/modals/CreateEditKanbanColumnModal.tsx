import { TamsButton, TamsModal2, TamsTextInput } from '#/components/atoms'
import {
  useCreateProjectKanbanStatus,
  useUpdateProjectKanbanStatus,
} from '#/lib'
import type { TFetchProjectKanbanStatuses } from '#/lib/types/api/performance'
import { useEffect, useState } from 'react'

const CreateEditKanbanColumnModal = ({
  opened,
  onClose,
  projectId,
  column,
}: {
  opened: boolean
  onClose: () => void
  projectId: number
  column?: TFetchProjectKanbanStatuses | null
}) => {
  const [name, setName] = useState('')
  const createMutation = useCreateProjectKanbanStatus()
  const updateMutation = useUpdateProjectKanbanStatus()

  useEffect(() => {
    setName(opened ? (column?.name ?? '') : '')
  }, [opened, column])

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    if (column) {
      await updateMutation.mutateAsync({
        id: column.id,
        name: trimmedName,
        project_id: projectId,
      })
    } else {
      await createMutation.mutateAsync({
        name: trimmedName,
        project_id: projectId,
      })
    }

    onClose()
  }

  const loading = createMutation.isPending || updateMutation.isPending

  return (
    <TamsModal2
      opened={opened}
      onClose={onClose}
      title={column ? 'Edit Task Column' : 'Add Task Column'}
      centered
      size="sm"
    >
      <div className="px-6 pb-6 space-y-4">
        <TamsTextInput
          label="Column name"
          placeholder="e.g. In review"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          required
        />
        <div className="flex justify-end gap-2">
          <TamsButton variant="default" radius="xl" onClick={onClose}>
            Cancel
          </TamsButton>
          <TamsButton
            radius="xl"
            loading={loading}
            disabled={!name.trim()}
            onClick={handleSubmit}
          >
            {column ? 'Update' : 'Create'}
          </TamsButton>
        </div>
      </div>
    </TamsModal2>
  )
}

export default CreateEditKanbanColumnModal
