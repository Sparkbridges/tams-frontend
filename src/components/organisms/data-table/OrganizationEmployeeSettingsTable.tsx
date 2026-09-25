import { TamsTable } from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { useOrganizationEmployeeSettingsTable } from '#/lib'

type OrganizationEmployeeSettingsTableProps = {
  activeTab: 'types' | 'designation' | 'category' | 'grades' | null
  setTabCounts: (counts: { [key: string]: number }) => void
}
const OrganizationEmployeeSettingsTable = ({
  activeTab,
  setTabCounts,
}: OrganizationEmployeeSettingsTableProps) => {
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
    handleRowClick,
    modalInfo,
    emptyState,
  } = useOrganizationEmployeeSettingsTable({ activeTab, setTabCounts })

  const defaultPlaceholder =
    activeTab === 'types'
      ? 'Search for Employee Types'
      : activeTab === 'designation'
        ? 'Search for Employee Designations'
        : activeTab === 'category'
          ? 'Search for Employee Categories'
          : activeTab === 'grades'
            ? 'Search for Employee Grades'
            : ''

  return (
    <div>
      <TamsTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        empty={emptyState}
        placeholder={defaultPlaceholder}
        page={page}
        setPage={setPage}
        handleRowClick={handleRowClick}
        search={search}
        setSearch={setSearch}
        total={total}
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmation}
        title={modalInfo?.title}
        message={modalInfo?.message}
        onConfirm={modalInfo?.action}
        loading={modalInfo?.loading}
      />
    </div>
  )
}

export default OrganizationEmployeeSettingsTable
