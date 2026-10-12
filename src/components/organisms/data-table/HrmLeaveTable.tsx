import { TamsTable } from '#/components/atoms'
import {
  TamsConfirmation,
  TamsDateTableFilter,
  TamsTableFilter,
} from '#/components/molecules'
import { useHrmLeaveTable } from '#/lib'
import { Divider } from '@mantine/core'
import { HrmLeaveDetailDrawer } from '../drawers'

const HrmLeaveTable = () => {
  const {
    leaveTypeFilter,
    setLeaveTypeFilter,
    columns,
    tableData,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    total,
    bulkSelectionOptions,
    setStatusFilter,
    statusFilter,
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    isDeleting,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    handleCloseBulkDelete,
    openedBulkDeleteConfirmation,
    handleBulkDeleteAction,
    selectedIds,
    dateRange,
    setDateRange,
    emptyState,
    /* openedApproveConfirmation,
    closeApproveConfirmation,
    handleApprove,
    isApproving, */
    leaveTypes,
  } = useHrmLeaveTable()

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Completed', value: 'completed' },
  ]
  return (
    <div>
      <TamsTable
        columns={columns}
        data={tableData}
        selectedIds={selectedIds}
        loading={isLoading}
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
        bulkSelectionOptions={bulkSelectionOptions}
        empty={emptyState}
        filters={
          <div className="flex gap-3">
            <TamsTableFilter
              label="Leave Types"
              selectedOption={
                leaveTypes?.find((option) => option.value === leaveTypeFilter)
                  ?.label ?? leaveTypeFilter
              }
              setSelectedItem={setLeaveTypeFilter}
              data={leaveTypes}
            />
            <TamsTableFilter
              label="Status"
              selectedOption={statusFilter}
              setSelectedItem={setStatusFilter}
              data={statusOptions}
            />
            <Divider orientation="vertical" />
            <TamsDateTableFilter
              label="Leave Dates"
              dateValue={dateRange}
              setDateValue={setDateRange}
            />
          </div>
        }
      />
      {/* <TamsConfirmation
        opened={openedApproveConfirmation}
        onClose={closeApproveConfirmation}
        title="Approve Leave"
        message="Are you sure you want to approve this leave?"
        onConfirm={handleApprove}
        loading={isApproving}
      /> */}
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title="Delete Leave"
        message="Are you sure you want to delete this leave?"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedBulkDeleteConfirmation}
        onClose={handleCloseBulkDelete}
        title="Delete Leaves"
        message="Are you sure you want to delete the selected leaves?"
        onConfirm={handleBulkDeleteAction}
        loading={isDeleting}
      />
      <HrmLeaveDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedId={selectedId ?? 0}
      />
    </div>
  )
}

export default HrmLeaveTable
