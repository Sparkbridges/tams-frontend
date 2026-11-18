import {
  useDeletePerformanceTaskProject,
  useFetchOrganizationBranches,
  useFetchOrganizationTeams,
  useFetchPerformanceTaskProjects,
  useUpdateProjectStatus,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type { TamsActionPopoverOption, TamsTableEmptyState } from '#/lib/types'
import type { TFetchPerformanceTaskProject } from '#/lib/types/api/performance'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  CheckCircleIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

type Props = {
  activeTab: 'all' | 'archived'
}

const usePerformanceTaskProjects = ({ activeTab }: Props) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<
    'pending' | 'active' | 'abandoned' | 'completed' | undefined
  >()
  const [branchFilter, setBranchFilter] = useState<string | undefined>()
  const [teamFilter, setTeamFilter] = useState<string | undefined>()
  const [sort, setSort] = useState<
    | 'recently_updated'
    | 'due_date'
    | 'highest_completion'
    | 'priority'
    | undefined
  >()
  const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const [selectedRow, setSelectedRow] =
    useState<TFetchPerformanceTaskProject | null>(null)

  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const [actionType, setActionType] = useState<
    'approve' | 'archive' | 'delete' | 'abandon' | null
  >(null)

  const navigate = useNavigate()

  const { data: performanceTaskProjects, isLoading: loading } =
    useFetchPerformanceTaskProjects(
      {
        page,
        perPage: 10,
        search_query: debouncedSearch ? debouncedSearch : undefined,
        team_id: teamFilter ? Number(teamFilter) : undefined,
        status: statusFilter ? statusFilter : undefined,
        is_archived: activeTab === 'archived' ? true : undefined,
        sort: sort ? sort : undefined,
      },
      (data) => data.data,
    )

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) => {
    return data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    }))
  })

  const { data: teams } = useFetchOrganizationTeams(
    {
      page: 1,
      perPage: 50,
      branch_id: branchFilter ? Number(branchFilter) : undefined,
    },
    (data) => {
      return data.data.results.map((team) => ({
        label: team.team_name,
        value: team.id.toString(),
      }))
    },
  )

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: 'active' },
    { label: 'Abandoned', value: 'abandoned' },
    { label: 'Completed', value: 'completed' },
  ]

  const sortOptions = [
    { label: 'Recently Updated', value: 'recently_updated' },
    { label: 'Due Date', value: 'due_date' },
    { label: 'Highest Completion', value: 'highest_completion' },
    { label: 'Priority', value: 'priority' },
  ]
  const updateProjectStatusMutationAsync = useUpdateProjectStatus()
  const deleteMutationAsync = useDeletePerformanceTaskProject()

  const handleAction = async () => {
    try {
      if (actionType === 'approve' && selectedRow) {
        await updateProjectStatusMutationAsync.mutateAsync({
          status: 'active',
          id: selectedRow.id,
        })
      } else if (actionType === 'delete' && selectedRow) {
        await deleteMutationAsync.mutateAsync(selectedRow.id)
      } else if (actionType === 'archive' && selectedRow) {
        await updateProjectStatusMutationAsync.mutateAsync({
          is_archived: true,
          id: selectedRow.id,
        })
      } else if (actionType === 'abandon' && selectedRow) {
        await updateProjectStatusMutationAsync.mutateAsync({
          status: 'abandoned',
          id: selectedRow.id,
        })
      }
      handleCloseConfirmation()
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenConfirmation = (
    row: TFetchPerformanceTaskProject,
    type: 'approve' | 'archive' | 'delete' | 'abandon',
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
    row: TFetchPerformanceTaskProject,
  ): TamsActionPopoverOption[] => [
    {
      label: 'Edit',
      action: () =>
        navigate({
          to: '/admin-dashboard/performance/task-management/edit',
          search: { projectId: row.id },
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
      hidden: row.status === 'active',
    },
    {
      label: 'Abandon',
      action: () => handleOpenConfirmation(row, 'abandon'),
      color: 'orange',
      icon: CheckCircleIcon,
      hidden: row.status === 'abandoned',
    },
    {
      label: 'Archive',
      action: () => handleOpenConfirmation(row, 'archive'),
      color: 'gray',
      icon: FolderIcon,
      hidden: row.is_archived,
    },
    {
      label: 'Delete',
      action: () => handleOpenConfirmation(row, 'delete'),
      color: 'red',
      icon: TrashIcon,
      hidden: !row.is_archived,
    },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (performanceTaskProjects?.results.length === 0 && !loading) {
      if (search?.length) {
        return emptyStates.performanceTaskProjects[1]
      }
      if (statusFilter) {
        return emptyStates.performanceTaskProjects[1]
      }
      if (teamFilter) {
        return emptyStates.performanceTaskProjects[1]
      }
      return emptyStates.performanceTaskProjects[0]
    }
    return emptyStates.performanceTaskProjects[0]
  }, [performanceTaskProjects?.results, search, statusFilter, teamFilter])
  return {
    page,
    setPage,
    search,
    setSearch,
    loading,
    tableData: performanceTaskProjects?.results,
    total: performanceTaskProjects?.total,
    statusFilter,
    setStatusFilter,
    branchFilter,
    setBranchFilter,
    handleCloseConfirmation,
    handleAction,
    actionType,
    openedConfirmation,
    emptyState,
    isPending:
      updateProjectStatusMutationAsync.isPending ||
      deleteMutationAsync.isPending,
    branches,
    teamFilter,
    setTeamFilter,
    teams,
    actionPopoverOptions,
    statusOptions,
    sort,
    setSort,
    sortOptions,
    displayType,
    setDisplayType,
  }
}

export default usePerformanceTaskProjects
