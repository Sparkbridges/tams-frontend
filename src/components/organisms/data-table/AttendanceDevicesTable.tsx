import { TamsTable } from '#/components/atoms'
import { TamsConfirmation, TamsTableFilter } from '#/components/molecules'
import { useHandleAttendanceDevice } from '#/lib'
import AttendanceDeviceDetailDrawer from '../drawers/AttendanceDeviceDetailDrawer'
import AttendanceTransactionDetailDrawer from '../drawers/AttendanceTransactionDetailDrawer'
import { AttendanceUsersDeviceModal } from '../modals'

type Props = {
  activeTab: 'devices' | 'user' | 'logs' | null
}

const AttendanceDevicesTable = ({ activeTab }: Props) => {
  const {
    columns,
    page,
    tableData,
    total,
    setPage,
    loading,
    setSearch,
    search,
    stateFilter,
    setStateFilter,
    command,
    isPending,
    handleSelectRow,
    selectedRow,
    handleCommand,
    handleCloseConfirmation,
    openedConfirmation,
    openedDetail,
    closeDetail,
    allAttendanceDevicesFilters,
    deviceFilter,
    setDeviceFilter,
    deviceUsersBulkActions,
    selectedIds,
    setSelectedIds,
    openedBulkUserDevicesCommands,
    closeBulkUserDevicesCommands,
    userDeviceCommandType,
    selectedTransactionId,
    openedTransactionDetail,
    closeTransactionDetail,
    emptyState,
  } = useHandleAttendanceDevice({
    activeTab,
  })
  return (
    <div>
      <TamsTable
        bulkSelectionOptions={deviceUsersBulkActions}
        selectedIds={selectedIds}
        empty={emptyState}
        page={page}
        disableSearch={activeTab === 'logs'}
        total={total}
        data={tableData}
        columns={columns}
        setPage={setPage}
        loading={loading}
        handleRowClick={handleSelectRow}
        setSearch={setSearch}
        search={search}
        placeholder={
          activeTab === 'devices' ? 'Search devices' : 'Search users'
        }
        filters={
          <div className="flex gap-3">
            {activeTab === 'devices' && (
              <TamsTableFilter
                label="Status"
                selectedOption={stateFilter}
                setSelectedItem={(value) =>
                  setStateFilter(value as 'online' | 'offline' | 'all')
                }
                data={[
                  { label: 'Online', value: 'online' },
                  { label: 'Offline', value: 'offline' },
                ]}
              />
            )}
            {activeTab === 'user' && (
              <TamsTableFilter
                label="Device type"
                selectedOption={deviceFilter}
                setSelectedItem={setDeviceFilter}
                data={allAttendanceDevicesFilters}
                width={300}
              />
            )}
          </div>
        }
      />
      <TamsConfirmation
        opened={openedConfirmation}
        onClose={handleCloseConfirmation}
        title={command === 'reboot' ? 'Reboot device' : 'Force pull'}
        message={`Send this command to ${selectedRow?.alias ?? 'the device'}? Offline devices process commands when they reconnect.`}
        loading={isPending}
        onConfirm={handleCommand}
      />

      <AttendanceDeviceDetailDrawer
        opened={openedDetail && activeTab === 'devices'}
        onClose={closeDetail}
        selectedId={selectedRow?.id as number}
      />

      {openedTransactionDetail && activeTab === 'logs' && (
        <AttendanceTransactionDetailDrawer
          key={selectedTransactionId}
          opened
          onClose={closeTransactionDetail}
          selectedId={selectedTransactionId ?? 0}
        />
      )}

      {openedBulkUserDevicesCommands && userDeviceCommandType && (
        <AttendanceUsersDeviceModal
          opened={openedBulkUserDevicesCommands}
          onClose={closeBulkUserDevicesCommands}
          command_type={userDeviceCommandType}
          selectedEmployees={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
    </div>
  )
}

export default AttendanceDevicesTable
