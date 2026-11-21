import { TamsButton, TamsTable } from '#/components/atoms'
import { TamsActionWidget, TamsConfirmation } from '#/components/molecules'
import { usePerformanceAppraisalGGSettings } from '#/lib'
import type { AppraisalSettingsTab } from '#/lib'
import { getErrorMessage } from '#/lib/utils'
import { Alert } from '@mantine/core'
import AppraisalPeopleSettingDetailDrawer from '../drawers/AppraisalPeopleSettingDetailDrawer'
import AppraisalPeopleSettingModal from '../modals/AppraisalPeopleSettingModal'

type Props = {
  activeTab: AppraisalSettingsTab
}

const PerformanceAppraisalGGSettings = ({ activeTab }: Props) => {
  const {
    columns,
    page,
    setPage,
    tableData,
    loading,
    hasChanges,
    handleConfirm,
    handleCancel,
    actionLoading,
    handleAddAppraisalPeriod,
    total,
    search,
    setSearch,
    selection,
    closeSelection,
    editSelection,
    handleRowClick,
    handleDeleteSetting,
    deleting,
    deleteError,
  } = usePerformanceAppraisalGGSettings({ activeTab })
  return (
    <div>
      <TamsTable
        total={total}
        columns={columns}
        data={tableData}
        disableSearch={activeTab === 'general' || activeTab === 'grading'}
        page={page}
        setPage={setPage}
        loading={loading}
        search={search}
        setSearch={setSearch}
        handleRowClick={handleRowClick}
        disablePagination={activeTab === 'general' || activeTab === 'grading'}
        filters={
          activeTab === 'general' || activeTab === 'grading' ? (
            <div>
              <TamsButton variant="outline" onClick={handleAddAppraisalPeriod}>
                {activeTab === 'general'
                  ? 'Add Appraisal Period'
                  : 'Add Grading'}
              </TamsButton>
            </div>
          ) : undefined
        }
        header={
          activeTab === 'general' || activeTab === 'grading' ? (
            <div>
              <h1 className="text-lg font-medium">
                {activeTab === 'general'
                  ? 'Appraisal Periods'
                  : 'Grading Bands'}
              </h1>
            </div>
          ) : undefined
        }
      />
      <TamsActionWidget
        loading={actionLoading}
        title={'Unsaved Changes'}
        opened={hasChanges}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      {selection?.action === 'detail' && (
        <AppraisalPeopleSettingDetailDrawer
          opened
          kind={selection.kind}
          selectedId={selection.id}
          onClose={closeSelection}
          onEdit={editSelection}
        />
      )}
      {selection?.action === 'edit' && (
        <AppraisalPeopleSettingModal
          key={`${selection.kind}-${selection.id}`}
          opened
          kind={selection.kind}
          selectedId={selection.id}
          onClose={closeSelection}
        />
      )}
      <TamsConfirmation
        opened={selection?.action === 'delete'}
        onClose={closeSelection}
        onConfirm={handleDeleteSetting}
        loading={deleting}
        isCritical
        title="Delete Appraisal Settings"
        message={`Delete "${selection?.name ?? ''}"? Settings used by an existing appraisal group cannot be deleted.`}
        confirmText="Delete"
        content={
          deleteError ? (
            <Alert color="red">{getErrorMessage(deleteError)}</Alert>
          ) : undefined
        }
      />
    </div>
  )
}

export default PerformanceAppraisalGGSettings
