import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTableFilter } from '#/components/molecules'
import {
  capitalize,
  jobTypeOptions,
  useRecruitmentTalentRequestTable,
  workModeOptions,
} from '#/lib'
import { RecruitmentTalentRequestDetailDrawer } from '../drawers'

const RecruitmentTalentRequestTable = () => {
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
    selectedRequest,
    statusOptions,
    workModeFilter,
    setWorkModeFilter,
    jobTypeFilter,
    setJobTypeFilter,
    setBranchId,
    organizationBranches,
    branchId,
    departmentFilter,
    setDepartmentFilter,
    organizationDepartments,
    actionType,
    isPending,
    emptyState,
  } = useRecruitmentTalentRequestTable()

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
              label="Branch"
              selectedOption={branchId}
              setSelectedItem={setBranchId}
              data={organizationBranches}
              showLabelAsSelectedOption
              disableAllOption
            />
            {branchId && (
              <TamsTableFilter
                label="Department"
                selectedOption={departmentFilter}
                setSelectedItem={setDepartmentFilter}
                data={organizationDepartments}
                showLabelAsSelectedOption
                disableAllOption
              />
            )}
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
        title={`${capitalize(actionType ?? '')} Talent Request`}
        message={`Are you sure you want to ${actionType ?? ''} this talent request?`}
        onConfirm={handleAction}
        loading={isPending}
      />
      <RecruitmentTalentRequestDetailDrawer
        opened={openedDetailDrawer}
        onClose={closeDetailDrawer}
        request={selectedRequest}
        branches={organizationBranches}
      />
    </div>
  )
}

export default RecruitmentTalentRequestTable
