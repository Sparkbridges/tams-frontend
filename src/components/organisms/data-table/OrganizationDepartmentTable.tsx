import { TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { useOrganizationDepartmentTable } from '#/lib'
import { OrgDepartmentDetailDrawer } from '../drawers'

const OrganizationDepartmentTable = () => {
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
    handleDelete,
    isDeleting,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedRow,
    selectedIds,
    openedBulkActionConfirmation,
    closeBulkActionConfirmation,
  } = useOrganizationDepartmentTable()

  return (
    <div>
      <TamsTable
        columns={columns}
        selectedIds={selectedIds}
        data={tableData}
        loading={isLoading}
        placeholder='Search for Departments'
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
        bulkSelectionOptions={bulkSelectionOptions}
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        onConfirm={() => handleDelete('single')}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedBulkActionConfirmation}
        onClose={closeBulkActionConfirmation}
        title="Delete Departments"
        message="Are you sure you want to delete these departments?"
        onConfirm={() => handleDelete('bulk')}
        loading={isDeleting}
      />
      <OrgDepartmentDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedRow={selectedRow}
      />
    </div>
  )
}

export default OrganizationDepartmentTable
