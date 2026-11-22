import { TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { usePerformanceAppraisalGroups } from '#/lib'

type Props = {
  activeTab: 'all' | 'archived'
}

const PerformanceAppraisalTable = ({ activeTab }: Props) => {
  const {
    page,
    setPage,
    search,
    setSearch,
    tableData,
    columns,
    total,
    loading,
    emptyState,
    bulkSelectionOptions,
    openedConfirmation,
    closeConfirmationModal,
    handleConfirmation,
    actionType,
    selectedGroup,
    isPending,
  } = usePerformanceAppraisalGroups({ activeTab })

  return (
    <>
      <TamsTable
        data={tableData}
        columns={columns}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        total={total}
        limit={10}
        loading={loading}
        empty={emptyState}
        bulkSelectionOptions={bulkSelectionOptions}
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmation}
        loading={isPending}
        isCritical={actionType === 'delete'}
        confirmText={
          actionType === 'delete'
            ? 'Delete permanently'
            : actionType === 'restore'
              ? 'Restore'
              : actionType === 'end'
                ? 'End'
                : actionType === 'initiate'
                  ? 'Send'
                  : 'Archive'
        }
        title={`${actionType ? actionType[0].toUpperCase() + actionType.slice(1) : 'Appraisal'} appraisal group`}
        message={
          selectedGroup
            ? `${actionType === 'delete' ? 'Permanently delete' : actionType === 'restore' ? 'Restore' : actionType === 'end' ? 'End' : actionType === 'initiate' ? 'Send' : 'Archive'} "${selectedGroup.name}"?`
            : 'Confirm this appraisal group action?'
        }
      />
    </>
  )
}

export default PerformanceAppraisalTable
