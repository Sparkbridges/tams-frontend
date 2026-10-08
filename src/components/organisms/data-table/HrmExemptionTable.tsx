import { TamsTable } from '#/components/atoms'
import {
  TamsConfirmation,
  TamsDateTableFilter,
  TamsTableFilter,
} from '#/components/molecules'
import { useHrmExemptionsTable } from '#/lib'
import { Divider } from '@mantine/core'
import { HrmExemptionDetailDrawer } from '../drawers'

const HrmExemptionTable = () => {
  const {
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
    openedApproveConfirmation,
    closeApproveConfirmation,
    handleApprove,
    isApproving,
  } = useHrmExemptionsTable()

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
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
              label="Status"
              selectedOption={statusFilter}
              setSelectedItem={setStatusFilter}
              data={statusOptions}
            />
            <Divider orientation="vertical" />
            <TamsDateTableFilter
              label="Exemption Dates"
              dateValue={dateRange}
              setDateValue={setDateRange}
            />
          </div>
        }
      />
      <TamsConfirmation
        opened={openedApproveConfirmation}
        onClose={closeApproveConfirmation}
        title="Approve Exemption"
        message="Are you sure you want to approve this exemption?"
        onConfirm={handleApprove}
        loading={isApproving}
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title="Delete Exemption"
        message="Are you sure you want to delete this exemption?"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedBulkDeleteConfirmation}
        onClose={handleCloseBulkDelete}
        title="Delete Exemptions"
        message="Are you sure you want to delete the selected exemptions?"
        onConfirm={handleBulkDeleteAction}
        loading={isDeleting}
      />
      <HrmExemptionDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedId={selectedId ?? 0}
      />
    </div>
  )
}

export default HrmExemptionTable
