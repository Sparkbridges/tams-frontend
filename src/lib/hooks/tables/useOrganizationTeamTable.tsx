import { TamsTableActionPopover } from '#/components/molecules'
import {
  useDeleteOrganizationTeam,
  useFetchOrganizationTeams,
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

const useOrganizationTeamTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
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
  const { data: teams, isLoading } = useFetchOrganizationTeams(
    {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
    },
    (data) => data.data,
  )
  const { mutateAsync: deleteOrganizationTeam, isPending: isDeleting } =
    useDeleteOrganizationTeam()

  const navigate = useNavigate()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedRow(row)
    openDetailDrawer()
  }

  useEffect(() => {
    if (teams?.results) {
      const formattedData = teams.results.map((team) => ({
        id: team.id,
        teamName: team.team_name || '-',
        noOfMembers: team.no_members || '-',
        teamLead: team.team_head_name || '-',
        createdAt: team.created_at || '-',
        updatedAt: team.updated_at || '-',
        notes: team.description,
        teamMembers: team.members.map((member) => member.team_member_name),
      }))
      setTableData(formattedData)
      setTotal(teams.total)
    }
  }, [teams?.results, setTableData, setTotal])

  const handleDelete = async (type: 'single' | 'bulk') => {
    const payload = type === 'bulk' ? selectedIds : [selectedId as number]
    try {
      await deleteOrganizationTeam({ teamIds: payload })
      if (type === 'bulk') {
        closeBulkActionConfirmation()
        setSelectedIds([])
      }
      closeConfirmation()
     
    } catch (error) {
      console.error('Failed to delete organization team', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete organization team',
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
          to: `/admin-dashboard/organization/teams/edit`,
          search: { teamId: row.id as number },
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
      label: 'Team Name',
      accessor: 'teamName',
      enableSorting: true,
    },
    {
      label: 'No of Members',
      accessor: 'noOfMembers',
    },
    {
      label: 'Team Lead',
      accessor: 'teamLead',
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

export default useOrganizationTeamTable
