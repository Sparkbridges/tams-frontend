import { TamsTableActionPopover } from '#/components/molecules'
import {
  useArchiveRecruitmentJobPosting,
  useDeleteRecruitmentJobPosting,
  useFetchRecruitmentJobPostings,
  useFetchRecruitmentJobPostingsArchived,
  useRecruitmentAccess,
  useRestoreArchivedRecruitmentJobPostings,
  useUpdateRecruitmentJobPostingStatus,
} from '#/lib/api/services/recruitment'
import { emptyStates } from '#/lib/constants'
import { useTamsStore } from '#/lib/store'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { newDayjs } from '#/lib/utils'
import { useClipboard, useDisclosure } from '@mantine/hooks'
import {
  ArchiveBoxIcon,
  ArrowCircleDownIcon,
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  CopyIcon,
  PaperPlaneTiltIcon,
  PenIcon,
  ShareFatIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

const limit = 10

type TActionType = 'publish' | 'delete' | 'unpublish' | 'archive' | 'restore'

const useRecruitmentJobPostingsTable = ({
  activeTab,
}: {
  activeTab: 'all' | 'archived'
}) => {
  const {
    canDeleteJobPosting,
    canViewJobPostingDetails,
    canPublishJobPosting,
  } = useRecruitmentAccess()
  const { setToast } = useTamsStore((data) => data)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [workModeFilter, setWorkModeFilter] = useState<string | undefined>()
  const [jobTypeFilter, setJobTypeFilter] = useState<string | undefined>()
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const [actionType, setActionType] = useState<TActionType>()

  const [
    openedDetailDrawer,
    { open: openDetailDrawer, close: closeDetailDrawer },
  ] = useDisclosure(false)

  const { data: jobPostings, isLoading: loading } =
    useFetchRecruitmentJobPostings(
      {
        page: page,
        per_page: limit,
        search_query: search?.length ? search : undefined,
        type: jobTypeFilter,
        status: statusFilter,
        work_mode: workModeFilter,
      },
      (data) => {
        return {
          data: data.data.results.map((item) => ({
            id: item.id,
            role: item.role,
            work_mode: item.work_mode,
            type: item.type,
            status: item.status,
            job_request_id: item.job_request_id,
            request_date: newDayjs(item.created_at).format('YYYY-MM-DD'),
            uuid: item.uuid,
          })),
          total: data.data.total,
        }
      },
    )

  const { data: jobPostingsArchived, isLoading: loadingArchived } =
    useFetchRecruitmentJobPostingsArchived(
      {
        page: page,
        per_page: limit,
        search_query: search?.length ? search : undefined,
        type: jobTypeFilter,
        status: statusFilter,
        work_mode: workModeFilter,
      },
      (data) => {
        return {
          data: data.data.results.map((item) => ({
            id: item.id,
            role: item.role,
            work_mode: item.work_mode,
            type: item.type,
            status: item.status,
            job_request_id: item.job_request_id,
            request_date: newDayjs(item.created_at).format('YYYY-MM-DD'),
            uuid: item.uuid,
          })),
          total: data.data.total,
        }
      },
    )

  const tableData = useMemo(() => {
    return activeTab === 'archived'
      ? jobPostingsArchived?.data || []
      : jobPostings?.data || []
  }, [jobPostings, jobPostingsArchived, activeTab])

  const { mutateAsync: mutateAsyncUpdateStatus, isPending: isPendingUpdate } =
    useUpdateRecruitmentJobPostingStatus()

  const {
    mutateAsync: mutateAsyncDeleteJobPosting,
    isPending: isPendingDelete,
  } = useDeleteRecruitmentJobPosting()

  const {
    mutateAsync: mutateAsyncRestoreArchivedJobPostings,
    isPending: isPendingRestore,
  } = useRestoreArchivedRecruitmentJobPostings()

  const {
    mutateAsync: mutateAsyncArchiveJobPosting,
    isPending: isPendingArchive,
  } = useArchiveRecruitmentJobPosting()

  const navigate = useNavigate()

  const clipboard = useClipboard({ timeout: 500 })

  const handleRowClick = (row: TamsTableData) => {
    if (activeTab === 'archived' || !canViewJobPostingDetails) return
    setSelectedId(Number(row.id))
    openDetailDrawer()
  }

  const handleAction = async () => {
    try {
      if (actionType === 'delete') {
        await mutateAsyncDeleteJobPosting({ ids: [Number(selectedId)] })
      } else if (actionType === 'restore') {
        await mutateAsyncRestoreArchivedJobPostings({
          ids: [Number(selectedId)],
        })
      } else if (actionType === 'archive') {
        await mutateAsyncArchiveJobPosting(Number(selectedId))
      } else {
        await mutateAsyncUpdateStatus({
          id: Number(selectedId),
          status: actionType,
        })
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to perform action on talent request', error)
    }
  }

  const setupAction = (id: number, type: TActionType) => {
    setSelectedId(id)
    setActionType(type)
    openConfirmation()
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => {
    const status = row.status as 'active' | 'inactive' | 'draft'
    return activeTab === 'archived'
      ? [
          {
            label: 'Restore',
            action: () => {
              setupAction(row.id as number, 'restore')
            },
            color: 'green',
            icon: ArrowCounterClockwiseIcon,
          },
          {
            label: 'Delete',
            action: () => {
              setupAction(row.id as number, 'delete')
            },
            color: 'red',
            icon: TrashIcon,
            hidden: !canDeleteJobPosting || !!row.job_request_id,
          },
        ]
      : [
          {
            label: 'Edit',
            action: () =>
              navigate({
                to: `/admin-dashboard/recruitment/job-postings/edit`,
                search: { id: row.id as number },
              }),
            color: '',
            icon: PenIcon,
          },
          {
            label: 'Publish Job',
            action: () => {
              setupAction(row.id as number, 'publish')
            },
            color: 'green',
            icon: CheckCircleIcon,
            hidden: status === 'active' || !canPublishJobPosting,
          },
          {
            label: 'UnPublish Job',
            action: () => {
              setupAction(row.id as number, 'unpublish')
            },
            color: 'gold',
            icon: ArrowCircleDownIcon,
            hidden: status !== 'active' || !canPublishJobPosting,
          },
          {
            label: 'Redirect Url',
            action: () => {
              window.open(
                `${import.meta.env.VITE_WEBSITE_BASE_URL}/jobs/${row.uuid}`,
                '_blank',
              )
            },
            color: '',
            icon: ShareFatIcon,
            hidden: row.status !== 'active',
          },
          {
            label: clipboard.copied ? 'Copied!' : 'Copy Url',
            action: () => {
              clipboard.copy(
                `${import.meta.env.VITE_WEBSITE_BASE_URL}/jobs/${row.uuid}`,
              )
              setToast({ message: 'Copied!', type: 'success' })
            },
            color: '',
            icon: CopyIcon,
            hidden: row.status !== 'active',
          },
          {
            label: 'Archive',
            action: () => {
              setupAction(row.id as number, 'archive')
            },
            color: 'gray',
            icon: ArchiveBoxIcon,
            hidden: status === 'active',
          },
          {
            label: 'Track Applicants',
            action: () => {
              navigate({
                to: `/admin-dashboard/recruitment/ats/tracking/$id`,
                params: { id: row.id as string },
              })
            },
            color: 'grape',
            icon: PaperPlaneTiltIcon,
            hidden: status !== 'active',
          },
        ]
  }

  const columns: TamsTableColumn[] = [
    {
      label: 'Role',
      accessor: 'role',
    },
    {
      label: 'Work mode',
      accessor: 'work_mode',
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
      label: 'Request Date',
      accessor: 'request_date',
      enableSorting: true,
    },
    {
      label: '',
      accessor: 'actions',
      render: (row) => (
        <TamsTableActionPopover data={actionPopoverOptions(row)} />
      ),
    },
  ]

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Draft', value: 'draft' },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData?.length === 0 && !loading) {
      if (search?.length) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (statusFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (workModeFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (jobTypeFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      return emptyStates.recruitmentTalentRequests[0]
    }
    return emptyStates.recruitmentTalentRequests[0]
  }, [tableData, search, statusFilter, workModeFilter, jobTypeFilter])

  return {
    columns,
    tableData,
    loading: activeTab === 'archived' ? loadingArchived : loading,
    page,
    setPage,
    limit,
    search,
    setSearch,
    total:
      activeTab === 'archived'
        ? jobPostingsArchived?.total
        : jobPostings?.total,
    statusFilter,
    setStatusFilter,
    openedConfirmation,
    closeConfirmation,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    statusOptions,
    workModeFilter,
    setWorkModeFilter,
    jobTypeFilter,
    setJobTypeFilter,
    handleAction,
    isPending:
      isPendingUpdate ||
      isPendingDelete ||
      isPendingRestore ||
      isPendingArchive,
    actionType,
    emptyState,
  }
}

export default useRecruitmentJobPostingsTable
