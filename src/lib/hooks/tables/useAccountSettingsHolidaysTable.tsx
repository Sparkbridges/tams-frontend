import { TamsTableActionPopover } from '#/components/molecules'
import {
  useCancelPublicHolidaySettings,
  useDeletePublicHolidaySettings,
  useGetPublicHolidaySettings,
} from '#/lib/api'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
} from '#/lib/types'
import { newDayjs } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { PenIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

const useAccountSettingsHolidaysTable = () => {
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all')
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationType, setCancellationType] = useState('none')
  const [cancellationError, setCancellationError] = useState('')
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)
  const [
    openedDetailDrawer,
    { open: openDetailDrawer, close: closeDetailDrawer },
  ] = useDisclosure(false)
  const [
    openedCancellation,
    { open: openCancellation, close: closeCancellation },
  ] = useDisclosure(false)

  const limit = 10

  const { data: publicHolidaySettings, isLoading } =
    useGetPublicHolidaySettings(
      {
        page: page,
        perPage: limit,
        search_query: search?.length ? search : undefined,
      },
      (data) => data.data,
    )

  const {
    mutateAsync: deletePublicHolidaySettings,
    isPending: isDeletingPublicHoliday,
  } = useDeletePublicHolidaySettings()

  const handleRowClick = (row: TamsTableData) => {
    setSelectedId(row.id as number)
    openDetailDrawer()
  }

  const {
    mutateAsync: cancelPublicHolidaySettingsAsync,
    isPending: isCancellingPublicHolidaySettings,
  } = useCancelPublicHolidaySettings()

  useEffect(() => {
    if (publicHolidaySettings?.results) {
      const formattedData = publicHolidaySettings.results.map((holiday) => ({
        id: holiday.id,
        name: holiday.name,
        date: newDayjs(holiday.date).format('dddd, DD MMM, YYYY'),
        reoccurence: holiday.is_recurring ? 'Yes' : 'No',
        status: holiday.status,
        type: holiday.type === 'public' ? 'National' : holiday.type,
      }))
      setTableData(formattedData)
      setTotal(publicHolidaySettings.total)
    }
  }, [publicHolidaySettings?.results, setTableData, setTotal])

  const handleDelete = async () => {
    try {
      await deletePublicHolidaySettings(selectedId as number)
      closeConfirmation()
      setSelectedId(null)
    } catch (error) {
      console.error('Failed to delete public holiday', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete public holiday',
        color: 'red',
      })
    }
  }

  const handleCancel = async () => {
    if (!cancellationReason && cancellationType === 'other') {
      setCancellationError('Cancellation reason is required')
      return
    }
    setCancellationError('')
    try {
      await cancelPublicHolidaySettingsAsync({
        id: selectedId as number,
        cancellation_reason: cancellationReason,
      })
      setSelectedId(null)
      setCancellationReason('')
      closeCancellation()
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        (error as Error).message
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
    {
      label: 'Edit',
      action: () => handleRowClick(row),
      color: '',
      icon: PenIcon,
    },
    ...(!['cancelled', 'completed'].includes(row.status as string)
      ? [
          {
            label: 'Cancel',
            action: () => {
              setSelectedId(row.id as number)
              openCancellation()
            },
            color: 'orange',
            icon: XIcon,
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
      label: 'ID',
      accessor: 'id',
      enableSorting: true,
    },
    {
      label: 'Holiday Name',
      accessor: 'name',
    },
    {
      label: 'Type',
      accessor: 'type',
    },
    {
      label: 'Date of holiday',
      accessor: 'date',
    },
    {
      label: 'Reoccurence',
      accessor: 'reoccurence',
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
    statusFilter,
    setStatusFilter,
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    isDeleting: isDeletingPublicHoliday,
    openedCancellation,
    closeCancellation,
    handleCancel,
    openCancellation,
    isCancelling: isCancellingPublicHolidaySettings,
    cancellationType,
    setCancellationType,
    cancellationReason,
    setCancellationReason,
    cancellationError,
    setCancellationError,
  }
}

export default useAccountSettingsHolidaysTable
