import { TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { useHrmExemptionsSettingsTable } from '#/lib'
import { EditHrmExemptionApproverSettingsDrawer } from '../drawers'

const HrmExemptionSettingsTable = () => {
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
    openedEditDetailDrawer,
    handleRowClick,
    closeEditDetailDrawer,
    selectedId,
    emptyState,
  } = useHrmExemptionsSettingsTable()
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
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title="Delete Exemption"
        message="Are you sure you want to delete this exemption?"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <EditHrmExemptionApproverSettingsDrawer
        opened={openedEditDetailDrawer}
        onClose={closeEditDetailDrawer}
        selectedId={Number(selectedId ?? 0)}
      />
    </div>
  )
}

export default HrmExemptionSettingsTable
