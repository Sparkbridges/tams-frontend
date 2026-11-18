import {
  TamsNumberInput,
  TamsSelectInput,
  TamsTableActionPopover,
  TamsTextInput,
} from '#/components'
import {
  useFetchPerformanceAppraisalGeneralSettingsResponse,
  useFetchPerformanceAppraisalGradingSettings,
  useFetchPerformanceAppraiserSettings,
  useFetchPerformanceApproverSettings,
  useDeleteAppraisalPeopleSetting,
  useUpdatePerformanceAppraisalGeneralSettings,
  useUpdatePerformanceAppraisalGradingSettings,
} from '#/lib/api'
import { monthsOfYear } from '#/lib/constants'
import type { AppraisalSettingsTab } from '#/lib/constants'
import type {
  TamsTableData,
  TamsTableColumn,
  TamsActionPopoverOption,
} from '#/lib/types'
import type {
  TAppraisalPeriod,
  TPerformanceAppraisalGradingSettings,
  AppraisalPeopleKind,
} from '#/lib/types/api/performance'
import { ActionIcon } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { EyeIcon, PenIcon, TrashIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { dequal } from 'dequal'
import { newDayjs } from '#/lib/utils'

type Props = {
  activeTab: AppraisalSettingsTab
}

const usePerformanceAppraisalGGSettings = ({ activeTab }: Props) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selection, setSelection] = useState<{
    kind: AppraisalPeopleKind
    id: number
    name: string
    action: 'detail' | 'edit' | 'delete'
  } | null>(null)
  const deleteSetting = useDeleteAppraisalPeopleSetting()
  const [tableData, setTableData] = useState<TamsTableData[]>([])
  const [initializedTab, setInitializedTab] = useState<
    Props['activeTab'] | null
  >(null)

  const { data: generalSettingsData, isLoading: isLoadingGeneralSettings } =
    useFetchPerformanceAppraisalGeneralSettingsResponse(
      (data) => data.data[0],
      {
        page,
        perPage: 10,
      },
      activeTab === 'general',
    )

  const { data: approverSettingsData, isLoading: isLoadingApproverSettings } =
    useFetchPerformanceApproverSettings(
      (response) => ({
        total: response.data.total,
        results: response.data.results.map((setting) => ({
          id: setting.id,
          description: setting.name,
          assigned_by: setting.approval_type,
          appraisers_count: setting.no_approvers,
        })),
      }),
      { page, perPage: 10, ...(search ? { search_query: search } : {}) },
      activeTab === 'approver',
    )

  const { data: gradingSettingsData, isLoading: isLoadingGradingSettings } =
    useFetchPerformanceAppraisalGradingSettings(
      (data) => data.data,
      { page, perPage: 10 },
      activeTab === 'grading',
    )

  const { data: appraiserSettingsData, isLoading: isLoadingAppraiserSettings } =
    useFetchPerformanceAppraiserSettings(
      (data) => {
        return {
          total: data.data.total,
          results:
            data.data.results?.map((r) => ({
              description: r.description,
              assigned_by: r.category_type,
              id: r.id,
              appraisers_count: r.no_approvals,
            })) ?? [],
        }
      },
      {
        page,
        perPage: 10,
        ...(search ? { search_query: search } : {}),
      },
      activeTab === 'appraiser',
    )

  const updatePerformanceAppraisalGeneralSettings =
    useUpdatePerformanceAppraisalGeneralSettings()

  const updatePerformanceAppraisalGradingSettings =
    useUpdatePerformanceAppraisalGradingSettings()

  const activeSettingsData =
    activeTab === 'general'
      ? generalSettingsData?.appraisalPeriods
      : activeTab === 'grading'
        ? gradingSettingsData
        : activeTab === 'appraiser'
          ? appraiserSettingsData?.results
          : approverSettingsData?.results

  useEffect(() => {
    if (activeSettingsData) {
      setTableData(activeSettingsData)
      setInitializedTab(activeTab)
    }
  }, [activeSettingsData, activeTab])

  const { hasChanges } = useMemo(() => {
    if (activeTab !== 'general' && activeTab !== 'grading') {
      return { hasChanges: false }
    }
    const original =
      activeTab === 'general'
        ? generalSettingsData?.appraisalPeriods
        : activeTab === 'grading'
          ? gradingSettingsData
          : undefined

    if (initializedTab !== activeTab || original === undefined) {
      return { hasChanges: false }
    }

    const originalById = new Map<number, TamsTableData>(
      original.map((row) => [row.id, row]),
    )
    const originalIds = new Set(original.map((row) => row.id))
    const hasAddedRows = tableData.some(
      (row) => !originalIds.has(row.id as number),
    )
    const currentIds = new Set(tableData.map((r) => r.id))

    const changedRowss = tableData.filter((row) => {
      const orig = originalById.get(row.id as number)
      return orig !== undefined && !dequal(orig, row)
    })

    const deletedRowss = original.filter((o) => !currentIds.has(o.id))

    return {
      hasChanges:
        changedRowss.length > 0 || deletedRowss.length > 0 || hasAddedRows,
    }
  }, [
    activeTab,
    tableData,
    generalSettingsData,
    gradingSettingsData,
    initializedTab,
  ])

  const handleRowClick = useCallback(
    (row: TamsTableData) => {
      if (
        (activeTab === 'appraiser' || activeTab === 'approver') &&
        typeof row.id === 'number' &&
        typeof row.description === 'string'
      ) {
        setSelection({
          kind: activeTab,
          id: row.id,
          name: row.description,
          action: 'detail',
        })
      }
    },
    [activeTab],
  )

  const actionPopoverOptions = useCallback(
    (row: TamsTableData): TamsActionPopoverOption[] => {
      if (
        (activeTab !== 'appraiser' && activeTab !== 'approver') ||
        typeof row.id !== 'number' ||
        typeof row.description !== 'string'
      )
        return []
      const selected = {
        kind: activeTab,
        id: row.id,
        name: row.description,
      }
      return [
        {
          label: 'View Details',
          action: () => setSelection({ ...selected, action: 'detail' }),
          color: '',
          icon: EyeIcon,
        },
        {
          label: 'Edit',
          action: () => setSelection({ ...selected, action: 'edit' }),
          color: '',
          icon: PenIcon,
        },
        {
          label: 'Delete',
          action: () => {
            deleteSetting.reset()
            setSelection({ ...selected, action: 'delete' })
          },
          color: 'red',
          icon: TrashIcon,
        },
      ]
    },
    [activeTab, deleteSetting.reset],
  )

  useEffect(() => {
    setPage(1)
    setSearch('')
    setSelection(null)
  }, [activeTab])

  const handleDeleteSetting = async () => {
    if (selection?.action !== 'delete' || deleteSetting.isPending) return
    try {
      await deleteSetting.mutateAsync({
        kind: selection.kind,
        id: selection.id,
      })
      setSelection(null)
    } catch (error) {
      console.error(`Failed to delete ${selection.kind} settings`, error)
    }
  }

  const columns = useMemo((): TamsTableColumn[] => {
    if (activeTab === 'general') {
      return [
        {
          label: 'Title',
          accessor: '',
          render(row) {
            const rowData = row as TAppraisalPeriod
            return (
              <TamsTextInput
                onChange={(e) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item.id === rowData.id
                        ? { ...item, name: e.target.value }
                        : item,
                    ),
                  )
                }}
                className="w-50"
                value={rowData?.name}
              />
            )
          },
        },
        {
          label: 'Start Month',
          accessor: '',
          render(row) {
            const rowData = row as TAppraisalPeriod
            return (
              <TamsSelectInput
                onChange={(e) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item.id === rowData.id
                        ? { ...item, start_month: Number(e) }
                        : item,
                    ),
                  )
                }}
                className="w-50"
                value={rowData?.start_month?.toString()}
                data={monthsOfYear}
              />
            )
          },
        },
        {
          label: 'End Month',
          accessor: '',
          render(row) {
            const rowData = row as TAppraisalPeriod
            return (
              <TamsSelectInput
                onChange={(e) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item.id === rowData.id
                        ? { ...item, end_month: Number(e) }
                        : item,
                    ),
                  )
                }}
                className="w-50"
                value={rowData?.end_month?.toString()}
                data={monthsOfYear}
              />
            )
          },
        },
        {
          label: 'Action',
          accessor: '',
          render(row) {
            return (
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => {
                  setTableData((prev) =>
                    prev.filter((item) => item.id !== row.id),
                  )
                }}
              >
                <TrashIcon size={20} />
              </ActionIcon>
            )
          },
        },
      ]
    }
    if (activeTab === 'grading') {
      return [
        {
          label: 'Grade',
          accessor: '',
          render(row) {
            const rowData = row as TPerformanceAppraisalGradingSettings
            return (
              <TamsTextInput
                className="w-50"
                value={rowData?.label}
                onChange={(e) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item.id === rowData.id
                        ? { ...item, label: e.target.value }
                        : item,
                    ),
                  )
                }}
              />
            )
          },
        },
        {
          label: 'Min Score',
          accessor: '',
          render(row) {
            const rowData = row as TPerformanceAppraisalGradingSettings
            return (
              <TamsNumberInput
                max={100}
                min={0}
                className="w-50"
                onChange={(e) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item.id === rowData.id
                        ? { ...item, min_score: Number(e) }
                        : item,
                    ),
                  )
                }}
                value={rowData?.min_score}
              />
            )
          },
        },
        {
          label: 'Max Score',
          accessor: '',
          render(row) {
            const rowData = row as TPerformanceAppraisalGradingSettings
            return (
              <TamsNumberInput
                max={100}
                min={0}
                className="w-50"
                onChange={(e) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item.id === rowData.id
                        ? { ...item, max_score: Number(e) }
                        : item,
                    ),
                  )
                }}
                value={rowData?.max_score}
              />
            )
          },
        },
        {
          label: 'Date added',
          enableSorting: true,
          accessor: 'created_at',
          render(row) {
            const rowData = row as TPerformanceAppraisalGradingSettings
            return (
              <p>
                {newDayjs(rowData?.created_at).format('DD-MM-YYYY [at] HH:mm')}
              </p>
            )
          },
        },
        {
          label: 'Action',
          accessor: '',
          render(row) {
            return (
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => {
                  setTableData((prev) =>
                    prev.filter((item) => item.id !== row.id),
                  )
                }}
              >
                <TrashIcon size={20} />
              </ActionIcon>
            )
          },
        },
      ]
    }

    if (activeTab === 'appraiser' || activeTab === 'approver') {
      return [
        {
          label: activeTab === 'appraiser' ? 'Appraiser Name' : 'Approver Name',
          accessor: 'description',
        },
        {
          label:
            activeTab === 'appraiser' ? 'No of Appraisers' : 'No of Approvers',
          accessor: 'appraisers_count',
        },
        {
          label: activeTab === 'appraiser' ? 'Assign by' : 'Approval Type',
          accessor: 'assigned_by',
        },
        {
          label: '',
          accessor: 'actions',
          render(row) {
            return <TamsTableActionPopover data={actionPopoverOptions(row)} />
          },
        },
      ]
    }
    return []
  }, [activeTab, actionPopoverOptions])

  const handleValidateOverlappingAppraisalPeriods = () => {
    const usedMonths = new Set<number>()

    for (const period of tableData as TAppraisalPeriod[]) {
      if (period.start_month > period.end_month) {
        notifications.show({
          title: 'Invalid appraisal period',
          message:
            'The start month must be before or the same as the end month.',
          color: 'red',
        })
        return false
      }

      for (let month = period.start_month; month <= period.end_month; month++) {
        if (usedMonths.has(month)) {
          const monthName =
            monthsOfYear.find((item) => Number(item.value) === month)?.label ??
            String(month)

          notifications.show({
            title: 'Overlapping appraisal periods',
            message: `${monthName} is already included in another appraisal period. Choose months that do not overlap.`,
            color: 'red',
          })
          return false
        }

        usedMonths.add(month)
      }
    }
    return true
  }

  const handleValidateGradingSettings = () => {
    const usedGrades = new Set<number>()
    for (const grade of tableData as TPerformanceAppraisalGradingSettings[]) {
      if (grade.min_score > grade.max_score) {
        notifications.show({
          title: 'Invalid grading setting',
          message:
            'The minimum score must be less than or equal to the maximum score.',
          color: 'red',
        })
        return false
      }
      if (usedGrades.has(grade.min_score) || usedGrades.has(grade.max_score)) {
        notifications.show({
          title: 'Overlapping grading settings',
          message: 'The score range overlaps with another grading setting.',
          color: 'red',
        })
        return false
      }
      usedGrades.add(grade.min_score)
      usedGrades.add(grade.max_score)
    }
    return true
  }

  const handleConfirm = async () => {
    try {
      if (activeTab === 'general') {
        if (!handleValidateOverlappingAppraisalPeriods()) return
        await updatePerformanceAppraisalGeneralSettings.mutateAsync({
          appraisals: tableData.map((item) => ({
            start_month: Number(item.start_month),
            end_month: Number(item.end_month),
            name: item.name as string,
            id: item.id ? Number(item.id) : undefined,
          })),
          id: generalSettingsData?.id as number,
        })
      }
      if (activeTab === 'grading') {
        if (!handleValidateGradingSettings()) return
        await updatePerformanceAppraisalGradingSettings.mutateAsync({
          grades: tableData.map((item) => ({
            label: item.label as string,
            min_score: Number(item.min_score),
            max_score: Number(item.max_score),
            id: item.id ? Number(item.id) : undefined,
          })),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    setTableData(
      activeTab === 'general'
        ? (generalSettingsData?.appraisalPeriods as TAppraisalPeriod[])
        : (gradingSettingsData as TPerformanceAppraisalGradingSettings[]),
    )
  }

  const handleAddAppraisalPeriod = () => {
    const newPayload =
      activeTab === 'general'
        ? {
            start_month: 0,
            end_month: 0,
            name: '',
          }
        : ({
            label: '',
            min_score: 0,
            max_score: 0,
          } as any)

    setTableData((prev) => [...prev, newPayload])
  }

  return {
    columns,
    page,
    setPage,
    search,
    setSearch: (value: string) => {
      setSearch(value)
      setPage(1)
    },
    tableData,
    setTableData,
    loading:
      activeTab === 'general'
        ? isLoadingGeneralSettings
        : activeTab === 'grading'
          ? isLoadingGradingSettings
          : activeTab === 'appraiser'
            ? isLoadingAppraiserSettings
            : isLoadingApproverSettings,
    hasChanges,
    handleConfirm,
    handleCancel,
    actionLoading:
      updatePerformanceAppraisalGeneralSettings.isPending ||
      updatePerformanceAppraisalGradingSettings.isPending,
    handleAddAppraisalPeriod,
    total:
      activeTab === 'appraiser'
        ? (appraiserSettingsData?.total ?? 0)
        : activeTab === 'approver'
          ? (approverSettingsData?.total ?? 0)
          : tableData.length,
    selection,
    closeSelection: () => setSelection(null),
    editSelection: () =>
      setSelection((previous) =>
        previous ? { ...previous, action: 'edit' } : null,
      ),
    handleRowClick,
    handleDeleteSetting,
    deleting: deleteSetting.isPending,
    deleteError: deleteSetting.error,
  }
}

export default usePerformanceAppraisalGGSettings
