import { TamsTableActionPopover } from '#/components/molecules'
import {
  useDeleteHrmExemptionsApprover,
  useGetHrmExemptionsSettingsApprovals,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { useDisclosure } from '@mantine/hooks'
import { PenIcon, TrashIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'

const useHrmExemptionSettingsTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)
  const [
    openedEditDetailDrawer,
    { open: openEditDetailDrawer, close: closeEditDetailDrawer },
  ] = useDisclosure(false)

  const limit = 10

  const { data: exemptions, isLoading: isLoadingExemptions } =
    useGetHrmExemptionsSettingsApprovals(
      {
        page: page,
        perPage: limit,
        search_query: search?.length ? search : undefined,
      },
      (data) => data.data,
    )

  const { mutateAsync: deleteHrmExemptionSettings, isPending: isDeleting } =
    useDeleteHrmExemptionsApprover()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedId(row.id as number)
    openEditDetailDrawer()
  }

  useEffect(() => {
    if (exemptions?.results) {
      const formattedData = exemptions.results.map((item) => ({
        id: item.id,
        approvalListName: item.name,
        type: item.approval_types,
        approversCount: item.no_approvals,
      }))
      setTableData(formattedData)
      setTotal(exemptions.total)
    }
  }, [exemptions?.results, setTableData, setTotal])

  const handleDelete = async () => {
    try {
      await deleteHrmExemptionSettings([selectedId as number])
      closeConfirmation()
    } catch (error) {
      console.error('Failed to delete HRM exemption setting', error)
    }
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
      label: 'ID',
      accessor: 'id',
      enableSorting: true,
    },
    {
      label: 'Approval List Name',
      accessor: 'approvalListName',
    },
    {
      label: 'Exemption Type',
      accessor: 'type',
    },
    {
      label: 'No of Approvers',
      accessor: 'approversCount',
    },
    {
      label: '',
      accessor: 'actions',
      render: (row) => (
        <TamsTableActionPopover data={actionPopoverOptions(row)} />
      ),
    },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData?.length === 0 && !isLoadingExemptions) {
      if (search?.length) {
        return emptyStates.hrmExemptions[1]
      }
      return emptyStates.hrmExemptions[0]
    }
    return emptyStates.hrmExemptions[0]
  }, [tableData, search, isLoadingExemptions])

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
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    isDeleting,
    openedEditDetailDrawer,
    handleRowClick,
    closeEditDetailDrawer,
    selectedId,
    emptyState,
  }
}

export default useHrmExemptionSettingsTable
