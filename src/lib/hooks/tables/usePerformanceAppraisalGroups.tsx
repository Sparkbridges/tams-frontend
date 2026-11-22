import {
  useArchiveAppraisalGroup,
  useBulkArchiveAppraisalGroups,
  useEndAppraisalGroup,
  useFetchAppraisalGroups,
  useFetchArchivedAppraisalGroups,
  useInitiateAppraisalGroup,
  usePermanentlyDeleteAppraisalGroups,
  useRestoreAppraisalGroups,
} from '#/lib/api'
import { TamsTableActionPopover } from '#/components'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import type { TAppraisalGroup } from '#/lib/types/api/performance'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  ArchiveIcon,
  ArrowClockwiseIcon,
  EyeIcon,
  PencilIcon,
  PlayIcon,
  ProhibitIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

type Props = {
  activeTab: 'all' | 'archived'
}

const usePerformanceAppraisalGroups = ({ activeTab }: Props) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [periodFilter, setPeriodFilter] = useState<string | undefined>()
  const [selectedGroup, setSelectedGroup] = useState<TAppraisalGroup | null>(
    null,
  )
  const [actionType, setActionType] = useState<
    'archive' | 'restore' | 'delete' | 'initiate' | 'end' | null
  >(null)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const params = {
    page,
    perPage: 10,
    search_query: debouncedSearch || undefined,
    appraisal_period_id: periodFilter ? Number(periodFilter) : undefined,
  }

  const activeQuery = useFetchAppraisalGroups(
    params,
    (response) => response.data,
  )
  const archivedQuery = useFetchArchivedAppraisalGroups(
    params,
    (response) => response.data,
  )
  const query = activeTab === 'archived' ? archivedQuery : activeQuery

  const archiveMutation = useArchiveAppraisalGroup()
  const bulkArchiveMutation = useBulkArchiveAppraisalGroups()
  const restoreMutation = useRestoreAppraisalGroups()
  const deleteMutation = usePermanentlyDeleteAppraisalGroups()
  const initiateMutation = useInitiateAppraisalGroup()
  const endMutation = useEndAppraisalGroup()

  const groups = query.data?.results ?? []
  const total = query.data?.total ?? 0

  const tableData: TamsTableData[] = groups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description || 'Not provided',
    period: group.appraisalPeriod?.name || 'Not provided',
    year: group.appraisal_year,
    status: group.has_ended ? 'Ended' : group.is_active ? 'Started' : 'Pending',
  }))

  const openAction = (
    group: TAppraisalGroup,
    type: 'archive' | 'restore' | 'delete' | 'initiate' | 'end',
  ) => {
    setSelectedGroup(group)
    setActionType(type)
    openConfirmation()
  }

  const actionOptions = (row: TamsTableData): TamsActionPopoverOption[] => {
    const group = groups.find((item) => item.id === row.id)
    if (!group) return []

    return [
      {
        label: 'View',
        color: '',
        action: () =>
          navigate({
            to: '/admin-dashboard/performance/appraisal/$id',
            params: { id: String(group.id) },
          }),
        icon: EyeIcon,
      },
      {
        label: 'Edit',
        color: '',
        action: () =>
          navigate({
            to: '/admin-dashboard/performance/appraisal/edit/$id',
            params: { id: String(group.id) },
          }),
        icon: PencilIcon,
        hidden: activeTab === 'archived' || group.has_ended || group.is_active,
      },
      {
        label: 'Send for appraisal',
        action: () => openAction(group, 'initiate'),
        color: 'green',
        icon: PlayIcon,
        hidden: activeTab === 'archived' || group.has_ended || group.is_active,
      },
      {
        label: 'End appraisal',
        action: () => openAction(group, 'end'),
        color: 'orange',
        icon: ProhibitIcon,
        hidden: activeTab === 'archived' || group.has_ended || !group.is_active,
      },
      {
        label: 'Restore',
        action: () => openAction(group, 'restore'),
        color: 'blue',
        icon: ArrowClockwiseIcon,
        hidden: activeTab !== 'archived',
      },
      {
        label: 'Archive',
        action: () => openAction(group, 'archive'),
        color: 'gray',
        icon: ArchiveIcon,
        hidden: activeTab === 'archived',
      },
      {
        label: 'Delete permanently',
        action: () => openAction(group, 'delete'),
        color: 'red',
        icon: TrashIcon,
        hidden: activeTab !== 'archived',
      },
    ]
  }

  const columns: TamsTableColumn[] = [
    { label: 'ID', accessor: 'id', enableSorting: true, width: 60 },
    { label: 'Appraisal Group', accessor: 'name', enableSorting: true },
    { label: 'Description', accessor: 'description' },
    { label: 'Period', accessor: 'period' },
    { label: 'Year', accessor: 'year' },
    { label: 'Status', accessor: 'status' },
    {
      label: '',
      accessor: 'actions',
      render: (row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <TamsTableActionPopover data={actionOptions(row)} />
        </div>
      ),
    },
  ]

  const handleConfirmation = async () => {
    if (!selectedGroup || !actionType) return
    if (actionType === 'archive') {
      await archiveMutation.mutateAsync(selectedGroup.id)
    } else if (actionType === 'restore') {
      await restoreMutation.mutateAsync([selectedGroup.id])
    } else if (actionType === 'delete') {
      await deleteMutation.mutateAsync([selectedGroup.id])
    } else if (actionType === 'initiate') {
      await initiateMutation.mutateAsync(selectedGroup.id)
    } else if (actionType === 'end') {
      await endMutation.mutateAsync(selectedGroup.id)
    }
    closeConfirmation()
    setSelectedGroup(null)
    setActionType(null)
  }

  const closeConfirmationModal = () => {
    closeConfirmation()
    setSelectedGroup(null)
    setActionType(null)
  }

  const bulkSelectionOptions: TamsTableBulkSelection[] =
    activeTab === 'all'
      ? [
          {
            label: 'Archive selected',
            action: (ids) => bulkArchiveMutation.mutate(ids),
            color: 'orange',
          },
        ]
      : [
          {
            label: 'Restore selected',
            action: (ids) => restoreMutation.mutate(ids),
            color: 'blue',
          },
          {
            label: 'Delete selected',
            action: (ids) => deleteMutation.mutate(ids),
            color: 'red',
          },
        ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData.length === 0 && !query.isLoading) {
      if (search.length) return emptyStates.appraisalGroups[1]
      if (activeTab === 'archived')
        return emptyStates.archivedAppraisalGroups[0]
      return emptyStates.appraisalGroups[0]
    }
    return emptyStates.appraisalGroups[0]
  }, [tableData.length, query.isLoading, search, activeTab])

  return {
    page,
    setPage,
    search,
    setSearch,
    periodFilter,
    setPeriodFilter,
    tableData,
    columns,
    total,
    loading: query.isLoading,
    emptyState,
    bulkSelectionOptions,
    openedConfirmation,
    closeConfirmationModal,
    handleConfirmation,
    actionType,
    selectedGroup,
    isPending:
      archiveMutation.isPending ||
      bulkArchiveMutation.isPending ||
      restoreMutation.isPending ||
      deleteMutation.isPending ||
      initiateMutation.isPending ||
      endMutation.isPending,
  }
}

export default usePerformanceAppraisalGroups
