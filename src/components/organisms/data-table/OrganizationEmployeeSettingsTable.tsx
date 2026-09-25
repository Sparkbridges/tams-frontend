import {
  TamsButton,
  TamsModal,
  TamsTable,
  TamsTextInput,
} from '#/components/atoms'
import { TamsConfirmation } from '#/components/molecules'
import { capitalize, useOrganizationEmployeeSettingsTable } from '#/lib'
import { Group } from '@mantine/core'

type OrganizationEmployeeSettingsTableProps = {
  activeTab: 'types' | 'designation' | 'category' | 'grades' | null
  setTabCounts: (counts: { [key: string]: number }) => void
  createType: string
  setCreateType: (type: string) => void
}
const OrganizationEmployeeSettingsTable = ({
  activeTab,
  setTabCounts,
  createType,
  setCreateType,
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
    createEditOpened,
    handleCloseCreateEdit,
    inputFieldValue,
    setInputFieldValue,
    selectedId,
    handleEdit,
    handleCreate,
    isEditing,
    isCreating,
    errorMsg,
    hasEditChanged,
  } = useOrganizationEmployeeSettingsTable({
    activeTab,
    setTabCounts,
    createType,
    setCreateType,
  })

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

      <TamsModal
        allowblur
        title={
          selectedId
            ? `Edit ${capitalize(activeTab ?? '')}`
            : `Create ${capitalize(createType ?? '')}`
        }
        opened={createEditOpened}
        onClose={handleCloseCreateEdit}
      >
        <section className="space-y-2">
          <div>
            <TamsTextInput
              withAsterisk
              label={
                selectedId
                  ? `Edit ${activeTab ?? ''}`
                  : `Enter ${createType ?? ''}`
              }
              value={inputFieldValue}
              onChange={(e) => setInputFieldValue(e.target.value)}
              error={errorMsg}
            />
          </div>
          <Group justify="end">
            <TamsButton
              size="md"
              radius="xl"
              disabled={!hasEditChanged}
              onClick={selectedId ? handleEdit : handleCreate}
              loading={isEditing || isCreating}
            >
              {selectedId ? 'Update' : 'Save'}
            </TamsButton>
          </Group>
        </section>
      </TamsModal>
    </div>
  )
}

export default OrganizationEmployeeSettingsTable
