import { TamsButton, TamsModal2 } from '#/components/atoms'
import { Tams2ColsForm2, TamsBanner } from '#/components/molecules'
import { useCreateEditKanbanTaskForm } from '#/lib'
import type { TProjectKanbanTask } from '#/lib/types/api/performance'
import { Paper } from '@mantine/core'

const CreateEditKanbanTask = ({
  opened,
  onClose,
  employeesFromTeams,
  projectId,
  task,
}: {
  opened: boolean
  onClose: () => void
  employeesFromTeams: { label: string; value: string }[] | undefined
  projectId: number
  task?: TProjectKanbanTask | null
}) => {
  const { fields, form, isDirty, handleSubmit, loading } =
    useCreateEditKanbanTaskForm({
      type: task ? 'edit' : 'create',
      id: task?.id,
      initialTask: task,
      closeActionWidget: onClose,
      employeesFromTeams,
      projectId,
      opened,
    })

  return (
    <TamsModal2
      opened={opened}
      onClose={onClose}
      title={task ? 'Edit Kanban Task' : 'Add Kanban Task'}
      centered
      size="xl"
      bodyClassName="px-0 pb-0 bg-red-500 flex !flex-col"
    >
      <section className="bg-gray-100 space-y-2 pb-4 overflow-y-auto max-h-150">
        <div className="pl-3.5 py-1.5">
          <p className="text-sm font-light text-pretty">
            Define kanban task parameters, employee applicability for automatic
            assignments.
          </p>
        </div>
        <TamsBanner />
        <div className="px-3.5">
          <Tams2ColsForm2 form={form} fields={fields} />
        </div>
      </section>
      <Paper p="md" className="flex justify-end mt-auto" withBorder radius={0}>
        <TamsButton
          onClick={handleSubmit}
          loading={loading}
          size="md"
          radius="xl"
          disabled={!isDirty}
        >
          Save
        </TamsButton>
      </Paper>
    </TamsModal2>
  )
}

export default CreateEditKanbanTask
