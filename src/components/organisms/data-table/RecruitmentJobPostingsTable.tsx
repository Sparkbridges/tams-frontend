import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTableFilter } from '#/components/molecules'
import {
  capitalize,
  jobTypeOptions,
  useRecruitmentJobPostingsTable,
  workModeOptions,
} from '#/lib'
import { RecruitmentJobPostingDetailDrawer } from '../drawers'

const RecruitmentJobPostingsTable = ({
  activeTab,
}: {
  activeTab: 'all' | 'archived'
}) => {
  const {
    columns,
    tableData,
    loading,
    page,
    setPage,
    search,
    setSearch,
    total,
    setStatusFilter,
    statusFilter,
    openedConfirmation,
    closeConfirmation,
    handleAction,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    statusOptions,
    workModeFilter,
    setWorkModeFilter,
    jobTypeFilter,
    setJobTypeFilter,
    actionType,
    isPending,
    emptyState,
  } = useRecruitmentJobPostingsTable({ activeTab })

  return (
    <div>
      <TamsTable
        empty={emptyState}
        columns={columns}
        data={tableData}
        loading={loading}
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
        filters={
          <div className="flex gap-3">
            <TamsTableFilter
              label="Status"
              selectedOption={statusFilter}
              setSelectedItem={setStatusFilter}
              data={statusOptions}
              showLabelAsSelectedOption
              disableAllOption
            />
            <TamsTableFilter
              label="Work Mode"
              selectedOption={workModeFilter}
              setSelectedItem={setWorkModeFilter}
              data={workModeOptions}
              showLabelAsSelectedOption
              disableAllOption
            />
            <TamsTableFilter
              label="Job Type"
              selectedOption={jobTypeFilter}
              setSelectedItem={setJobTypeFilter}
              data={jobTypeOptions}
              showLabelAsSelectedOption
              disableAllOption
            />
          </div>
        }
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title={`${capitalize(actionType ?? '')} Job Posting`}
        message={`Are you sure you want to ${actionType ?? ''} this job posting?`}
        onConfirm={handleAction}
        loading={isPending}
      />
      <RecruitmentJobPostingDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        selectedId={selectedId}
      />
    </div>
  )
}

export default RecruitmentJobPostingsTable
