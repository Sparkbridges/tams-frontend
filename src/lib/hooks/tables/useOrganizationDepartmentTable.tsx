import { TamsTableActionPopover } from '#/components/molecules'
import {
  useDeleteOrganizationDepartment,
  useFetchOrganizationDepartments,
} from '#/lib/api'
import type {
  TamsActionPopoverOption,
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
} from '#/lib/types'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { PenIcon, TrashIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const useOrganizationDepartmentTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [selectedRow, setSelectedRow] = useState<TamsTableData | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)
  const [
    openedBulkActionConfirmation,
    { open: openBulkActionConfirmation, close: closeBulkActionConfirmation },
  ] = useDisclosure(false)
  const [
    openedDetailDrawer,
    { open: openDetailDrawer, close: closeDetailDrawer },
  ] = useDisclosure(false)
  const limit = 10
  const { data: departments, isLoading } = useFetchOrganizationDepartments(
    {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
    },
    (data) => data.data,
  )
  const { mutateAsync: deleteOrganizationDepartment, isPending: isDeleting } =
    useDeleteOrganizationDepartment()

  const navigate = useNavigate()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedRow(row)
    openDetailDrawer()
  }

  useEffect(() => {
    if (departments?.results) {
      const formattedData = departments.results.map((branch) => ({
        id: branch.id,
        departmentName: branch.department_name || '-',
        groupDepartment: branch.group_department_name || '-',
        branches: branch.branch || '-',
        headOfDepartment: branch.department_head_name || '-',
        status: branch.is_active ? 'Active' : 'Inactive',
        createdAt: branch.created_at || '-',
        updatedAt: branch.updated_at || '-',
        notes: branch.notes,
      }))
      setTableData(formattedData)
      setTotal(departments.total)
    }
  }, [departments?.results, setTableData, setTotal])

  const handleDelete = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await deleteOrganizationDepartment({ departmentIds: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
      }
      closeConfirmation()
     
    } catch (error) {
      console.error('Failed to delete organization department', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete organization department',
        color: 'red',
      })
    }
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    {
      label: 'Edit',
      action: () =>
        navigate({
          to: `/admin-dashboard/organization/department/edit`,
          search: { departmentId: row.id as number },
        }),
      color: '',
      icon: PenIcon,
    },
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
      label: 'Department Name',
      accessor: 'departmentName',
      enableSorting: true,
    },
    {
      label: 'Group Department',
      accessor: 'groupDepartment',
    },
    {
      label: 'Branches',
      accessor: 'branches',
    },
    {
      label: 'Head of Department',
      accessor: 'headOfDepartment',
    },
    {
      label: '',
      accessor: 'actions',
      render: (row) => (
        <TamsTableActionPopover data={actionPopoverOptions(row)} />
      ),
    },
  ]

  const bulkSelectionOptions: TamsTableBulkSelection[] = [
    {
      label: 'Delete',
      action: (rows: number[]) => handleDeleteBulkConfirmation(rows),
      color: 'red',
      variant: 'outline',
    },
  ]

  const handleDeleteBulkConfirmation = (rows: number[]) => {
    setSelectedIds(rows)
    openBulkActionConfirmation()
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
    selectedIds,
    openedBulkActionConfirmation,
    closeBulkActionConfirmation,
    selectedRow,
  }
}

export default useOrganizationDepartmentTable
