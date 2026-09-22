import { TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { useOrganizationTeamTable } from '#/lib'
import { OrgTeamDetailDrawer } from '../drawers'

const OrganizationTeamTable = () => {
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
  } = useOrganizationTeamTable()

  return (
    <div>
      <TamsTable
        columns={columns}
        selectedIds={selectedIds}
        data={tableData}
        loading={isLoading}
        placeholder="Search for Teams"
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
        title="Delete Team"
        message="Are you sure you want to delete this team?"
        onConfirm={() => handleDelete('single')}
        loading={isDeleting}
      />
      <TamsConfirmation
        opened={openedBulkActionConfirmation}
        onClose={closeBulkActionConfirmation}
        title="Delete Teams"
        message="Are you sure you want to delete these teams?"
        onConfirm={() => handleDelete('bulk')}
        loading={isDeleting}
      />
      <OrgTeamDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedRow={selectedRow}
      />
    </div>
  )
}

export default OrganizationTeamTable
