import { TamsTableActionPopover } from '#/components/molecules'
import {
  /*   useApproveHrmExemption,
  useCanApproveHrmExemption, */
  useDeleteHrmLeaves,
  useGetHrmLeaves,
  useGetHrmLeaveTypes,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { getErrorMessage, newDayjs } from '#/lib/utils'
import type { DatesRangeValue } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { PenIcon, TrashIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

const useHrmLeaveTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string | undefined>(
    'all',
  )
  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null])
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)
  const [
    openedApproveConfirmation,
    { open: openApproveConfirmation, close: closeApproveConfirmation },
  ] = useDisclosure(false)
  const [
    openedBulkDeleteConfirmation,
    { open: openBulkDeleteConfirmation, close: closeBulkDeleteConfirmation },
  ] = useDisclosure(false)
  const [
    openedDetailDrawer,
    { open: openDetailDrawer, close: closeDetailDrawer },
  ] = useDisclosure(false)

  const limit = 10
  const { data: leaves, isLoading: isLoadingLeaves } = useGetHrmLeaves(
    {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
      status:
        statusFilter && statusFilter !== 'all'
          ? statusFilter === 'completed'
            ? 'taken'
            : statusFilter
          : undefined,
      start_date: dateRange[0]
        ? newDayjs(dateRange[0]).format('YYYY-MM-DD')
        : undefined,
      end_date: dateRange[1]
        ? newDayjs(dateRange[1]).format('YYYY-MM-DD')
        : undefined,
      leave_type_id:
        leaveTypeFilter && leaveTypeFilter !== 'all'
          ? parseInt(leaveTypeFilter)
          : undefined,
    },
    (data) => data.data,
  )

  const { data: leaveTypes } = useGetHrmLeaveTypes((data) =>
    data.data.map((i) => ({
      label: i.leave_name?.toLowerCase(),
      value: i.id.toString(),
    })),
  )

  /*  const { data: canApprove } = useCanApproveHrmExemption()
  const { mutateAsync: approveHrmExemption, isPending: isApproving } =
    useApproveHrmExemption() */
  const { mutateAsync: deleteHrmLeave, isPending: isDeleting } =
    useDeleteHrmLeaves()

  const navigate = useNavigate()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedId(row.id as number)
    openDetailDrawer()
  }

  useEffect(() => {
    if (leaves?.results) {
      const formattedData = leaves.results.map((item) => ({
        id: item.id,
        employeeName: item.employee_name,
        type: item.leave_type_name.toLowerCase(),
        startDate: newDayjs(item.start_date).format('YYYY-MM-DD'),
        endDate: newDayjs(item.end_date).format('YYYY-MM-DD'),
        status: item.status === 'taken' ? 'completed' : item.status,
        reliefEmployee: item.relief || '-',
      }))
      setTableData(formattedData)
      setTotal(leaves.total)
    }
  }, [leaves?.results, setTableData, setTotal])

  const handleDelete = async () => {
    try {
      await deleteHrmLeave({ leave_ids: [selectedId as number] })
      closeConfirmation()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  /* const handleApprove = async () => {
    if (!canApprove?.data) {
      notifications.show({
        title: 'Error',
        message: 'You do not have permission to approve this exemption',
        color: 'red',
      })
      return
    }
    try {
      await approveHrmExemption({
        exemption_request_ids: [selectedId as number],
      })
      closeApproveConfirmation()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
  } */

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    ...(row.status === 'pending'
      ? [
          {
            label: 'Edit',
            action: () =>
              navigate({
                to: `/admin-dashboard/hrm/leave/edit`,
                search: { leaveId: row.id as number },
              }),
            color: '',
            icon: PenIcon,
          },
          /* {
            label: 'Approve',
            action: () => {
              setSelectedId(row.id as number)
              openApproveConfirmation()
            },
            color: 'green',
            icon: CheckIcon,
          }, */
        ]
      : []),
    {
      label: 'Delete',
      action: () => {
        setSelectedId(row.id as number)
        openConfirmation()
      },
      color: 'red',
      icon: TrashIcon,
    },
  ]
  const columns: TamsTableColumn[] = [
    {
      type: 'checkbox',
      label: '',
      accessor: '',
    },
    {
      label: 'ID',
      accessor: 'id',
      enableSorting: true,
    },
    {
      label: 'Employee Name',
      accessor: 'employeeName',
    },
    {
      label: 'Leave Type',
      accessor: 'type',
    },
    {
      label: 'Start date',
      accessor: 'startDate',
    },
    {
      label: 'End date',
      accessor: 'endDate',
    },
    {
      label: 'Relief Employee',
      accessor: 'reliefEmployee',
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

  const handleBulkDeleteAction = async () => {
    try {
      await deleteHrmLeave({ leave_ids: selectedIds })
      closeBulkDeleteConfirmation()
      setSelectedIds([])
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const handleBulkDeleteConfirmation = (rows: number[]) => {
    setSelectedIds(rows)
    openBulkDeleteConfirmation()
  }

  const handleCloseBulkDelete = () => {
    closeBulkDeleteConfirmation()
    setSelectedIds([])
  }

  const bulkSelectionOptions: TamsTableBulkSelection[] = [
    {
      label: 'Delete',
      action: (rows: number[]) => handleBulkDeleteConfirmation(rows),
      color: 'red',
      variant: 'outline',
    },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData?.length === 0 && !isLoadingLeaves) {
      if (search?.length) {
        return emptyStates.leaves[1]
      }
      if (statusFilter && statusFilter !== 'all') {
        return emptyStates.leaves[1]
      }
      if (leaveTypeFilter && leaveTypeFilter !== 'all') {
        return emptyStates.leaves[1]
      }
      if (dateRange && (dateRange[0] || dateRange[1])) {
        return emptyStates.leaves[1]
      }
      return emptyStates.leaves[0]
    }
    return emptyStates.leaves[0]
  }, [tableData, search, statusFilter, leaveTypeFilter, dateRange])

  return {
    columns,
    tableData,
    isLoading: isLoadingLeaves,
    page,
    setPage,
    limit,
    search,
    setSearch,
    total,
    setTotal,
    bulkSelectionOptions,
    statusFilter,
    setStatusFilter,
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    isDeleting,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    handleBulkDeleteAction,
    openedBulkDeleteConfirmation,
    handleCloseBulkDelete,
    selectedIds,
    dateRange,
    setDateRange,
    emptyState,
    openedApproveConfirmation,
    openApproveConfirmation,
    closeApproveConfirmation,
    // handleApprove,
    // isApproving,
    leaveTypes: leaveTypes ?? [],
    leaveTypeFilter,
    setLeaveTypeFilter,
  }
}

export default useHrmLeaveTable
