import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTableFilter } from '#/components/molecules'
import { useOrganizationEmployeeTable } from '#/lib'

type OrganizationEmployeeTableProps = {
  activeTab: string | null
}
const OrganizationEmployeeTable = ({
  activeTab,
}: OrganizationEmployeeTableProps) => {
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
    openedConfirmation,
    closeConfirmation,
    handleRowClick,
    selectedIds,
    openedBulkActionConfirmation,
    closeBulkActionConfirmation,
    statusFilter,
    setStatusFilter,
    statusOptions,
    modalInfo,
    emptyState,
  } = useOrganizationEmployeeTable({ activeTab })

  return (
    <div>
      <TamsTable
        columns={columns}
        selectedIds={selectedIds}
        data={tableData}
        loading={isLoading}
        empty={emptyState}
        placeholder="Search for Employees"
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
        bulkSelectionOptions={bulkSelectionOptions}
        filters={
          activeTab === 'all' && (
            <div className="flex gap-3">
              <TamsTableFilter
                label="Status"
                selectedOption={statusFilter}
                setSelectedItem={setStatusFilter}
                data={statusOptions}
              />
            </div>
          )
        }
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title={modalInfo?.title}
        message={modalInfo?.message}
        onConfirm={modalInfo?.action}
        loading={modalInfo?.loading}
      />
      <TamsConfirmation
        opened={openedBulkActionConfirmation}
        onClose={closeBulkActionConfirmation}
        title={modalInfo?.title}
        message={modalInfo?.message}
        onConfirm={modalInfo?.action}
        loading={modalInfo?.loading}
      />
    </div>
  )
}

export default OrganizationEmployeeTable
