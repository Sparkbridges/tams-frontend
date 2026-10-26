import { TamsButton, TamsPopover } from '#/components'
import { TamsTableActionPopover } from '#/components/molecules'
import {
  useDeleteHrmLeaveApprover,
  useDeleteHrmLeaveType,
  useGetHrmLeaveApprovers,
  useGetHrmLeaveTypes,
  useUpdateHrmLeaveTypeStatus,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import {
  getErrorMessage,
  transformHrmSettingsLeaveApprovers,
  transformHrmSettingsLeaveTypes,
} from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  CaretDownIcon,
  CheckCircleIcon,
  PenIcon,
  TrashIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import type { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  activeTab: 'leave_type' | 'leave_approver' | null
}

const useHrmLeaveSettingsTable = ({ activeTab }: Props) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string | undefined>()
  const [selectedRow, setSelectedRow] = useState<TamsTableData | null>(null)
  const [selectedRow2, setSelectedRow2] = useState<TamsTableData | null>(null)
  const [
    openedDeleteConfirmation,
    { open: openDeleteConfirmation, close: closeDeleteConfirmation },
  ] = useDisclosure(false)

  const [
    openedDeactivateConfirmation,
    { open: openDeactivateConfirmation, close: closeDeactivateConfirmation },
  ] = useDisclosure(false)

  const [
    openedReassignConfirmation,
    { open: openReassignConfirmation, close: closeReassignConfirmation },
  ] = useDisclosure(false)

  const [
    openedDetailDrawer,
    { open: openDetailDrawer, close: closeDetailDrawer },
  ] = useDisclosure(false)

  const [
    openedReassignDrawer,
    { open: openReassigDrawer, close: closeReassigDrawer },
  ] = useDisclosure(false)

  const [
    openedEditHrmLeaveApproverDrawer,
    {
      open: openEditHrmLeaveApproverDrawer,
      close: closeEditHrmLeaveApproverDrawer,
    },
  ] = useDisclosure(false)

  const [
    openedDeleteApproverConfirmation,
    {
      open: openDeleteApproverConfirmation,
      close: closeDeleteApproverConfirmation,
    },
  ] = useDisclosure(false)

  const limit = 10

  const { data: leaveTypes, isLoading: isLoadingLeaveTypes } =
    useGetHrmLeaveTypes(
      ({ data }) => {
        return {
          total: data.total,
          data: transformHrmSettingsLeaveTypes(data.results),
        }
      },
      {
        page,
        perPage: limit,
        search_query: !search ? undefined : search,
      },
      activeTab === 'leave_type',
    )

  const { data: leaveApprovers, isLoading: isLoadingLeaveApprovers } =
    useGetHrmLeaveApprovers(
      {
        page,
        perPage: limit,
        search_query: !search ? undefined : search,
      },
      ({ data }) => {
        return {
          total: data.total,
          data: transformHrmSettingsLeaveApprovers(data.results),
        }
      },
      activeTab === 'leave_approver',
    )

  const { mutateAsync: deleteHrmLeaveType, isPending: isDeleting } =
    useDeleteHrmLeaveType()

  const { mutateAsync: updateHrmLeaveTypeStatus, isPending: isUpdatingStatus } =
    useUpdateHrmLeaveTypeStatus()

  const { mutateAsync: deleteHrmLeaveApprover, isPending: isDeletingApprover } =
    useDeleteHrmLeaveApprover()

  const tableData: TamsTableData[] = useMemo(() => {
    return activeTab === 'leave_type'
      ? leaveTypes?.data
        ? leaveTypes.data
        : []
      : activeTab === 'leave_approver'
        ? leaveApprovers?.data
          ? leaveApprovers.data
          : []
        : []
  }, [leaveTypes, activeTab, leaveApprovers])

  const total = useMemo(() => {
    return activeTab === 'leave_type'
      ? leaveTypes?.total
      : activeTab === 'leave_approver'
        ? leaveApprovers?.total
        : 0
  }, [leaveTypes, activeTab, leaveApprovers])

  const handleRowClick = (row: TamsTableData) => {
    activeTab === 'leave_approver' ? setSelectedRow2(row) : setSelectedRow(row)

    activeTab === 'leave_approver'
      ? openEditHrmLeaveApproverDrawer()
      : openDetailDrawer()
  }

  const handleDelete = async () => {
    try {
      await deleteHrmLeaveType(selectedRow?.id as number)
      closeDeleteConfirmation()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      const errorStatus = (error as AxiosError).status
      const { canDeactivate, canReassign } =
        leaveTypes?.data?.find(
          (leaveType) => leaveType.id === selectedRow?.id,
        ) || {}

      if (errorStatus === 422) {
        if (canDeactivate) {
          openDeactivateConfirmation()
          closeDeleteConfirmation()
        }

        if (canReassign) {
          openReassignConfirmation()
          closeDeleteConfirmation()
        }
      }

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const handleDeactivate = async () => {
    try {
      await updateHrmLeaveTypeStatus({
        id: Number(selectedRow?.id),
        is_active: selectedRow?.status !== 'Active',
      })
      closeDeactivateConfirmation()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const handleDeleteApprover = async () => {
    try {
      await deleteHrmLeaveApprover({
        approverIds: [selectedRow2?.id as number],
      })
      closeDeleteApproverConfirmation()
      setSelectedRow2(null)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const handleReassign = async () => {
    openReassigDrawer()
    closeReassignConfirmation()
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    {
      label: 'Edit',
      action: () => handleRowClick(row),
      color: '',
      icon: PenIcon,
    },
    {
      label: row.status === 'Active' ? 'Deactivate' : 'Activate',
      action: () => {
        setSelectedRow(row)
        openDeactivateConfirmation()
      },
      color: row.status === 'Active' ? 'orange' : 'green',
      icon: row.status === 'Active' ? WarningCircleIcon : CheckCircleIcon,
    },
    ...(row.status === 'Active'
      ? [
          {
            label: 'Delete',
            action: () => {
              setSelectedRow(row)
              openDeleteConfirmation()
            },
            color: 'red',
            icon: TrashIcon,
          },
        ]
      : []),
  ]

  const actionPopoverApproverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    {
      label: 'Edit',
      action: () => handleRowClick(row),
      color: '',
      icon: PenIcon,
    },
    {
      label: 'Delete',
      action: () => {
        setSelectedRow2(row)
        openDeleteApproverConfirmation()
      },
      color: 'red',
      icon: TrashIcon,
    },
  ]

  const columns: TamsTableColumn[] = useMemo(() => {
    let cols = [] as TamsTableColumn[]
    if (activeTab === 'leave_type') {
      cols = [
        {
          label: 'Leave Type',
          accessor: 'name',
        },
        {
          label: 'No of days',
          accessor: 'noOfDays',
        },
        {
          label: 'Paid leave',
          accessor: 'isPaid',
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
    } else {
      cols = [
        {
          label: 'Employee Group',
          accessor: 'description',
        },
        {
          label: 'Approval Types',
          accessor: 'approvalTypes',
        },
        {
          label: 'No Of Approvals',
          accessor: 'noOfApprovals',
        },
        {
          label: 'Employees assigned',
          accessor: 'employee_assigned',
          render: (row) => {
            const employees = Array.isArray(row.employees)
              ? (row.employees as {
                  id: number
                  employee_name: string
                }[])
              : []
            if (employees.length === 0) return '-'
            if (employees.length === 1) return employees[0].employee_name
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
                    {employees[0].employee_name}
                  </TamsButton>
                }
              >
                <div className="space-y-1.5">
                  {employees?.map((item, index) => (
                    <div
                      className="p-2  hover:bg-gray-100 text-xs text-gray-800"
                      key={index}
                    >
                      {item.employee_name}
                    </div>
                  ))}
                </div>
              </TamsPopover>
            )
          },
        },
        {
          label: '',
          accessor: 'actions',
          render: (row) => (
            <TamsTableActionPopover data={actionPopoverApproverOptions(row)} />
          ),
        },
      ]
    }
    return [
      {
        label: 'ID',
        accessor: 'id',
        enableSorting: true,
      },
      ...cols,
    ]
  }, [activeTab])

  useEffect(() => {
    setSelectedRow(null)
    setSelectedRow2(null)
    setSearch(undefined)
  }, [activeTab, setSelectedRow2, setSelectedRow])

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (
      tableData?.length === 0 &&
      (!isLoadingLeaveTypes || !isLoadingLeaveApprovers)
    ) {
      if (search?.length) {
        return activeTab === 'leave_type'
          ? emptyStates.hrmLeaveTypeSettings[1]
          : emptyStates.hrmLeaveApproversSettings[1]
      }
      return activeTab === 'leave_type'
        ? emptyStates.hrmLeaveTypeSettings[0]
        : emptyStates.hrmLeaveApproversSettings[0]
    }
    return activeTab === 'leave_type'
      ? emptyStates.hrmLeaveTypeSettings[0]
      : emptyStates.hrmLeaveApproversSettings[0]
  }, [
    tableData,
    search,
    isLoadingLeaveApprovers,
    isLoadingLeaveTypes,
    activeTab,
  ])

  return {
    handleDeleteApprover,
    openedDeleteApproverConfirmation,
    closeDeleteApproverConfirmation,
    openedEditHrmLeaveApproverDrawer,
    closeEditHrmLeaveApproverDrawer,
    openedReassignDrawer,
    closeReassigDrawer,
    columns,
    isDeleting: isDeletingApprover || isDeleting,
    isUpdatingStatus,
    tableData,
    isLoading: isLoadingLeaveTypes || isLoadingLeaveApprovers,
    openedDeactivateConfirmation,
    closeDeactivateConfirmation,
    handleDeactivate,
    handleReassign,
    openedReassignConfirmation,
    closeReassignConfirmation,
    page,
    setPage,
    limit,
    search,
    setSearch,
    total,
    openedDeleteConfirmation,
    closeDeleteConfirmation,
    handleDelete,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedRow,
    setSelectedRow,
    selectedRow2,
    setSelectedRow2,
    emptyState,
    leaveTypes: leaveTypes ?? [],
    searchPlaceholder:
      activeTab === 'leave_type'
        ? 'Search by Leave type name'
        : 'Search by Leave Approver name',
  }
}

export default useHrmLeaveSettingsTable
