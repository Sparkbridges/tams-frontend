import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTableFilter } from '#/components/molecules'
import { useOrganizationBranchTable } from '#/lib'
import { OrgBranchDetailDrawer } from '../drawers'

const OrganizationBranchTable = () => {
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
    selectedBranchId,
    handleCloseBulkDelete,
    isDeletingBulk,
    openedBulkDeleteConfirmation,
    handleBulkDeleteAction,
    selectedBranchIds
  } = useOrganizationBranchTable()

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]
  return (
    <div>
      <TamsTable
        columns={columns}
        data={tableData}
        selectedIds={selectedBranchIds}
        loading={isLoading}
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
        bulkSelectionOptions={bulkSelectionOptions}
        filters={
          <div className="flex gap-3">
            <TamsTableFilter
              label="Status"
              selectedOption={statusFilter}
              setSelectedItem={setStatusFilter}
              data={statusOptions}
            />
          </div>
        }
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title="Delete Branch"
        message="Are you sure you want to delete this branch?"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedBulkDeleteConfirmation}
        onClose={handleCloseBulkDelete}
        title="Delete Branch"
        message="Are you sure you want to delete the selected branches?"
        onConfirm={handleBulkDeleteAction}
        loading={isDeletingBulk}
      />
      <OrgBranchDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedId={selectedBranchId ?? 0}
      />
    </div>
  )
}

export default OrganizationBranchTable
