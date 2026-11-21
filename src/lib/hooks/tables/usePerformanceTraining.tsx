import { TamsTableActionPopover } from '#/components'
import {
  useApprovePerformanceTraining,
  useDeletePerformanceTraining,
  useFetchPerformanceTrainings,
  usePerformanceAccess,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { normalizeStrings } from '#/lib/utils'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  ProhibitIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

const usePerformanceTraining = () => {
  const { canDeleteTraining } = usePerformanceAccess()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')
  const [typeFilter, setTypeFilter] = useState<string | undefined>('all')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const [selectedRow, setSelectedRow] = useState<TamsTableData | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)

  const handleOpenDetails = (row: TamsTableData) => {
    if (typeof row.id === 'number') setDetailId(row.id)
  }
  const handleCloseDetails = () => setDetailId(null)

  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const [actionType, setActionType] = useState<
    'approve' | 'reject' | 'delete' | null
  >(null)

  const navigate = useNavigate()

  const { data: performanceTrainings, isLoading: loading } =
    useFetchPerformanceTrainings(
      (data) => {
        return {
          results: data.data.results.map((item) => ({
            title: item.title,
            assigned_to: item.assignments.length + ' employee(s)',
            duration_days: item.duration_days ?? 'Not provided',
            status: item.status,
            id: item.id,
            type: normalizeStrings(item.type),
          })),
          total: data.data.total,
        }
      },
      {
        page,
        perPage: 10,
        search_query: debouncedSearch,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      },
    )

  const approveMutationAsync = useApprovePerformanceTraining()
  const deleteMutationAsync = useDeletePerformanceTraining()

  const handleAction = async () => {
    try {
      if (actionType === 'approve' && selectedRow) {
        await approveMutationAsync.mutateAsync({
          status: 'approved',
          id: selectedRow.id as number,
        })
      } else if (actionType === 'delete' && selectedRow && canDeleteTraining) {
        await deleteMutationAsync.mutateAsync(selectedRow.id as number)
      } else if (actionType === 'reject' && selectedRow) {
        await approveMutationAsync.mutateAsync({
          status: 'rejected',
          id: selectedRow.id as number,
        })
      }
      handleCloseConfirmation()
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenConfirmation = (
    row: TamsTableData,
    type: 'approve' | 'reject' | 'delete',
  ) => {
    setSelectedRow(row)
    setActionType(type)
    openConfirmation()
  }

  const handleCloseConfirmation = () => {
    setSelectedRow(null)
    setActionType(null)
    closeConfirmation()
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => [
    {
      label: 'View Details',
      action: () => handleOpenDetails(row),
      color: '',
      icon: EyeIcon,
    },
    {
      label: 'Edit',
      action: () =>
        navigate({
          to: '/admin-dashboard/performance/training/edit',
          search: { trainingId: row.id as number },
        }),
      color: '',
      icon: PencilIcon,
      hidden: row.status !== 'pending',
    },
    {
      label: 'Approve',
      action: () => handleOpenConfirmation(row, 'approve'),
      color: 'green',
      icon: CheckCircleIcon,
      hidden: row.status === 'approved',
    },
    {
      label: 'Reject',
      action: () => handleOpenConfirmation(row, 'reject'),
      color: 'orange',
      icon: ProhibitIcon,
      hidden: row.status !== 'approved',
    },
    {
      label: 'Delete',
      action: () => handleOpenConfirmation(row, 'delete'),
      color: 'red',
      icon: TrashIcon,
      hidden: row.status !== 'pending' || !canDeleteTraining,
    },
  ]

  const columns: TamsTableColumn[] = [
    {
      label: 'ID',
      accessor: 'id',
      enableSorting: true,
    },
    {
      label: 'Title',
      accessor: 'title',
      enableSorting: true,
    },
    {
      label: 'Assigned To',
      accessor: 'assigned_to',
    },
    {
      label: 'Duration (days)',
      accessor: 'duration_days',
    },
    {
      label: 'Type',
      accessor: 'type',
    },
    {
      label: 'Status',
      accessor: 'status',
    },
    {
      label: '',
      accessor: 'actions',
      render: (row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <TamsTableActionPopover data={actionPopoverOptions(row)} />
        </div>
      ),
    },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (performanceTrainings?.results?.length === 0 && !loading) {
      if (search?.length) {
        return emptyStates.performanceTrainings[1]
      }
      if (statusFilter && statusFilter !== 'all') {
        return emptyStates.performanceTrainings[1]
      }
      if (typeFilter && typeFilter !== 'all') {
        return emptyStates.performanceTrainings[1]
      }
      return emptyStates.performanceTrainings[0]
    }
    return emptyStates.performanceTrainings[0]
  }, [performanceTrainings?.results, search, statusFilter, typeFilter])
  return {
    page,
    setPage,
    search,
    setSearch,
    loading,
    tableData: performanceTrainings?.results as TamsTableData[],
    total: performanceTrainings?.total,
    columns,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    handleCloseConfirmation,
    handleAction,
    actionType,
    openedConfirmation,
    detailId,
    handleOpenDetails,
    handleCloseDetails,
    emptyState,
    isPending: approveMutationAsync.isPending || deleteMutationAsync.isPending,
  }
}

export default usePerformanceTraining
