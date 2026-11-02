import { TamsTableActionPopover } from '#/components'
import {
  useAttendanceAccess,
  useAttendanceDeviceCommand,
  useAttendanceDeviceUsers,
  useAttendanceTransactions,
  useGetAttendanceDevices,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { normalizeStrings } from '#/lib/utils'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  ArrowsClockwiseIcon,
  GitPullRequestIcon,
  PenIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

type Props = {
  activeTab: 'devices' | 'user' | 'logs' | null
}

const useHandleAttendanceDevice = ({ activeTab }: Props) => {
  const access = useAttendanceAccess()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string | undefined>()
  const [stateFilter, setStateFilter] = useState<'online' | 'offline' | 'all'>(
    'all',
  )
  const [deviceFilter, setDeviceFilter] = useState<string>('all')
  const [command, setCommand] = useState<'reboot' | 'check' | null>(null)
  const [selectedRow, setSelectedRow] = useState<TamsTableData | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null)
  const [
    openedTransactionDetail,
    { open: openTransactionDetail, close: closeTransactionDetail },
  ] = useDisclosure()
  const [userDeviceCommandType, setUserDeviceCommandType] = useState<
    'USER_FP_TRANSFER' | 'MOVE_USER' | 'USER_TRANSFER'
  >()

  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure()

  const [
    openedBulkUserDevicesCommands,
    { open: openBulkUserDevicesCommands, close: closeBulkUserDevicesCommands },
  ] = useDisclosure()

  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure()
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const { data: attendanceDevices, isLoading: isLoadingAttendanceDevices } =
    useGetAttendanceDevices(
      {
        page,
        perPage: 10,
        search_query: debouncedSearch || undefined,
        state: stateFilter === 'all' ? undefined : stateFilter,
      },
      (data) => ({
        data: data.data.results.map((device) => ({
          id: device.id,
          alias: device.alias,
          serial_no: device.serial_no,
          device_type: device.device_type ?? '—',
          last_activity: device.last_activity ?? '—',
          status: device.state ? 'Active' : 'Offline',
        })),
        total: data.data.total,
      }),
      Boolean(activeTab === 'devices'),
    )

  const { data: allAttendanceDevicesFilters } = useGetAttendanceDevices(
    undefined,
    (data) =>
      data.data.results.map((device) => ({
        value: device.id.toString(),
        label: `${device.alias} (${device.device_type ?? '—'})`,
      })),
  )
  const {
    data: attendanceDeviceUsers,
    isLoading: isLoadingAttendanceDeviceUsers,
  } = useAttendanceDeviceUsers(
    {
      page,
      per_page: 10,
      search_query: debouncedSearch || undefined,
      device_id:
        deviceFilter && deviceFilter !== 'all'
          ? Number(deviceFilter)
          : undefined,
    },
    (data) => ({
      data: data.data.results.map((user) => ({
        id: user.employee_id,
        name: user.name,
        pin: user.pin,
        department: user.department ?? '—',
        device_name: user.device_name,
        serial_no: user.serial_no,
        privilege: user.privilege,
        fp_count: user.fp_count,
      })),
      total: data.data.total,
    }),
    Boolean(activeTab === 'user'),
  )
  const {
    data: attendanceDeviceTransactions,
    isLoading: isLoadingAttendanceDeviceTransactions,
  } = useAttendanceTransactions(
    {
      page,
      perPage: 10,
      // search_query: debouncedSearch || undefined,
    },
    (data) => ({
      data: data.data.results.map((transaction) => ({
        id: transaction.id,
        command_type: normalizeStrings(transaction.command_type),
        total: transaction.total as number,
        pending: transaction.pending as number,
        executed: transaction.executed as number,
        failed: transaction.failed as number,
        successful: transaction.successful as number,
      })),
      total: data.data.total,
    }),
    Boolean(activeTab === 'logs'),
  )
  const attendanceDeviceCommandAsync = useAttendanceDeviceCommand()

  const tableData = useMemo((): TamsTableData[] => {
    if (activeTab === 'devices') {
      return attendanceDevices?.data || []
    }
    if (activeTab === 'user') {
      return attendanceDeviceUsers?.data || []
    }
    if (activeTab === 'logs') {
      return attendanceDeviceTransactions?.data || []
    }
    return []
  }, [
    activeTab,
    attendanceDevices,
    attendanceDeviceUsers,
    attendanceDeviceTransactions,
  ])

  const total = useMemo(() => {
    return activeTab === 'devices'
      ? attendanceDevices?.total || 0
      : activeTab === 'user'
        ? attendanceDeviceUsers?.total || 0
        : activeTab === 'logs'
          ? attendanceDeviceTransactions?.total || 0
          : 0
  }, [
    activeTab,
    attendanceDevices,
    attendanceDeviceUsers,
    attendanceDeviceTransactions,
  ])

  const loading =
    isLoadingAttendanceDevices ||
    isLoadingAttendanceDeviceUsers ||
    isLoadingAttendanceDeviceTransactions

  const handleSelectRow = (row: TamsTableData) => {
    if (activeTab === 'logs') {
      if (!access.canView) return
      setSelectedTransactionId(Number(row.id))
      openTransactionDetail()
      return
    }
    if (activeTab !== 'devices') return
    setSelectedRow(row)
    openDetail()
  }

  const handleCommand = async () => {
    try {
      if (!command || attendanceDeviceCommandAsync.isPending) return
      await attendanceDeviceCommandAsync.mutateAsync({
        command_type: command,
        devices: [selectedRow?.serial_no as string],
      })
      setCommand(null)
      closeConfirmation()
      setSelectedRow(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCloseConfirmation = () => {
    if (!attendanceDeviceCommandAsync.isPending) {
      setCommand(null)
      closeConfirmation()
    }
  }

  const handleBulkCommands = (
    ids: number[],
    command_type: 'USER_FP_TRANSFER' | 'MOVE_USER' | 'USER_TRANSFER',
  ) => {
    setUserDeviceCommandType(command_type)
    setSelectedIds(ids)
    openBulkUserDevicesCommands()
  }
  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    {
      label: 'Edit',
      action: () =>
        navigate({
          to: '/admin-dashboard/attendance/devices/edit',
          search: { deviceId: row.id as number },
        }),
      color: '',
      icon: PenIcon,
      hidden: !access.canEdit,
    },
    {
      label: 'Reboot',
      action: () => {
        setSelectedRow(row)
        setCommand('reboot')
        openConfirmation()
      },
      color: 'green',
      icon: ArrowsClockwiseIcon,
      hidden: !access.canCreate,
    },
    {
      label: 'Force pull',
      action: () => {
        setSelectedRow(row)
        setCommand('check')
        openConfirmation()
      },
      color: 'red',
      icon: GitPullRequestIcon,
      hidden: !access.canCreate,
    },
  ]

  const columns: TamsTableColumn[] = useMemo(() => {
    return activeTab === 'devices'
      ? [
          { label: 'ID', accessor: 'id' },
          { label: 'Alias', accessor: 'alias', enableSorting: true },
          { label: 'Serial number', accessor: 'serial_no' },
          { label: 'Device type', accessor: 'device_type' },
          {
            label: 'Last transaction',
            accessor: 'last_activity',
            enableSorting: true,
          },
          {
            label: 'Status',
            accessor: 'status',
          },
          {
            label: '',
            accessor: 'actions',
            render: (row) => (
              <TamsTableActionPopover data={actionPopoverOptions(row)} />
            ),
          },
        ]
      : activeTab === 'user'
        ? [
            { label: '', accessor: 'select', type: 'checkbox' },
            { label: 'Name', accessor: 'name', enableSorting: true },
            { label: 'PIN', accessor: 'pin' },
            { label: 'Department', accessor: 'department' },
            { label: 'Device', accessor: 'device_name' },
            { label: 'Serial number', accessor: 'serial_no' },
            { label: 'Access', accessor: 'privilege' },
            { label: 'Fingerprint count', accessor: 'fp_count' },
          ]
        : activeTab === 'logs'
          ? [
              { label: 'ID', accessor: 'id' },
              { label: 'Command', accessor: 'command_type' },
              { label: 'Total', accessor: 'total' },
              { label: 'Pending', accessor: 'pending' },
              { label: 'Executed', accessor: 'executed' },
              { label: 'Successful', accessor: 'successful' },
              { label: 'Failed', accessor: 'failed' },
            ]
          : []
  }, [activeTab])

  const deviceUsersBulkActions: TamsTableBulkSelection[] = [
    {
      label: 'Copy users',
      action: (ids) => handleBulkCommands(ids, 'USER_FP_TRANSFER'),
    },
    {
      label: 'Move users',
      action: (ids) => handleBulkCommands(ids, 'MOVE_USER'),
    },
    {
      label: 'Change access',
      action: (ids) => handleBulkCommands(ids, 'USER_TRANSFER'),
    },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData?.length === 0 && !loading) {
      if (search?.length) {
        return activeTab === 'devices'
          ? emptyStates.devices[1]
          : emptyStates.deviceUsers[1]
      }
      if (stateFilter && stateFilter !== 'all') {
        return activeTab === 'devices'
          ? emptyStates.devices[1]
          : emptyStates.deviceUsers[1]
      }
      if (deviceFilter && deviceFilter !== 'all') {
        return activeTab === 'devices'
          ? emptyStates.devices[1]
          : emptyStates.deviceUsers[1]
      }
      return activeTab === 'devices'
        ? emptyStates.devices[0]
        : emptyStates.deviceUsers[0]
    }
    return activeTab === 'devices'
      ? emptyStates.devices[0]
      : emptyStates.deviceUsers[0]
  }, [tableData, search, loading, deviceFilter, stateFilter, activeTab])

  return {
    selectedTransactionId,
    openedTransactionDetail,
    closeTransactionDetail,
    columns,
    page,
    setSearch,
    search,
    total,
    tableData,
    setPage,
    loading,
    stateFilter,
    setStateFilter,
    command,
    isPending: attendanceDeviceCommandAsync.isPending,
    handleSelectRow,
    selectedRow,
    handleCommand,
    handleCloseConfirmation,
    openedConfirmation,
    openedDetail,
    openDetail,
    closeDetail,
    deviceFilter,
    setDeviceFilter,
    allAttendanceDevicesFilters,
    selectedIds,
    setSelectedIds,
    deviceUsersBulkActions,
    openedBulkUserDevicesCommands,
    openBulkUserDevicesCommands,
    closeBulkUserDevicesCommands,
    userDeviceCommandType,
    setUserDeviceCommandType,
    emptyState,
  }
}

export default useHandleAttendanceDevice
