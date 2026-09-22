import { TamsTableActionPopover } from '#/components/molecules'
import {
  useActivateOrganizationEmployees,
  useArchiveOrganizationEmployees,
  useDeactivateOrganizationEmployees,
  useDeleteArchivedOrganizationEmployees,
  useFetchArchivedOrganizationEmployees,
  useFetchOrganizationAllEmployees,
  useRestoreArchivedOrganizationEmployees,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { newDayjs } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  PenIcon,
  TrashIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  activeTab: string | null
}
const useOrganizationEmployeeTable = ({ activeTab }: Props) => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')

  const [action, setAction] = useState<
    'delete' | 'restore' | 'deactivate' | 'archive' | 'activate' | null
  >(null)

  const [actionType, setActionType] = useState<'bulk' | 'single' | null>(null)

  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const [
    openedBulkActionConfirmation,
    { open: openBulkActionConfirmation, close: closeBulkActionConfirmation },
  ] = useDisclosure(false)

  const limit = 10
  const { data: employees, isLoading: isLoadingEmployees } =
    useFetchOrganizationAllEmployees(
      {
        page: page,
        perPage: limit,
        search_query: search?.length ? search : undefined,
        status:
          !statusFilter || statusFilter === 'all' ? undefined : statusFilter,
      },
      (data) => data.data,
    )

  const { data: archivedEmployees, isLoading: isArchivedLoading } =
    useFetchArchivedOrganizationEmployees(
      {
        page: page,
        perPage: limit,
        search_query: search?.length ? search : undefined,
      },
      (data) => data.data,
    )
  const {
    mutateAsync: deleteArchivedOrganizationEmployees,
    isPending: isDeleting,
  } = useDeleteArchivedOrganizationEmployees()

  const {
    mutateAsync: restoreArchivedOrganizationEmployees,
    isPending: isRestoring,
  } = useRestoreArchivedOrganizationEmployees()

  const { mutateAsync: archiveOrganizationEmployees, isPending: isArchiving } =
    useArchiveOrganizationEmployees()

  const {
    mutateAsync: deactivateOrganizationEmployees,
    isPending: isDeactivating,
  } = useDeactivateOrganizationEmployees()

  const {
    mutateAsync: activateOrganizationEmployees,
    isPending: isActivating,
  } = useActivateOrganizationEmployees()

  const isLoading = isLoadingEmployees || isArchivedLoading

  useEffect(() => {
    let formattedData: TamsTableData[] = []
    const employeesData = employees?.results
    const archivedEmployeesData = archivedEmployees?.results
    if (activeTab === 'all' && employeesData) {
      formattedData = employees.results.map((employee) => ({
        customId: employee.custom_employee_id || '-',
        name: employee.name ? employee.name : '-',
        pin: employee.pin || '-',
        status: employee.status || '-',
        email: employee.email || '-',
        designation: employee.designation || '-',
        branch: employee.branch || '-',
        department: employee.department || '-',
        id: employee.id,
      }))
    } else if (activeTab === 'archived' && archivedEmployeesData) {
      formattedData = archivedEmployees.results.map((employee) => ({
        name: employee.name ? employee.name : '-',
        pin: employee.pin || '-',
        status: employee.status || '-',
        email: employee.email || '-',
        designation: employee.designation || '-',
        branch: employee.branch || '-',
        department: employee.department || '-',
        id: employee.id,
        dateArchived:
          newDayjs(employee.date_archived).format('MMM, ddd MM, YYYY') || '-',
      }))
    }
    setTableData(formattedData)
    setTotal(
      activeTab === 'all'
        ? employees?.total || 0
        : archivedEmployees?.total || 0,
    )
  }, [
    employees?.results,
    setTableData,
    setTotal,
    activeTab,
    archivedEmployees?.results,
  ])

  useEffect(() => {
    setSearch(undefined)
    setPage(1)
  }, [activeTab])

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData?.length === 0 && !isLoading) {
      if (search?.length) {
        return emptyStates.employees[1]
      }
      if (statusFilter && statusFilter !== 'all') {
        return emptyStates.employees[1]
      }
      if (activeTab === 'archived') {
        return emptyStates.archived[0]
      }
      if (activeTab === 'all') {
        return emptyStates.employees[0]
      }
      return emptyStates.employees[0]
    }
    return emptyStates.employees[0]
  }, [tableData, search, statusFilter, activeTab, isLoading])

  const handleAction = (
    row: number | number[],
    type: 'delete' | 'restore' | 'deactivate' | 'archive' | 'activate',
    actionTypeValue: 'single' | 'bulk',
  ) => {
    if (actionTypeValue === 'single') {
      setSelectedId(row as number)
      openConfirmation()
    } else {
      setSelectedIds(row as number[])
      openBulkActionConfirmation()
    }
    setAction(type)
    setActionType(actionTypeValue)
  }

  const handleDelete = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await deleteArchivedOrganizationEmployees({ id: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to delete archived organization employees', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete archived organization employees',
        color: 'red',
      })
    }
  }

  const handleRestore = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await restoreArchivedOrganizationEmployees({ id: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
        return
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to restore archived organization employees', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to restore archived organization employees',
        color: 'red',
      })
    }
  }

  const handleArchive = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await archiveOrganizationEmployees({ id: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
        return
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to archive organization employees', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to archive organization employees',
        color: 'red',
      })
    }
  }

  const handleDeactivate = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await deactivateOrganizationEmployees({ id: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
        return
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to deactivate organization employees', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to deactivate organization employees',
        color: 'red',
      })
    }
  }

  const handleActivate = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await activateOrganizationEmployees({ id: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
        return
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to activate organization employees', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to activate organization employees',
        color: 'red',
      })
    }
  }

  const handleRowClick = (row: TamsTableData) => {
    navigate({
      to: `/admin-dashboard/organization/employees/details/$id`,
      params: { id: row.id?.toString() ?? '' },
    })
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => {
    const options: TamsActionPopoverOption[] =
      activeTab === 'all'
        ? [
            {
              label: 'Edit',
              action: () =>
                navigate({
                  to: `/admin-dashboard/organization/employees/edit`,
                  search: { employeeId: row.id as number },
                }),
              color: 'blue',
              icon: PenIcon,
            },
            {
              label: 'Archive',
              action: () => handleAction(row.id as number, 'archive', 'single'),
              color: 'gray',
              icon: ArchiveIcon,
            },
            ...(row.status === 'Active'
              ? [
                  {
                    label: 'Deactivate',
                    action: () =>
                      handleAction(row.id as number, 'deactivate', 'single'),
                    color: 'red',
                    icon: XCircleIcon,
                  },
                ]
              : [
                  {
                    label: 'Activate',
                    action: () =>
                      handleAction(row.id as number, 'activate', 'single'),
                    color: 'green',
                    icon: CheckCircleIcon,
                  },
                ]),
          ]
        : [
            {
              label: 'Restore',
              action: () => handleAction(row.id as number, 'restore', 'single'),
              color: 'green',
              icon: ArrowCounterClockwiseIcon,
            },
            {
              label: 'Delete',
              action: () => handleAction(row.id as number, 'delete', 'single'),
              color: 'red',
              icon: TrashIcon,
            },
          ]

    return options
  }

  const columns: TamsTableColumn[] = useMemo(() => {
    const cols: TamsTableColumn[] = [
      {
        type: 'checkbox',
        label: '',
        accessor: '',
      },
      {
        label: 'Custom ID',
        accessor: 'customId',
        enableSorting: true,
        width: 150,
      },
      {
        label: 'Name',
        accessor: 'name',
        enableSorting: true,
        width: 200,
      },
      {
        label: 'Pin',
        accessor: 'pin',
        enableSorting: true,
      },
      {
        label: 'Email',
        accessor: 'email',
        enableSorting: true,
      },
      {
        label: 'Designation',
        accessor: 'designation',
      },
      {
        label: 'Branch',
        accessor: 'branch',
        width: 200,
      },
      {
        label: 'Department',
        accessor: 'department',
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
    if (activeTab === 'archived') {
      cols.splice(8, 0, {
        label: 'Archived At',
        accessor: 'dateArchived',
        enableSorting: true,
      })
      cols.splice(1, 1)
      cols.splice(8, 1)
      return cols
    }
    return cols
  }, [activeTab])

  const bulkSelectionOptions: TamsTableBulkSelection[] = useMemo(() => {
    if (activeTab === 'archived') {
      return [
        {
          label: 'Restore',
          action: (rows: number[]) => handleAction(rows, 'restore', 'bulk'),
          color: 'green',
          variant: 'outline',
        },
        {
          label: 'Delete',
          action: (rows: number[]) => handleAction(rows, 'delete', 'bulk'),
          color: 'red',
          variant: 'outline',
        },
      ]
    }
    return [
      {
        label: 'Archive',
        action: (rows: number[]) => handleAction(rows, 'archive', 'bulk'),
        color: 'gray',
        variant: 'light',
      },
    ]
  }, [activeTab])

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]

  const modalAction = {
    restore: {
      title: actionType === 'bulk' ? 'Restore Employees' : 'Restore Employee',
      message:
        actionType === 'bulk'
          ? 'Are you sure you want to restore these employees?'
          : 'Are you sure you want to restore this employee?',
      action: () => handleRestore(actionType === 'bulk' ? 'bulk' : 'single'),
      loading: isRestoring,
    },
    delete: {
      title: actionType === 'bulk' ? 'Delete Employees' : 'Delete Employee',
      message:
        actionType === 'bulk'
          ? 'Are you sure you want to delete these employees permanently?'
          : 'Are you sure you want to delete this employee permanently?',
      action: () => handleDelete(actionType === 'bulk' ? 'bulk' : 'single'),
      loading: isDeleting,
    },
    archive: {
      title: actionType === 'bulk' ? 'Archive Employees' : 'Archive Employee',
      message:
        actionType === 'bulk'
          ? 'Are you sure you want to archive these employees?'
          : 'Are you sure you want to archive this employee?',
      action: () => handleArchive(actionType === 'bulk' ? 'bulk' : 'single'),
      loading: isArchiving,
    },
    deactivate: {
      title:
        actionType === 'bulk' ? 'Deactivate Employees' : 'Deactivate Employee',
      message:
        actionType === 'bulk'
          ? 'Are you sure you want to deactivate these employees?'
          : 'Are you sure you want to deactivate this employee?',
      action: () => handleDeactivate(actionType === 'bulk' ? 'bulk' : 'single'),
      loading: isDeactivating,
    },
    activate: {
      title: actionType === 'bulk' ? 'Activate Employees' : 'Activate Employee',
      message:
        actionType === 'bulk'
          ? 'Are you sure you want to activate these employees?'
          : 'Are you sure you want to activate this employee?',
      action: () => handleActivate(actionType === 'bulk' ? 'bulk' : 'single'),
      loading: isActivating,
    },
  }
  return {
    columns,
    tableData,
    isLoading,
    page,
    setPage,
    limit,
    search,
    setSearch,
    total,
    setTotal,
    bulkSelectionOptions,
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    isDeleting,
    handleRowClick,
    selectedId,
    selectedIds,
    openedBulkActionConfirmation,
    closeBulkActionConfirmation,
    statusFilter,
    setStatusFilter,
    statusOptions,
    emptyState,
    modalInfo: modalAction[action as keyof typeof modalAction] || null,
  }
}

export default useOrganizationEmployeeTable
