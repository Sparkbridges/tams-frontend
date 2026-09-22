import { TamsTableActionPopover } from '#/components/molecules'
import {
  useDeleteBulkOrganizationBranch,
  useDeleteOrganizationBranch,
  useFetchOrganizationBranches,
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

const useOrganizationBranchTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')
  const [selectedBranchId, setSelectedBranchId] = useState<
    string | number | null
  >(null)
  const [selectedBranchIds, setSelectedBranchIds] = useState<
    number[]
  >([])
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
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
  const { data: branches, isLoading } = useFetchOrganizationBranches(
    {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
    },
    (data) => data.data,
  )
  const { mutateAsync: deleteOrganizationBranch, isPending: isDeleting } =
    useDeleteOrganizationBranch()

  const {
    mutateAsync: deleteBulkOrganizationBranches,
    isPending: isDeletingBulk,
  } = useDeleteBulkOrganizationBranch()

  const navigate = useNavigate()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedBranchId(row.id as number)
    openDetailDrawer()
  }

  useEffect(() => {
    if (branches?.results) {
      const formattedData = branches.results.map((branch) => ({
        id: branch.id,
        branchName: branch.station_name,
        manager: branch.branch_head_name,
        location: branch.city,
        status: !branch.deleted_at ? 'Active' : 'Inactive',
      }))
      setTableData(formattedData)
      setTotal(branches.total)
    }
  }, [branches?.results, setTableData, setTotal])

  const handleDelete = async () => {
    try {
      await deleteOrganizationBranch({ company_id: selectedBranchId as number })
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

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    {
      label: 'Edit',
      action: () =>
        navigate({
          to: `/admin-dashboard/organization/branch/edit`,
          search: { branchId: row.id as number },
        }),
      color: '',
      icon: PenIcon,
    },
    {
      label: 'Delete',
      action: () => {
        setSelectedBranchId(row.id as number)
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
      label: 'Branch Name',
      accessor: 'branchName',
    },
    {
      label: 'Manager',
      accessor: 'manager',
    },
    {
      label: 'Location',
      accessor: 'location',
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
      await deleteBulkOrganizationBranches({ branchIds: selectedBranchIds })
      closeBulkDeleteConfirmation()
      setSelectedBranchIds([])
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
    setSelectedBranchIds(rows)
    openBulkDeleteConfirmation()
  }

  const handleCloseBulkDelete = () => {
    closeBulkDeleteConfirmation()
    setSelectedBranchIds([])
  }

  const bulkSelectionOptions: TamsTableBulkSelection[] = [
    {
      label: 'Delete',
      action: (rows: number[]) => handleBulkDeleteConfirmation(rows),
      color: 'red',
      variant: 'outline',
    },
  ]
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
    selectedBranchId,
    handleBulkDeleteAction,
    isDeletingBulk,
    openedBulkDeleteConfirmation,
    handleCloseBulkDelete,
    selectedBranchIds
  }
}

export default useOrganizationBranchTable
