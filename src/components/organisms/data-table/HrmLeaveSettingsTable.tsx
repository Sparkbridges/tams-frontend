import { TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { useHrmLeaveSettingsTable } from '#/lib'
import { WarningCircleIcon } from '@phosphor-icons/react'
import {
  EditHrmLeaveApproverSettingsDrawer,
  EditHrmLeaveTypesSettingsDrawer,
  ReassignLeaveRequestToLeaveTypes,
} from '../drawers'

type THrmLeaveSettingsTableProps = {
  activeTab: 'leave_type' | 'leave_approver' | null
}

const HrmLeaveSettingsTable = ({ activeTab }: THrmLeaveSettingsTableProps) => {
  const {
    columns,
    closeReassigDrawer,
    tableData,
    isLoading,
    page,
    setPage,
    handleRowClick,
    search,
    setSearch,
    total,
    emptyState,
    searchPlaceholder,
    openedDeleteConfirmation,
    closeDeleteConfirmation,
    handleDelete,
    isDeleting,
    openedReassignConfirmation,
    closeReassignConfirmation,
    openedDeactivateConfirmation,
    closeDeactivateConfirmation,
    handleDeactivate,
    handleReassign,
    isUpdatingStatus,
    selectedRow,
    setSelectedRow,
    openedReassignDrawer,
    openedDetailDrawer,
    closeDetailDrawer,
    selectedRow2,
    setSelectedRow2,
    openedEditHrmLeaveApproverDrawer,
    closeEditHrmLeaveApproverDrawer,
    openedDeleteApproverConfirmation,
    closeDeleteApproverConfirmation,
    handleDeleteApprover,
  } = useHrmLeaveSettingsTable({ activeTab })
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
        empty={emptyState}
        placeholder={searchPlaceholder}
      />

      <TamsConfirmation
        opened={openedDeleteConfirmation}
        onClose={closeDeleteConfirmation}
        title="Delete Leave Type"
        message="Are you sure you want to delete this leave type?"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedDeleteApproverConfirmation}
        onClose={closeDeleteApproverConfirmation}
        title="Delete Leave Approver"
        message="Are you sure you want to delete this leave approver?"
        onConfirm={handleDeleteApprover}
        loading={isDeleting}
      />

      <TamsConfirmation
        opened={openedDeactivateConfirmation}
        onClose={closeDeactivateConfirmation}
        title={`${selectedRow?.status === 'Active' ? 'Deactivate' : 'Activate'} Leave Type`}
        message={`Please confirm if you want to proceed with ${selectedRow?.status === 'Active' ? 'De-activation' : 'Re-activation'}.`}
        content={
          selectedRow?.status === 'Active' ? (
            <div className=" text-red-500 mt-3 flex items-start text-sm gap-2">
              <WarningCircleIcon className="size-5" color="red" />
              This leave types are assigned to leaves and cannot be deleted?
              Consider deactivating instead.
            </div>
          ) : null
        }
        onConfirm={handleDeactivate}
        loading={isUpdatingStatus}
      />

      <TamsConfirmation
        opened={openedReassignConfirmation}
        onClose={closeReassignConfirmation}
        title="Reassign Leave Type"
        message="Are you sure you want to reassign this leave type(s)?"
        content={
          <div className=" text-amber-600 mt-3 flex items-start text-sm gap-2">
            <WarningCircleIcon className="size-5" color="gold" />
            Reassign Leave requests to a different leave type before deleting.
          </div>
        }
        onConfirm={handleReassign}
        loading={isDeleting}
      />

      <ReassignLeaveRequestToLeaveTypes
        opened={openedReassignDrawer}
        selectedId={Number(selectedRow?.id)}
        onClose={closeReassigDrawer}
        roleOptions={tableData.map((i) => ({
          label: i.name as string,
          value: i.id?.toString() as string,
        }))}
        members={
          Array.isArray(selectedRow?.leaves)
            ? (
                selectedRow.leaves as {
                  id: number
                  leave: string
                  status: string
                }[]
              ).map((i) => ({
                label: i.leave,
                value: i.id?.toString(),
              }))
            : []
        }
      />

      {activeTab === 'leave_type' && (
        <EditHrmLeaveTypesSettingsDrawer
          opened={openedDetailDrawer}
          onClose={() => {
            setSelectedRow(null)
            closeDetailDrawer()
          }}
          selectedId={Number(selectedRow?.id ?? 0)}
        />
      )}

      {activeTab === 'leave_approver' && (
        <EditHrmLeaveApproverSettingsDrawer
          opened={openedEditHrmLeaveApproverDrawer}
          onClose={() => {
            setSelectedRow2(null)
            closeEditHrmLeaveApproverDrawer()
          }}
          selectedId={selectedRow2?.id as number}
        />
      )}
    </div>
  )
}

export default HrmLeaveSettingsTable
