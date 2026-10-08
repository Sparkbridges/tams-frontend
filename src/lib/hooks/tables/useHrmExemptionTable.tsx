import { TamsButton, TamsPopover } from '#/components'
import { TamsTableActionPopover } from '#/components/molecules'
import {
  useApproveHrmExemption,
  useCanApproveHrmExemption,
  useDeleteHrmExemptions,
  useGetHrmExemptions,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { getErrorMessage, newDayjs, normalizeStrings } from '#/lib/utils'
import type { DatesRangeValue } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  CaretDownIcon,
  CheckIcon,
  PenIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

const useHrmExemptionTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')
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
  const { data: exemptions, isLoading: isLoadingExemptions } =
    useGetHrmExemptions(
      {
        page: page,
        perPage: limit,
        search_query: search?.length ? search : undefined,
        status:
          statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
        start_date: dateRange[0]
          ? newDayjs(dateRange[0]).format('YYYY-MM-DD')
          : undefined,
        end_date: dateRange[1]
          ? newDayjs(dateRange[1]).format('YYYY-MM-DD')
          : undefined,
      },
      (data) => data.data,
    )

  const { data: canApprove } = useCanApproveHrmExemption()
  const { mutateAsync: approveHrmExemption, isPending: isApproving } =
    useApproveHrmExemption()
  const { mutateAsync: deleteHrmExemption, isPending: isDeleting } =
    useDeleteHrmExemptions()

  const navigate = useNavigate()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedId(row.id as number)
    openDetailDrawer()
  }

  useEffect(() => {
    if (exemptions?.results) {
      const formattedData = exemptions.results.map((item) => ({
        id: item.id,
        employeeName: item.employee_name,
        type:
          item.exemption_type === 'CLOCK_IN_OUT'
            ? 'Clock In/Out'
            : normalizeStrings(item.exemption_type, 'capitalize'),
        date: item.exemptionsdate.map((i) => i.exemption_date),
        status: item.approval_status,
      }))
      setTableData(formattedData)
      setTotal(exemptions.total)
    }
  }, [exemptions?.results, setTableData, setTotal])

  const handleDelete = async () => {
    try {
      await deleteHrmExemption([selectedId as number])
      closeConfirmation()
    } catch (error) {
      console.error('Failed to delete organization branch', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete organization branch',
        color: 'red',
      })
    }
  }

  const handleApprove = async () => {
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
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    ...(row.status === 'pending'
      ? [
          {
            label: 'Edit',
            action: () =>
              navigate({
                to: `/admin-dashboard/hrm/exemption/edit`,
                search: { exemptionId: row.id as number },
              }),
            color: '',
            icon: PenIcon,
          },
          {
            label: 'Approve',
            action: () => {
              setSelectedId(row.id as number)
              openApproveConfirmation()
            },
            color: 'green',
            icon: CheckIcon,
          },
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
      label: 'Exemption Type',
      accessor: 'type',
    },
    {
      label: 'Date',
      accessor: 'date',
      render: (row) => {
        const datesToArray = (row.date as string[]) ?? []
        if (datesToArray.length === 0) return 'No Date'
        if (datesToArray.length === 1)
          return newDayjs(datesToArray[0]).format('MMM, DD, YYYY')
        return (
          <TamsPopover
            shadow="sm"
            width={220}
            position="bottom"
            trigger={
              <TamsButton
                className="pl-0 text-gray-900 font-regular"
                rightSection={<CaretDownIcon />}
                onClick={(e) => e.stopPropagation()}
                size="sm"
                variant="transparent"
              >
                {newDayjs(datesToArray[0]).format('MMM, DD, YYYY') ?? 'No Date'}
              </TamsButton>
            }
          >
            <div className="space-y-1.5">
              {datesToArray?.map((date, index) => (
                <div
                  className="p-2  hover:bg-gray-100 text-xs text-gray-800"
                  key={index}
                >
                  {newDayjs(date).format('MMM, DD, YYYY')}
                </div>
              ))}
            </div>
          </TamsPopover>
        )
      },
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
      await deleteHrmExemption(selectedIds)
      closeBulkDeleteConfirmation()
      setSelectedIds([])
    } catch (error) {
      console.error('Failed to delete organization branches', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete organization branches',
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
    if (tableData?.length === 0 && !isLoadingExemptions) {
      if (search?.length) {
        return emptyStates.hrmExemptions[1]
      }
      if (statusFilter && statusFilter !== 'all') {
        return emptyStates.hrmExemptions[1]
      }
      if (dateRange && (dateRange[0] || dateRange[1])) {
        return emptyStates.hrmExemptions[1]
      }
      return emptyStates.hrmExemptions[0]
    }
    return emptyStates.hrmExemptions[0]
  }, [tableData, search, statusFilter, dateRange])

  return {
    columns,
    tableData,
    isLoading: isLoadingExemptions,
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
    handleApprove,
    isApproving,
  }
}

export default useHrmExemptionTable
