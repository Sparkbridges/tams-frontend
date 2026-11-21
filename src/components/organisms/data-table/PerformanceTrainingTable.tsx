import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTableFilter } from '#/components/molecules'
import { capitalize, usePerformanceTraining } from '#/lib'
import PerformanceTrainingDetailDrawer from '../drawers/PerformanceTrainingDetailDrawer'

const PerformanceTrainingTable = () => {
  const {
    page,
    setPage,
    search,
    setSearch,
    tableData,
    total,
    columns,
    loading,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    actionType,
    handleAction,
    openedConfirmation,
    handleCloseConfirmation,
    detailId,
    handleOpenDetails,
    handleCloseDetails,
    emptyState,
    isPending,
  } = usePerformanceTraining()
  return (
    <div>
      <TamsTable
        search={search}
        setSearch={setSearch}
        page={page}
        empty={emptyState}
        setPage={setPage}
        data={tableData}
        total={total}
        columns={columns}
        loading={loading}
        handleRowClick={handleOpenDetails}
        filters={
          <div className="flex gap-3">
            <TamsTableFilter
              label="Status"
              selectedOption={statusFilter}
              data={[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
              ]}
              setSelectedItem={setStatusFilter}
            />
            <TamsTableFilter
              label="Type"
              selectedOption={typeFilter}
              data={[
                { label: 'General', value: 'general' },
                {
                  label: 'Performance Improvement',
                  value: 'performance_improvement',
                },
              ]}
              setSelectedItem={setTypeFilter}
            />
          </div>
        }
      />
      <TamsConfirmation
        opened={openedConfirmation && actionType !== null}
        title={`${capitalize(actionType ?? '')} Training`}
        message={`Are you sure you want to ${actionType} this training?`}
        isCritical
        confirmText="Yes, sure"
        onConfirm={handleAction}
        onClose={handleCloseConfirmation}
        loading={isPending}
      />
      {detailId !== null && (
        <PerformanceTrainingDetailDrawer
          opened
          selectedId={detailId}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  )
}

export default PerformanceTrainingTable
