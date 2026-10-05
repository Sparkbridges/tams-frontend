import { TamsTable, TamsTextArea } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { useAccountSettingsHolidaysTable } from '#/lib'
import { Radio } from '@mantine/core'
import { EditPublicHolidaySettingsDrawer } from '../drawers'
import CreatePublicHolidaysSettingsModal from '../modals/CreatePublicHolidaysSettingsModal'

type AccountSettingsHolidaysTableProps = {
  open: boolean
  onClose: () => void
  openedCreatePublicHolidaysSettingsModal: boolean
}

const AccountSettingsHolidaysTable = ({
  onClose,
  openedCreatePublicHolidaysSettingsModal,
}: AccountSettingsHolidaysTableProps) => {
  const {
    columns,
    tableData,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    total,
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    isDeleting,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    openedCancellation,
    closeCancellation,
    handleCancel,
    isCancelling,
    cancellationType,
    setCancellationType,
    cancellationReason,
    setCancellationReason,
    cancellationError,
  } = useAccountSettingsHolidaysTable()

  return (
    <div>
      <TamsTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title="Delete Holiday"
        message="Are you sure you want to delete this holiday?"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedCancellation}
        onClose={closeCancellation}
        title="Cancel Holiday"
        message="Are you sure you want to cancel this holiday?"
        onConfirm={handleCancel}
        loading={isCancelling}
        content={
          <div className="space-y-2 mt-4">
            <Radio.Group
              value={cancellationType}
              size="sm"
              onChange={setCancellationType}
              name="cancellationType"
              label="Select cancellation reason"
              withAsterisk
            >
              <Radio
                className="mb-2"
                value="none"
                label="No reason for cancellation"
              />
              <Radio value="other" label="Other reason for cancellation" />
            </Radio.Group>

            {cancellationType === 'other' && (
              <TamsTextArea
                label="Other reason for cancellation"
                placeholder="Please specify the reason for cancellation"
                withAsterisk
                error={cancellationError}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.currentTarget.value)}
              />
            )}
          </div>
        }
      />
      <EditPublicHolidaySettingsDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedId={selectedId ?? 0}
      />
      <CreatePublicHolidaysSettingsModal
        opened={openedCreatePublicHolidaysSettingsModal}
        onClose={onClose}
      />
    </div>
  )
}

export default AccountSettingsHolidaysTable
