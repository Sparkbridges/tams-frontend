import { Alert, LoadingOverlay } from '@mantine/core'
import { TamsSpinner } from '#/components/atoms'
import { Tams2ColsForm, TamsActionWidget } from '#/components/molecules'
import useCreateEditWorkshiftForm from '#/lib/hooks/forms/useCreateEditWorkshiftForm'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from './AttendanceDevicesLayout'

export default function AttendanceWorkshiftForm({ id }: { id?: number }) {
  const state = useCreateEditWorkshiftForm({ id })
  if (!state.allowed) return <AttendanceAccessDenied />
  if (!state.access.canViewTypes)
    return (
      <Alert color="red">
        Viewing shift types is required to create or edit a work shift.
      </Alert>
    )
  if (state.error)
    return <AttendanceQueryError error={state.error} retry={state.retry} />
  return (
    <div className="relative">
      <LoadingOverlay
        visible={state.isLoadingDetails}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      {state.editing && (
        <Alert mb="lg">Branch scope is fixed for an existing work shift.</Alert>
      )}
      <Tams2ColsForm fields={state.fields} form={state.form} />
      <TamsActionWidget
        loading={state.loading}
        title={
          state.editing
            ? 'Unsaved changes to Workshift'
            : 'Unsaved new Workshift'
        }
        opened={state.openedActionWidget}
        onConfirm={state.handleSubmit}
        onCancel={state.handleCancel}
      />
    </div>
  )
}
